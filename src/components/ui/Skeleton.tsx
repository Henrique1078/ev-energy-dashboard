import { motion } from 'framer-motion'

interface SkeletonProps {
  height?: number
  borderRadius?: number
  style?: React.CSSProperties
}

export function Skeleton({ height = 100, borderRadius = 12, style }: SkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--color-bg-card) 0%, var(--color-bg-card-hover) 50%, var(--color-bg-card) 100%)',
        border: '1px solid var(--color-border)',
        ...style,
      }}
    />
  )
}
