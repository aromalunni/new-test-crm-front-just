import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import AppShell from './components/AppShell.jsx'
import Login from './pages/Login.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import Placeholder from './pages/Placeholder.jsx'
import ComponentsDemo from './pages/ComponentsDemo.jsx'
import Today from './pages/rep/Today.jsx'
import Leads from './pages/rep/Leads.jsx'
import LeadDetail from './pages/rep/LeadDetail.jsx'
import Incoming from './pages/rep/Incoming.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminAllLeads from './pages/admin/AllLeads.jsx'
import AdminQueue from './pages/admin/Queue.jsx'
import CallLogs from './pages/CallLogs.jsx'
import AdminPerformance from './pages/admin/Performance.jsx'
import AdminTv from './pages/admin/Tv.jsx'
import AdminWorkforce from './pages/admin/Workforce.jsx'
import AdminSettings from './pages/admin/Settings.jsx'
import LeadDashboard from './pages/lead/Dashboard.jsx'
import LeadAllLeads from './pages/lead/AllLeads.jsx'
import LeadMyLeads from './pages/lead/MyLeads.jsx'
import LeadUnclosed from './pages/lead/Unclosed.jsx'
import LeadDrilldown from './pages/lead/Drilldown.jsx'

// All three roles share one shell. Role is decided by the URL prefix; AppShell
// renders the matching sidebar/user chip. Each nav item maps to a placeholder
// page for now.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default landing → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Phase 1.2 component library demo (standalone, no shell) */}
        <Route path="/components" element={<ComponentsDemo />} />

        {/* Admin */}
        <Route path="/admin" element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="all-leads" element={<AdminAllLeads />} />
          <Route path="all-leads/:id" element={<LeadDetail />} />
          <Route path="queue" element={<AdminQueue />} />
          <Route path="call-logs" element={<CallLogs />} />
          <Route path="performance" element={<AdminPerformance />} />
          <Route path="tv" element={<AdminTv />} />
          <Route path="workforce" element={<AdminWorkforce />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Team Lead */}
        <Route path="/lead" element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<Navigate to="/lead/dashboard" replace />} />
          <Route path="dashboard" element={<LeadDashboard />} />
          <Route path="all-leads" element={<LeadAllLeads />} />
          <Route path="all-leads/:id" element={<LeadDetail />} />
          <Route path="my-leads" element={<LeadMyLeads />} />
          <Route path="unclosed" element={<LeadUnclosed />} />
          <Route path="call-logs" element={<CallLogs />} />
          <Route path="performance" element={<LeadDrilldown />} />
        </Route>

        {/* CRS Rep */}
        <Route path="/rep" element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<Navigate to="/rep/today" replace />} />
          <Route path="today" element={<Today />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/:id" element={<LeadDetail />} />
          <Route path="incoming" element={<Incoming />} />
          {/* Performance has no dedicated rep screen yet — placeholder for now. */}
          <Route path="performance" element={<Placeholder />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
