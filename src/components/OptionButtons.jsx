import { motion } from 'framer-motion';

export default function OptionButtons({
  options = [],
  multiSelect = false,
  selectedValues = [],
  onClick,
}) {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt, idx) => {
        const isSelected = selectedValues.includes(opt.value);

        return (
          <motion.button
            key={opt.value}
            type="button"
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02 }}
            onClick={() => onClick(opt.value)}
            className={`rounded-full border px-3 py-1.5 text-xs sm:text-sm font-medium shadow-sm backdrop-blur
            ${
              multiSelect
                ? isSelected
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'bg-slate-900/60 text-slate-200 border-slate-600 hover:border-sky-400 hover:text-sky-200'
                : 'bg-slate-900/60 text-slate-200 border-slate-700 hover:border-sky-400 hover:text-sky-200'
            }`}
          >
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}
