# HNG i14 — Frontend Stage 2 · Invoice Management App

A fully functional, accessible, and responsive Invoice Management Application built for the HNG Internship Stage 2 frontend task.

---

## Live URL

> https://ccinvoiceapp.vercel.app/

---

---

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit (state management)
- React Router v6 (client-side routing)
- SCSS Modules (component-scoped styling)
- LocalStorage (data persistence)
- Vite (build tool)

---

## Features

### CRUD

- **Create** — New invoices via a slide-in off-canvas form
- **Read** — Invoice list on dashboard, full detail view per invoice
- **Update** — Edit existing invoices via the same off-canvas form
- **Delete** — Delete with a confirmation modal before removal

### Form Validation

- Required fields are validated on Save & Send
- Invalid fields show red error states with descriptive messages
- Save as Draft skips validation and saves immediately

### Draft & Payment Flow

- Invoices support three statuses: **Draft**, **Pending**, **Paid**
- Draft invoices can be created and edited freely
- Pending invoices can be marked as Paid
- Status is clearly reflected in both list and detail views via color-coded badges

### Filter by Status

- Filter dropdown on the dashboard filters invoices by Draft, Pending, or Paid
- Filtered list updates immediately
- Empty state displays when no invoices match the filter

### Light & Dark Mode

- Toggle between light and dark themes via the sidebar
- Theme preference is persisted to localStorage
- All components adapt to both modes with correct color contrast

### Responsive Design

- Layout adapts across mobile (320px+), tablet (768px+), and desktop (1024px+)
- Off-canvas form slides in over the content on all screen sizes
- Action buttons move to a fixed bottom bar on mobile

### Hover & Interactive States

- All buttons, invoice cards, and interactive elements have visible hover states

---

## Architecture

```
src/
├── assets/          # Styles, SVGs, fonts
├── components/      # Shared UI components (Button, Modal, OffCanvas form)
├── data/            # data.json — seed data loaded on first visit
├── features/        # Invoice feature components
├── hooks/           # useDarkMode, useFilter, useSort
├── layout/          # MainLayout, Navbar
├── pages/           # Dashboard (invoice list), Invoice (detail), Error
├── redux/           # Store, invoiceSlice, modalSlice, offCanvasSlice
├── services/        # localStorage.ts — all CRUD operations
├── types/           # TypeScript type definitions
└── utilities/       # validateData, areAllValid, generateInvoiceId
```

### Data Flow

- All invoice data is stored in and read from **localStorage**
- On first load, `data.json` seeds localStorage with 7 sample invoices
- Redux manages UI state (loading, filters) — not data persistence
- The `localStorage.ts` service handles all create, read, update, delete operations directly

---

## Trade-offs

- **localStorage over IndexedDB** — simpler implementation, sufficient for the scope of this task. IndexedDB would be better for larger datasets
- **Redux for UI state only** — invoice data lives in localStorage rather than the Redux store to keep persistence straightforward and avoid sync issues
- **No authentication** — out of scope for this task; all data is local to the browser

---

## Accessibility Notes

- Semantic HTML throughout — `<form>`, `<button>`, `<label>` used correctly
- All form fields have explicit `<label>` bindings
- Confirmation delete modal traps focus and closes on ESC key
- Go back button is fully keyboard navigable
- Color contrast meets WCAG AA in both light and dark modes
- Status badges use both color and text to convey status (not color alone)
- Mobile action buttons use `position: fixed` bottom bar with sufficient tap target sizes

---

## Setup Instructions

```bash
git clone <your-repo-url>
cd invoice-app
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

To build for production:

```bash
npm run build
```

---

## Submission

HNG Internship i14 — Frontend Stage 2
Deadline: April 23, 2026
