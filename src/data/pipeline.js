// Pipeline stage counts for funnel / dashboard charts.
// `admin` is the org-wide funnel; `leadErnakulam` is the Ernakulam team-lead view.
// Stage order matches STAGES in leads.js.

// `stage` holds a canonical key (see src/config/stages.js); render the display
// label via stageLabel(row.stage).
export const adminPipeline = [
  { stage: 'new', count: 597 },
  { stage: 'contacted', count: 312 },
  { stage: 'qualified', count: 240 },
  { stage: 'survey-scheduled', count: 188 },
  { stage: 'survey-completed', count: 156 },
  { stage: 'proposal-sent', count: 94 },
  { stage: 'negotiation', count: 70 },
  { stage: 'booking-confirmed', count: 42 },
  { stage: 'agreement-generated', count: 38 },
  { stage: 'loan-processing', count: 31 },
  { stage: 'project-execution', count: 22 },
  { stage: 'documentation-subsidy', count: 15 },
  { stage: 'handover-complete', count: 11 },
  { stage: 'after-sales-active', count: 7 },
]

export const leadErnakulamPipeline = [
  { stage: 'new', count: 54 },
  { stage: 'contacted', count: 42 },
  { stage: 'qualified', count: 35 },
  { stage: 'survey-scheduled', count: 28 },
  { stage: 'survey-completed', count: 23 },
  { stage: 'proposal-sent', count: 18 },
  { stage: 'negotiation', count: 14 },
  { stage: 'booking-confirmed', count: 12 },
  { stage: 'agreement-generated', count: 10 },
  { stage: 'loan-processing', count: 9 },
  { stage: 'project-execution', count: 7 },
  { stage: 'documentation-subsidy', count: 7 },
  { stage: 'handover-complete', count: 5 },
  { stage: 'after-sales-active', count: 3 },
]

// ---- Helpers ----

// Total leads across all stages in a pipeline.
export function getPipelineTotal(pipeline) {
  return pipeline.reduce((sum, row) => sum + row.count, 0)
}

// Conversion % from the first stage to a given stage.
export function getStageConversion(pipeline, stage) {
  const top = pipeline[0]?.count || 0
  const target = pipeline.find((row) => row.stage === stage)?.count || 0
  if (!top) return 0
  return Math.round((target / top) * 100)
}

export default adminPipeline
