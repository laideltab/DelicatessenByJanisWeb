import type { Access, FieldAccess } from "payload"

export type Role = "admin" | "editor" | "viewer"

/** Coerce an unknown user object into a known role, or null if none. */
export function userRole(user: unknown): Role | null {
  if (!user || typeof user !== "object") return null
  const role = (user as { role?: unknown }).role
  if (role === "admin" || role === "editor" || role === "viewer") {
    return role
  }
  return null
}

export function hasRole(user: unknown, ...roles: Role[]): boolean {
  const r = userRole(user)
  return r !== null && roles.includes(r)
}

// ─── Collection-level access ─────────────────────────────────────────────────

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

export const isAdmin: Access = ({ req }) => hasRole(req.user, "admin")

export const isAdminOrEditor: Access = ({ req }) =>
  hasRole(req.user, "admin", "editor")

export const isStaff: Access = ({ req }) =>
  hasRole(req.user, "admin", "editor", "viewer")

/** Admins can act on any user; non-admins can only act on themselves. */
export const isAdminOrSelf: Access = ({ req, id }) => {
  if (hasRole(req.user, "admin")) return true
  if (req.user && id && (req.user as { id?: unknown }).id === id) return true
  return false
}

// ─── Field-level access ──────────────────────────────────────────────────────

export const fieldIsAdmin: FieldAccess = ({ req }) => hasRole(req.user, "admin")
