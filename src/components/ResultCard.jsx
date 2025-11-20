import { useEffect, useState, useRef } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Maximize2,
  Minimize2,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

export default function ResultCard({ summary }) {
  if (!summary) return null;

  const { risk, sintomas, labs, answers } = summary;

  const [showChart, setShowChart] = useState(() => {
    return localStorage.getItem("pref_showChart") === "true";
  });

  const [zoom, setZoom] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("pref_showChart", showChart);
  }, [showChart]);

  const riskStyles = {
    BAJO: {
      label: "Riesgo bajo",
      color: "bg-emerald-500",
      badge: "bg-emerald-500/20 text-emerald-200 border-emerald-500/50",
      border: "border-emerald-500/40",
      icon: CheckCircle2,
    },
    MODERADO: {
      label: "Riesgo moderado",
      color: "bg-amber-500",
      badge: "bg-amber-500/20 text-amber-100 border-amber-500/50",
      border: "border-amber-500/40",
      icon: Info,
    },
    ALTO: {
      label: "Riesgo alto",
      color: "bg-rose-500",
      badge: "bg-rose-500/20 text-rose-100 border-rose-500/50",
      border: "border-rose-500/40",
      icon: AlertTriangle,
    },
  };

  const style = riskStyles[risk] || riskStyles.BAJO;
  const Icon = style.icon;

  const labData = labs?.valores ?? [];

  return (
    <>
      {/* ZOOM FULLSCREEN */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-4 relative"
            >
              <button
                onClick={() => setZoom(false)}
                className="absolute top-3 right-3 text-slate-300 hover:text-white"
              >
                <Minimize2 size={22} />
              </button>

              <div className="h-[340px]" ref={chartRef}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={labData}>
                    <XAxis dataKey="label" stroke="#cbd5f5" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        border: "1px solid #1e293b",
                      }}
                    />
                    {labData.map((d, i) => (
                      <ReferenceLine key={i} y={d.min} stroke="#22c55e" />
                    ))}
                    {labData.map((d, i) => (
                      <ReferenceLine key={`mx-${i}`} y={d.max} stroke="#f97316" />
                    ))}
                    <Bar dataKey="valor" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TARJETA PRINCIPAL */}
      <div
        className={`rounded-2xl border ${style.border} bg-slate-900/90 px-4 py-4 sm:px-5 sm:py-5 shadow-xl shadow-black/30`}
      >
        {/* Barra de riesgo */}
        <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden mb-3">
          <div
            className={`h-full ${style.color}`}
            style={{
              width:
                risk === "ALTO"
                  ? "100%"
                  : risk === "MODERADO"
                  ? "60%"
                  : "30%",
            }}
          />
        </div>

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-600 flex items-center justify-center">
              <Icon className="text-emerald-300" size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Resultado orientativo</p>
              <p className="text-sm font-semibold text-slate-50">
                Evaluación general
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${style.badge}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {style.label}
          </span>
        </div>

        {/* Datos básicos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 mb-3">
          <div>
            <p className="text-slate-500">Género</p>
            <p className="font-medium">{answers?.datos_generales_genero}</p>
          </div>
          <div>
            <p className="text-slate-500">Edad</p>
            <p className="font-medium">{answers?.datos_generales_edad}</p>
          </div>
          <div>
            <p className="text-slate-500">Antecedentes</p>
            <p className="font-medium">
              {answers?.datos_generales_antecedentes}
            </p>
          </div>
        </div>

        {/* Síntomas */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-200 mb-1">
            Evaluación por síntomas ({sintomas.puntaje})
          </p>
          <p className="text-[11px] text-slate-300 whitespace-pre-line">
            {sintomas.texto}
          </p>
        </div>

        {/* Laboratorios */}
        {labData.length > 0 && (
          <div className="mb-3 min-h-fit">
            <p className="text-xs font-semibold text-slate-200 mb-1">
              Interpretación de laboratorios
            </p>
            <p className="text-[11px] text-slate-300 whitespace-pre-line">
              {labs.texto}
            </p>

            {/* ESTE ES EL BOTÓN QUE AHORA SÍ SE VE SIEMPRE */}
            <div className="flex-shrink-0 min-h-[40px] mt-2">
              <button
                onClick={() => setShowChart(!showChart)}
                className="flex items-center gap-2 text-xs font-medium text-sky-300 hover:text-sky-400 transition w-full py-1"
              >
                <BarChart3 size={14} />
                {showChart ? "Ocultar gráfico" : "Ver gráfico de laboratorio"}
                {showChart ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Contenedor animado */}
            <AnimatePresence>
              {showChart && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 200 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <div className="h-48 mt-1 bg-slate-900/80 border border-slate-700 rounded-xl relative p-2">
                    <button
                      onClick={() => setZoom(true)}
                      className="absolute top-2 right-2 text-sky-300 hover:text-sky-400"
                    >
                      <Maximize2 size={18} />
                    </button>

                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={labData}>
                        <XAxis dataKey="label" stroke="#cbd5f5" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#020617",
                            border: "1px solid #1e293b",
                          }}
                        />
                        {labData.map((d, i) => (
                          <ReferenceLine key={i} y={d.min} stroke="#22c55e" />
                        ))}
                        {labData.map((d, i) => (
                          <ReferenceLine
                            key={`mx-${i}`}
                            y={d.max}
                            stroke="#f97316"
                          />
                        ))}
                        <Bar dataKey="valor" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}
