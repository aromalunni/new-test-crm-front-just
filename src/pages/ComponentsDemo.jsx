import {
  Users,
  Phone,
  IndianRupee,
  TrendingUp,
  Download,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react'
import { useState } from 'react'

import Card from '../components/Card.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import KpiCard from '../components/KpiCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import Avatar from '../components/Avatar.jsx'
import Pill from '../components/Pill.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Tabs from '../components/Tabs.jsx'
import Fab from '../components/Fab.jsx'
import DataTable from '../components/DataTable.jsx'
import DonutChart from '../components/DonutChart.jsx'
import LineTrend from '../components/LineTrend.jsx'
import PipelineFunnel from '../components/PipelineFunnel.jsx'
import ChevronFunnel from '../components/ChevronFunnel.jsx'
import Sparkline from '../components/Sparkline.jsx'
import CountdownRing from '../components/CountdownRing.jsx'

const BADGES = [
  'new',
  'contacted',
  'site-visited',
  'proposal-sent',
  'advance-paid',
  'docs',
  'subsidy',
  'kseb',
  'commissioned',
  'won',
  'stalled',
  'active',
  'elite',
  'performer',
  'starter',
  'breached',
  'awaiting-accept',
  'awaiting-call',
  'accepted',
]

const TABLE_ROWS = [
  { id: 1, name: 'Anil Thomas', district: 'Ernakulam', rep: 'Ravi Kumar', value: 285000, status: 'site-visited', trend: [3, 5, 4, 6, 8, 7, 9] },
  { id: 2, name: 'Priya Nair', district: 'Thrissur', rep: 'Meera S', value: 410000, status: 'proposal-sent', trend: [6, 4, 5, 3, 4, 6, 5] },
  { id: 3, name: 'Jacob Varghese', district: 'Kollam', rep: 'Ravi Kumar', value: 190000, status: 'advance-paid', trend: [2, 3, 5, 7, 6, 8, 10] },
  { id: 4, name: 'Fathima Rasheed', district: 'Kozhikode', rep: 'Arun P', value: 525000, status: 'won', trend: [8, 7, 9, 6, 7, 8, 9] },
  { id: 5, name: 'Suresh Pillai', district: 'Ernakulam', rep: 'Meera S', value: 230000, status: 'stalled', trend: [5, 4, 3, 4, 2, 3, 2] },
  { id: 6, name: 'Deepa Menon', district: 'Alappuzha', rep: 'Arun P', value: 365000, status: 'contacted', trend: [1, 2, 4, 3, 5, 6, 7] },
  { id: 7, name: 'George Kurian', district: 'Kottayam', rep: 'Ravi Kumar', value: 145000, status: 'new', trend: [4, 4, 5, 5, 6, 6, 7] },
  { id: 8, name: 'Lakshmi Iyer', district: 'Palakkad', rep: 'Meera S', value: 480000, status: 'kseb', trend: [7, 8, 6, 9, 8, 9, 10] },
]

const COLUMNS = [
  {
    key: 'name',
    header: 'Customer',
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <Avatar name={row.name} size="sm" />
        <div>
          <div className="font-semibold text-ink">{row.name}</div>
          <div className="text-xs text-inkSoft">{row.district}</div>
        </div>
      </div>
    ),
  },
  { key: 'rep', header: 'Rep', sortable: true },
  {
    key: 'value',
    header: 'Deal Value',
    sortable: true,
    align: 'right',
    render: (row) => <span className="font-semibold tabular-nums">₹{row.value.toLocaleString('en-IN')}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => <StatusBadge variant={row.status} />,
  },
  {
    key: 'trend',
    header: 'Trend',
    render: (row) => <Sparkline data={row.trend} />,
  },
]

const DONUT = [
  { name: 'Won', value: 42, color: '#1FA463' },
  { name: 'In progress', value: 78, color: '#F26B3A' },
  { name: 'Stalled', value: 15, color: '#E0533D' },
  { name: 'New', value: 33, color: '#93A4BC' },
]

const TREND = [
  { label: 'Mon', calls: 24, won: 4 },
  { label: 'Tue', calls: 31, won: 6 },
  { label: 'Wed', calls: 28, won: 5 },
  { label: 'Thu', calls: 40, won: 9 },
  { label: 'Fri', calls: 35, won: 7 },
  { label: 'Sat', calls: 22, won: 3 },
]

const PIPELINE = [
  { label: 'New', value: 120 },
  { label: 'Contacted', value: 96 },
  { label: 'Site Visit', value: 72 },
  { label: 'Proposal', value: 54 },
  { label: 'Advance', value: 38 },
  { label: 'Docs', value: 30 },
  { label: 'Subsidy', value: 24 },
  { label: 'KSEB', value: 18 },
  { label: 'Commissioned', value: 12 },
]

const CHEVRON = [
  { label: 'Assigned', value: 200 },
  { label: 'Contacted', value: 150 },
  { label: 'Visited', value: 95 },
  { label: 'Proposal', value: 60 },
  { label: 'Closed', value: 32 },
]

function Block({ title, children, className }) {
  return (
    <section className={className}>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-inkSoft">{title}</h2>
      {children}
    </section>
  )
}

export default function ComponentsDemo() {
  const [tab, setTab] = useState('all')

  return (
    <div className="min-h-screen bg-canvas p-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
            Phase 1.2 · Component Library
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink">Flarize UI Kit</h1>
          <p className="mt-1 text-sm text-inkSoft">
            One of each reusable component. Every later screen composes from these.
          </p>
        </header>

        {/* KPI cards */}
        <Block title="KpiCard">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total Leads" value="1,248" delta="12.5%" deltaNote="vs last week" icon={Users} />
            <KpiCard label="Calls Today" value="86" delta="4.2%" deltaDirection="down" deltaNote="vs yesterday" icon={Phone} />
            <KpiCard label="Revenue (MTD)" value="₹42.8L" delta="18%" deltaNote="vs target" icon={IndianRupee} />
            <KpiCard label="Conversion" value="6.4%" delta="0.8%" icon={TrendingUp} progress={64} />
          </div>
        </Block>

        {/* Card + SectionHeader */}
        <Block title="Card + SectionHeader">
          <Card>
            <SectionHeader
              title="Recent Activity"
              count={12}
              action={<Pill icon={Filter}>Filter</Pill>}
            />
            <p className="mt-4 text-sm text-inkSoft">
              Card is the base white surface. SectionHeader pairs a bold title with an optional
              count chip and a right-aligned action.
            </p>
          </Card>
        </Block>

        {/* Badges */}
        <Block title="StatusBadge">
          <Card>
            <div className="flex flex-wrap gap-2">
              {BADGES.map((variant) => (
                <StatusBadge key={variant} variant={variant} />
              ))}
            </div>
          </Card>
        </Block>

        {/* Avatars, Pills, Progress, Tabs */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Block title="Avatar + Pill">
            <Card className="space-y-5">
              <div className="flex items-center gap-3">
                <Avatar name="Ravi Kumar" size="sm" />
                <Avatar name="Meera Suresh" size="md" />
                <Avatar name="Arun Prakash" size="lg" />
                <Avatar name="Custom" color="#0E1B2E" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill>Ernakulam</Pill>
                <Pill icon={Phone}>9 calls</Pill>
                <Pill>Elite Team</Pill>
              </div>
            </Card>
          </Block>

          <Block title="ProgressBar + Tabs">
            <Card className="space-y-5">
              <ProgressBar value={72} label="Monthly target" showValue />
              <ProgressBar value={38} label="Subsidy filed" showValue />
              <Tabs
                tabs={[
                  { value: 'all', label: 'All', count: 128 },
                  { value: 'mine', label: 'My Leads', count: 24 },
                  { value: 'unclosed', label: 'Unclosed', count: 9 },
                ]}
                value={tab}
                onChange={setTab}
              />
            </Card>
          </Block>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Block title="DonutChart">
            <Card title="Lead Distribution">
              <DonutChart data={DONUT} centerCaption="total leads" />
            </Card>
          </Block>

          <Block title="LineTrend">
            <Card title="Calls vs Wins">
              <LineTrend
                data={TREND}
                series={[
                  { key: 'calls', color: '#F26B3A', label: 'Calls' },
                  { key: 'won', color: '#1FA463', label: 'Won' },
                ]}
                target={30}
              />
            </Card>
          </Block>
        </div>

        {/* Funnels */}
        <Block title="PipelineFunnel">
          <Card title="Sales Pipeline">
            <PipelineFunnel stages={PIPELINE} />
          </Card>
        </Block>

        <Block title="ChevronFunnel">
          <Card title="Conversion Funnel">
            <ChevronFunnel stages={CHEVRON} />
          </Card>
        </Block>

        {/* DataTable */}
        <Block title="DataTable (sortable · selectable · row menu · pagination)">
          <DataTable
            columns={COLUMNS}
            rows={TABLE_ROWS}
            pageSize={5}
            selectable
            rowActions={[
              { label: 'View', icon: Eye },
              { label: 'Export', icon: Download },
              { label: 'Delete', icon: Trash2, danger: true },
            ]}
          />
        </Block>

        {/* Sparkline + Countdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Block title="Sparkline">
            <Card title="Inline Trend">
              <div className="flex items-center gap-3 text-sm text-inkSoft">
                <span>Last 7 days</span>
                <Sparkline data={[3, 5, 4, 6, 8, 7, 11]} width={120} height={32} />
                <span className="font-semibold text-green">+34%</span>
              </div>
            </Card>
          </Block>

          <Block title="CountdownRing">
            <Card title="Lead Response Timer">
              <div className="flex items-center gap-6">
                <CountdownRing seconds={90} size={72} />
                <CountdownRing seconds={12} size={72} warnAt={20} />
                <p className="text-sm text-inkSoft">
                  Ticks down each second; turns red near zero.
                </p>
              </div>
            </Card>
          </Block>
        </div>

        <p className="pt-2 text-center text-xs text-inkSoft">
          Fab is fixed bottom-right →
        </p>
      </div>

      <Fab />
    </div>
  )
}
