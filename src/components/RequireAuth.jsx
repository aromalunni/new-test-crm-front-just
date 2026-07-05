import { Navigate } from 'react-router-dom'
import { isAuthed } from '../lib/auth.js'

// Gate the app shell behind the demo login. Not signed in → bounce to /login.
export default function RequireAuth({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />
  return children
}
