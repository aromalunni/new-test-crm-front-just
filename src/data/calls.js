// Call history — shown inside lead detail panels.
// direction: Outgoing | Incoming | Missed
// outcome: Interested | Callback Requested | No Answer | Not Interested
// leadId links to leads.js. duration is "m:ss" ("0:00" for missed/no-answer).

export const calls = [
  {
    id: 'C-1',
    leadId: 'L-1112',
    repId: 'R-1',
    direction: 'Outgoing',
    duration: '6:42',
    outcome: 'Interested',
    timeLabel: 'Today, 11:20 AM',
    note: 'Walked through 12kW commercial quote, sending revised pricing.',
  },
  {
    id: 'C-2',
    leadId: 'L-1112',
    repId: 'R-1',
    direction: 'Outgoing',
    duration: '3:15',
    outcome: 'Callback Requested',
    timeLabel: 'Yesterday, 4:05 PM',
    note: 'Busy at work, asked to call back after 11 AM.',
  },
  {
    id: 'C-3',
    leadId: 'L-1112',
    repId: 'R-1',
    direction: 'Incoming',
    duration: '2:08',
    outcome: 'Interested',
    timeLabel: '2 days ago, 6:30 PM',
    note: 'Asked about subsidy eligibility for commercial rooftop.',
  },
  {
    id: 'C-4',
    leadId: 'L-1127',
    repId: 'R-6',
    direction: 'Outgoing',
    duration: '4:51',
    outcome: 'Interested',
    timeLabel: 'Today, 10:02 AM',
    note: 'Explained PM Surya Ghar subsidy, keen to proceed.',
  },
  {
    id: 'C-5',
    leadId: 'L-1127',
    repId: 'R-6',
    direction: 'Missed',
    duration: '0:00',
    outcome: 'No Answer',
    timeLabel: 'Yesterday, 1:12 PM',
    note: 'No answer, will retry in the evening.',
  },
  {
    id: 'C-6',
    leadId: 'L-1131',
    repId: 'R-5',
    direction: 'Outgoing',
    duration: '5:27',
    outcome: 'Callback Requested',
    timeLabel: 'Today, 9:40 AM',
    note: 'Wants EMI/loan options before deciding.',
  },
  {
    id: 'C-7',
    leadId: 'L-1131',
    repId: 'R-5',
    direction: 'Outgoing',
    duration: '0:00',
    outcome: 'No Answer',
    timeLabel: 'Yesterday, 5:48 PM',
    note: 'Phone switched off.',
  },
  {
    id: 'C-8',
    leadId: 'L-1158',
    repId: 'R-4',
    direction: 'Outgoing',
    duration: '2:34',
    outcome: 'Interested',
    timeLabel: 'Today, 12:15 PM',
    note: 'Considering 3kW, worried about budget — shared low-cost option.',
  },
  {
    id: 'C-9',
    leadId: 'L-1158',
    repId: 'R-4',
    direction: 'Incoming',
    duration: '1:46',
    outcome: 'Callback Requested',
    timeLabel: '3 days ago, 3:20 PM',
    note: 'Asked us to call after speaking with family.',
  },
  {
    id: 'C-10',
    leadId: 'L-1190',
    repId: 'R-7',
    direction: 'Outgoing',
    duration: '1:58',
    outcome: 'Callback Requested',
    timeLabel: 'Today, 2:48 PM',
    note: 'First contact, requested a callback tomorrow morning.',
  },
  {
    id: 'C-11',
    leadId: 'L-1190',
    repId: 'R-7',
    direction: 'Missed',
    duration: '0:00',
    outcome: 'No Answer',
    timeLabel: 'Yesterday, 11:30 AM',
    note: 'Missed call, no voicemail.',
  },
  {
    id: 'C-12',
    leadId: 'L-1202',
    repId: 'R-6',
    direction: 'Outgoing',
    duration: '7:13',
    outcome: 'Interested',
    timeLabel: 'Today, 8:55 AM',
    note: 'Quoted 7kW over phone, sending full details on WhatsApp.',
  },
  {
    id: 'C-13',
    leadId: 'L-1206',
    repId: 'R-5',
    direction: 'Outgoing',
    duration: '0:00',
    outcome: 'Not Interested',
    timeLabel: 'Today, 1:05 PM',
    note: 'Said they already installed solar last year.',
  },
  {
    id: 'C-14',
    leadId: 'L-1182',
    repId: 'R-3',
    direction: 'Incoming',
    duration: '3:42',
    outcome: 'Interested',
    timeLabel: 'Yesterday, 10:18 AM',
    note: 'Wants a weekend site visit, shadow concerns on roof.',
  },
  {
    id: 'C-15',
    leadId: 'L-1135',
    repId: 'R-8',
    direction: 'Outgoing',
    duration: '4:09',
    outcome: 'Callback Requested',
    timeLabel: '2 days ago, 6:02 PM',
    note: 'Referred by colleague, scheduling weekend callback.',
  },
]

// ---- Helpers ----

export function getCallsByLead(leadId) {
  return calls.filter((call) => call.leadId === leadId)
}

export function getCallsByRep(repId) {
  return calls.filter((call) => call.repId === repId)
}

export default calls
