import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

export default function MessageBubble({ from = 'bot', text }) {
  const isUser = from === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex w-full mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex items-end gap-2 max-w-[85%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
            isUser
              ? 'border-sky-500/60 bg-sky-500/10 text-sky-200'
              : 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        <div
          className={`rounded-2xl px-4 py-2 text-sm leading-relaxed shadow/10 shadow-black/40 whitespace-pre-line ${
            isUser
              ? 'bg-sky-500 text-white rounded-br-sm'
              : 'bg-slate-800/80 text-slate-50 border border-slate-700/70 rounded-bl-sm'
          }`}
        >
          {text}
        </div>
      </div>
    </motion.div>
  );
}
