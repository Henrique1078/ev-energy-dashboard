import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  delay?: number
  style?: React.CSSProperties
}

export function Card({ children, title, subtitle, delay = 0, style }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px',
        ...style,
      }}
    >
      {title && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
          }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{
              fontSize: 12,
              color: 'var(--color-text-muted)',
              margin: '2px 0 0',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  )
}
