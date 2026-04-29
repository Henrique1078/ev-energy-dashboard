import { motion } from "framer-motion"

export function Skeleton({ height = 100, style = {} }: { height?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{
        height,
        background: "var(--ink-3)",
        border: "1px solid var(--border)",
        borderRadius: 0,
        ...style,
      }}
    />
  )
}
