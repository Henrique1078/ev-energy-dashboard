import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function Header() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: "rgba(6, 13, 31, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 212, 255, 0.15)",
        padding: "0 32px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Scanline effect */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.03) 50%)",
        backgroundSize: "100% 4px",
        pointerEvents: "none",
        opacity: 0.4,
      }} />

      {/* Left — Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,153,204,0.1))",
            border: "1px solid rgba(0,212,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: "0 0 20px rgba(0,212,255,0.3)",
          }}>
            ⚡
          </div>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: "absolute",
              top: -2, right: -2,
              width: 8, height: 8,
              borderRadius: "50%",
              background: "var(--color-acid)",
              boxShadow: "0 0 8px var(--color-acid)",
            }}
          />
        </div>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            letterSpacing: "2px",
            textTransform: "uppercase",
            lineHeight: 1,
          }}>
            EV Intelligence
          </h1>
          <p style={{
            fontFamily: "var(--font-data)",
            fontSize: 10,
            color: "var(--color-electric)",
            letterSpacing: "1.5px",
            opacity: 0.8,
          }}>
            GLOBAL ELECTRIC VEHICLE ANALYTICS
          </p>
        </div>
      </div>

      {/* Center — Status Bar */}
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {[
          { label: "DATA SOURCE", value: "IEA 2024" },
          { label: "LICENSE", value: "CC BY 4.0" },
          { label: "COVERAGE", value: "40+ REGIONS" },
          { label: "RECORDS", value: "12,654" },
        ].map(item => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--color-text-muted)", letterSpacing: "1px" }}>
              {item.label}
            </div>
            <div style={{ fontFamily: "var(--font-data)", fontSize: 12, color: "var(--color-electric)", fontWeight: 500 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Right — Clock */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "var(--font-data)",
            fontSize: 20,
            color: "var(--color-text-primary)",
            fontWeight: 500,
            letterSpacing: "2px",
            lineHeight: 1,
          }}>
            {time.toLocaleTimeString("en-US", { hour12: false })}
          </div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)", letterSpacing: "1px" }}>
            {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
          </div>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "var(--color-acid)",
            boxShadow: "0 0 12px var(--color-acid)",
          }}
        />
      </div>
    </motion.header>
  )
}
