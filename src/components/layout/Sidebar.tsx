import { useState } from "react"
import { motion } from "framer-motion"

interface SidebarProps {
  activeSection: string
  onNavigate: (s: string) => void
}

const NAV = [
  { id: "overview",  label: "Overview",    icon: "▦" },
  { id: "markets",   label: "Markets",     icon: "↗" },
  { id: "geography", label: "Geography",   icon: "◎" },
  { id: "trends",    label: "Trends",      icon: "∿" },
]

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{
        background: "var(--ink-2)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? "20px 14px" : "20px 20px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}>
        {!collapsed && (
          <div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 800,
              color: "var(--text-1)",
              letterSpacing: "2px",
              textTransform: "uppercase",
              lineHeight: 1,
            }}>
              EV<span style={{ color: "var(--amber)" }}>IQ</span>
            </div>
            <div style={{
              fontFamily: "var(--font-data)",
              fontSize: 9,
              color: "var(--text-3)",
              letterSpacing: "1.5px",
              marginTop: 3,
            }}>
              ANALYTICS
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 800,
            color: "var(--amber)",
          }}>EV</div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-3)",
            cursor: "pointer",
            fontSize: 14,
            padding: 4,
            flexShrink: 0,
          }}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* Data source badge */}
      {!collapsed && (
        <div style={{
          margin: "12px 16px",
          padding: "8px 10px",
          background: "var(--amber-dim)",
          border: "1px solid var(--amber-mid)",
          borderRadius: 4,
          borderLeft: "3px solid var(--amber)",
        }}>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--amber)", letterSpacing: "1px" }}>
            DATA SOURCE
          </div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--text-1)", marginTop: 2 }}>
            IEA · CC BY 4.0
          </div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-3)", marginTop: 2 }}>
            12,654 records · 2024
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ padding: collapsed ? "8px 8px" : "8px", flex: 1 }}>
        {NAV.map(item => {
          const active = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 10px" : "10px 12px",
                borderRadius: 6,
                border: "none",
                background: active ? "var(--ink-4)" : "transparent",
                borderLeft: active ? "2px solid var(--amber)" : "2px solid transparent",
                color: active ? "var(--text-1)" : "var(--text-3)",
                cursor: "pointer",
                marginBottom: 2,
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  letterSpacing: "0.3px",
                }}>
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{
          padding: "16px",
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-3)", letterSpacing: "1px", marginBottom: 4 }}>
            COVERAGE
          </div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--text-2)" }}>
            40+ regions · 2010–2023
          </div>
        </div>
      )}
    </motion.aside>
  )
}
