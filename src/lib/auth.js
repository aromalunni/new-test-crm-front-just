// Tiny client-side session helper for the demo login. Persists the chosen role
// so the app shell stays accessible on refresh and can guard its routes.
const KEY = 'flarize_role'

export function setSession(role) {
  try {
    localStorage.setItem(KEY, role)
  } catch {
    /* ignore storage errors (private mode, etc.) */
  }
}

export function getSession() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

export function isAuthed() {
  return !!getSession()
}
