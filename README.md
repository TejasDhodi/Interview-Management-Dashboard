# Interview Management Dashboard

A Next.js 15 + React 19 dashboard to manage candidates, interviews, and feedback. The app is 100% frontend and persists data in localStorage (no backend).

## Tech Stack
- Next.js App Router, React 19
- TypeScript
- Tailwind CSS + shadcn/ui-like primitives
- localStorage for persistence
- Real-time dashboard metrics from actual data

## Quick Start
1) Install dependencies
```bash
npm i
```

2) Run the dev server
```bash
npm run dev
```

3) Open `http://localhost:3000`

## Auth & Roles
Use the built-in login to impersonate roles (persists across browser sessions):
- **admin**: Full access to all features
- **ta_member**: Manage candidates and interviews
- **panelist**: Submit feedback and view candidates

Role capabilities (UI-enforced):
- All roles: create/edit/delete candidates
- panelist: can submit feedback
- Roles persist in localStorage (no random assignment on refresh)

## Data Model (localStorage)
The app stores three collections in localStorage:
- `candidates`: array of candidates with unique IDs
- `interviews`: array of interviews linked to candidates
- `feedback`: array of feedback posts linked to candidates
- `user`: current user session and role

All CRUD goes through store helpers in `src/lib/*-store.ts` which hydrate from localStorage on each write to avoid overwrites.

### Candidates
- Status: `scheduled | completed | cancelled`
- Create defaults to `scheduled`
- Status auto-updates based on interview completion
- Store API: `listCandidates`, `getCandidate`, `createCandidate`, `updateCandidate`, `deleteCandidate`
- Duplicate prevention: unique ID generation with collision detection

### Interviews
- Linked by `candidateId`
- Store API: `listInterviewsByCandidate`, `createInterview`, `updateInterview`
- Schedule tab auto-creates a default "Scheduled Interview" if candidate is `scheduled` and none exist
- Toggle completion updates candidate status automatically

### Feedback
- Linked by `candidateId`
- Store API: `listFeedbackByCandidate`, `createFeedback`
- Only `panelist` role can submit via the UI
- Score calculation based on actual feedback entries

## Key Screens
- `/login`: choose a role (persists across sessions)
- `/dashboard`: Real-time KPIs calculated from actual data
  - Shows "No Data Available" when no candidates exist
  - Metrics: scheduled interviews, completed interviews, cancelled candidates, total candidates, feedback scores
- `/candidates`: list with filters, create button, table actions
- `/candidates/[id]`: detail with tabs
  - Profile: summary and info
  - Schedule: list + toggle completed (syncs with candidate status)
  - Feedback: list and submit (for panelists)

## Dashboard Metrics
The dashboard shows real-time metrics from your data:
- **Interviews This Week**: Count of candidates with "scheduled" status
- **Average Feedback Score**: Calculated from actual feedback entries
- **No-Shows**: Count of candidates with "cancelled" status
- **Total Candidates**: Total count from localStorage
- **Completed Interviews**: Count of completed interviews across all candidates
- **Pending Feedback**: Count of scheduled candidates (assumed to need feedback)

## Common Tasks
### Create Candidate
- Go to `/candidates`
- Click "Add Candidate"
- Fill the form and submit
- The list refreshes immediately

### Edit/Delete Candidate
- Use the actions in the table row
- Changes reflect immediately across the app

### Submit Feedback (panelist only)
- Go to `/candidates/[id]?tab=feedback`
- Click "Submit Feedback", fill, submit
- Redirects back to candidate profile

### Toggle Interview Status
- Go to `/candidates/[id]?tab=schedule`
- Use the toggle to mark complete/scheduled
- Candidate status updates automatically based on interview completion

## Data Synchronization
- **Immediate Updates**: All changes reflect immediately across the app
- **Status Sync**: Interview completion automatically updates candidate status
- **Role Persistence**: Selected roles persist across browser sessions
- **Unique IDs**: Duplicate prevention ensures data integrity

## Troubleshooting
- **Duplicate Key Error**: Clear corrupted data:
```js
localStorage.removeItem('candidates');
localStorage.removeItem('interviews');
localStorage.removeItem('feedback');
localStorage.removeItem('user');
```
- **Role Issues**: Clear user session and re-login:
```js
localStorage.removeItem('user');
```
- **Stale Data**: Refresh the page after major changes

## Architecture Notes
- **Pure Frontend**: No backend/API routes (removed `src/app/api`)
- **localStorage Persistence**: All data persists across browser sessions
- **Real-time Updates**: Dashboard metrics update based on actual data
- **Role-based UI**: Different capabilities based on user role
- **Optimistic Updates**: UI updates immediately, reverts on failure
