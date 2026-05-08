import { stateColor } from "./format"

export function StatePill({ state }: { state: string }) {
  const c = stateColor(state)
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        borderRadius: 999,
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`,
      }}
    >
      {state}
    </span>
  )
}
