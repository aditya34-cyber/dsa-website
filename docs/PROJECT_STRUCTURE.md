# Project Structure Documentation

This document provides a comprehensive overview of all files in the AlgoLearn project and their purposes.

---

## Root Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (Supabase URL, API keys) |
| `index.html` | Main HTML entry point for the React app |
| `vite.config.ts` | Vite bundler configuration |
| `tailwind.config.ts` | Tailwind CSS theme and design system configuration |
| `eslint.config.js` | ESLint code linting rules |
| `README.md` | Project overview and setup instructions |

---

## Source Code (`src/`)

### Entry Files

| File | Purpose |
|------|---------|
| `src/main.tsx` | React app entry point, renders `<App />` to DOM |
| `src/App.tsx` | Root component with routing configuration (React Router) |
| `src/App.css` | Global application styles |
| `src/index.css` | Tailwind CSS imports and design system tokens (colors, fonts) |
| `src/vite-env.d.ts` | TypeScript declarations for Vite environment |

---

### Pages (`src/pages/`)

| File | Purpose |
|------|---------|
| `Index.tsx` | **Home page** - Landing page with topic cards for navigation, handles auth state display |
| `Auth.tsx` | **Authentication page** - Login and signup forms using Supabase Auth |
| `SortingVisualization.tsx` | **Sorting algorithms page** - Visualizes Bubble Sort, Quick Sort with step-by-step animation |
| `SearchingVisualization.tsx` | **Searching algorithms page** - Visualizes Binary Search with animation |
| `StackVisualization.tsx` | **Stack data structure page** - Interactive stack operations (push/pop) with visualization |
| `QueueVisualization.tsx` | **Queue data structure page** - Interactive queue operations (enqueue/dequeue) with visualization |
| `CodingPractice.tsx` | **Code editor page** - Monaco code editor with multi-language support and code execution |
| `NotFound.tsx` | **404 page** - Displayed for unknown routes |

---

### Components (`src/components/`)

#### Main Components

| File | Purpose |
|------|---------|
| `AlgorithmVisualizer.tsx` | **Core visualization engine** - Renders animated bar charts for sorting, searching, stacks, and queues. Handles playback controls (play, pause, step, reset) |
| `CodeEditor.tsx` | **Code editor component** - Monaco editor wrapper with language selection, code execution via Supabase Edge Function, displays output and execution time |
| `BubbleSortPreview.tsx` | **Demo animation** - Auto-playing bubble sort animation shown on the home page for unauthenticated users |
| `TopicCard.tsx` | **Navigation card** - Clickable card component for each learning topic on the home page |
| `WelcomeSection.tsx` | **Welcome banner** - Displays personalized greeting and app introduction |
| `StatsOverview.tsx` | **Statistics display** - Shows user learning statistics (if implemented) |
| `QuestionCard.tsx` | **Quiz card** - Displays quiz questions (if implemented) |
| `QuestionsSection.tsx` | **Quiz section** - Container for quiz questions (if implemented) |

#### UI Components (`src/components/ui/`)

These are **shadcn/ui** components - a collection of reusable, accessible UI primitives:

| File | Purpose |
|------|---------|
| `accordion.tsx` | Expandable/collapsible content sections |
| `alert.tsx` | Alert messages (info, warning, error) |
| `alert-dialog.tsx` | Modal confirmation dialogs |
| `avatar.tsx` | User profile images |
| `badge.tsx` | Status labels and tags |
| `button.tsx` | Clickable buttons with variants |
| `card.tsx` | Container cards with header, content, footer |
| `checkbox.tsx` | Checkbox input |
| `dialog.tsx` | Modal dialogs |
| `dropdown-menu.tsx` | Dropdown menus |
| `form.tsx` | Form components with validation |
| `input.tsx` | Text input fields |
| `label.tsx` | Form labels |
| `popover.tsx` | Floating popover content |
| `progress.tsx` | Progress bars |
| `scroll-area.tsx` | Custom scrollable areas |
| `select.tsx` | Dropdown select inputs |
| `separator.tsx` | Visual dividers |
| `skeleton.tsx` | Loading placeholder animations |
| `slider.tsx` | Range slider inputs |
| `switch.tsx` | Toggle switches |
| `table.tsx` | Data tables |
| `tabs.tsx` | Tabbed navigation |
| `textarea.tsx` | Multi-line text inputs |
| `toast.tsx` | Toast notification popups |
| `toaster.tsx` | Toast notification container |
| `tooltip.tsx` | Hover tooltips |
| `use-toast.ts` | Toast hook for triggering notifications |

---

### Algorithms (`src/algorithms/`)

These files contain the algorithm implementations that generate visualization steps:

| File | Purpose |
|------|---------|
| `bubbleSort.ts` | Bubble sort algorithm - generates steps showing comparisons and swaps |
| `quickSort.ts` | Quick sort algorithm - generates steps for partition-based sorting |
| `binarySearch.ts` | Binary search algorithm - generates steps showing search range narrowing |
| `stackOperations.ts` | Stack operations - generates steps for push/pop operations |
| `queueOperations.ts` | Queue operations - generates steps for enqueue/dequeue operations |

---

### Hooks (`src/hooks/`)

| File | Purpose |
|------|---------|
| `use-mobile.tsx` | Detects mobile viewport for responsive behavior |
| `use-toast.ts` | Hook for displaying toast notifications |

---

### Integrations (`src/integrations/`)

| File | Purpose |
|------|---------|
| `supabase/client.ts` | Supabase client initialization with environment variables |
| `supabase/types.ts` | Auto-generated TypeScript types for database schema |

---

### Utilities (`src/lib/`)

| File | Purpose |
|------|---------|
| `utils.ts` | Utility functions including `cn()` for Tailwind class merging |

---

## Supabase Backend (`supabase/`)

| File | Purpose |
|------|---------|
| `config.toml` | Supabase project configuration |
| `functions/compile-code/index.ts` | **Edge Function** - Proxies code to Piston API for compilation and execution |
| `migrations/` | Database migration files (schema changes) |

---

## Public Assets (`public/`)

| File | Purpose |
|------|---------|
| `robots.txt` | Search engine crawler instructions |
| `favicon.ico` | Browser tab icon |
| `placeholder.svg` | Placeholder image |

---

## Documentation (`docs/`)

| File | Purpose |
|------|---------|
| `BACKEND_ARCHITECTURE.md` | Explains authentication, code compilation, and file storage systems |
| `PROJECT_STRUCTURE.md` | This file - describes all project files |

---

## Data Flow Overview

```
User Interaction
       │
       ▼
┌─────────────────┐
│   Pages (UI)    │  ← React Router handles navigation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Components    │  ← Reusable UI pieces
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────────┐
│Algorithms│ │Supabase   │
│ (local) │ │ (backend) │
└───────┘ └─────┬─────┘
                │
         ┌──────┴──────┐
         ▼             ▼
    ┌─────────┐  ┌──────────┐
    │Database │  │Edge Func │
    │(profiles)│  │(compile) │
    └─────────┘  └──────────┘
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Animation | Framer Motion |
| Routing | React Router v6 |
| State | React Query, React useState |
| Code Editor | Monaco Editor |
| Backend | Supabase (Auth, Database, Edge Functions) |
| Code Execution | Piston API (via Edge Function) |
