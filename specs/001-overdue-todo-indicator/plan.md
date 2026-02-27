# Implementation Plan: Overdue Todo Indicator

**Branch**: `001-overdue-todo-indicator` | **Date**: February 27, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-overdue-todo-indicator/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a visual indicator system for overdue todo items. The feature will automatically identify incomplete todos with due dates before the current date and display them with error/danger color text and a warning icon (⚠️). The overdue status is computed at display time (not stored) and updates in real-time when todos are completed or due dates change. Accessibility is ensured through ARIA labels and alert roles.

## Technical Context

**Language/Version**: JavaScript (Node.js 18+, React 18)  
**Primary Dependencies**: React (functional components + hooks), Express.js, Jest, @testing-library/react  
**Storage**: Backend REST API (in-memory or file-based, single-user application)  
**Testing**: Jest with @testing-library/react for frontend, Jest for backend unit tests  
**Target Platform**: Web browser (modern browsers) + Node.js server  
**Project Type**: Web application (monorepo: packages/frontend + packages/backend)  
**Performance Goals**: UI updates within 1 second for overdue status changes (per SC-004)  
**Constraints**: WCAG AA accessibility compliance, no degradation in existing todo operations performance (per SC-005)  
**Scale/Scope**: Single-user todo application, simple list view, estimated 10-100 todos per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Code Quality & SOLID Design
**Status**: ✅ PASS  
**Evaluation**: Feature can be implemented with single responsibility - computed overdue status in business logic, visual styling in presentation layer. No new dependencies required. Follows existing component patterns.

### Principle II: Test-First Development (NON-NEGOTIABLE)
**Status**: ✅ PASS  
**Evaluation**: TDD is mandatory and will be followed. Tests will be written first for overdue calculation logic, visual rendering, real-time updates, and accessibility attributes. Target: 80%+ coverage maintained.

### Principle III: Single Responsibility & Simplicity (KISS/YAGNI)
**Status**: ✅ PASS  
**Evaluation**: Feature is focused and well-scoped. Adds only: (1) computed overdue status, (2) conditional styling, (3) warning icon. No scope creep - explicitly excludes sorting/reordering, custom date ranges, or advanced date logic. Aligns with YAGNI.

### Principle IV: User Experience & Accessibility
**Status**: ✅ PASS  
**Evaluation**: Spec explicitly requires WCAG AA compliance with `aria-label="Overdue"` and `role="alert"` for screen readers. Uses existing design system error/danger color. Visual indicator (⚠️) + text color provides multiple signals for accessibility.

### Principle V: Consistency & Maintainability (DRY)
**Status**: ✅ PASS  
**Evaluation**: Overdue logic will be centralized in a single utility function (e.g., `isOverdue(todo)`). UI styling will use existing CSS classes from design system. No duplication expected - reuses existing todo rendering components with conditional styling.

**Overall Gate Result**: ✅ ALL CHECKS PASSED - Proceed to Phase 0

---

## Constitution Check - Post-Design Re-Evaluation

*Re-evaluated after Phase 1 design completion (research.md, data-model.md, contracts/, quickstart.md)*

### Principle I: Code Quality & SOLID Design
**Status**: ✅ PASS (Confirmed)  
**Evaluation**: Design maintains single responsibility:
- `isOverdue()` utility function handles business logic (single purpose)
- TodoCard component handles presentation (separation of concerns)
- No new dependencies introduced (uses built-in Date API)
- Follows existing patterns (React functional components, pure functions)

### Principle II: Test-First Development
**Status**: ✅ PASS (Confirmed)  
**Evaluation**: Quickstart guide explicitly follows TDD:
- Step 1: Write tests first (Red-Green-Refactor)
- Step 2: Component tests before implementation
- Step 3: Accessibility tests
- Step 4: Integration tests
- Test coverage maintained at 80%+

### Principle III: Single Responsibility & Simplicity (KISS/YAGNI)
**Status**: ✅ PASS (Confirmed)  
**Evaluation**: Design remains simple:
- Computed property (not stored) - simplest approach
- No external dependencies (native Date API)
- No background jobs or schedulers (YAGNI)
- Clear, focused implementation (one feature, well-scoped)

### Principle IV: User Experience & Accessibility
**Status**: ✅ PASS (Confirmed)  
**Evaluation**: Accessibility thoroughly addressed:
- Dedicated accessibility contract (contracts/accessibility.md)
- WCAG AA compliance verified
- Multiple indicators (color + icon) per WCAG 1.4.1
- Proper ARIA attributes (role="alert", aria-label)
- Screen reader testing included in quickstart

### Principle V: Consistency & Maintainability (DRY)
**Status**: ✅ PASS (Confirmed)  
**Evaluation**: DRY principles maintained:
- Single `isOverdue()` function (reusable in frontend/backend)
- CSS uses existing design system variables
- No duplication in implementation
- Clear contracts prevent inconsistent implementations

**Overall Post-Design Gate Result**: ✅ ALL CHECKS PASSED - Ready for Phase 2 (Tasks)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── backend/
│   ├── src/
│   │   ├── app.js                    # Express app setup
│   │   ├── index.js                  # Server entry point
│   │   └── services/
│   │       └── todoService.js        # [MODIFY] Add overdue logic
│   └── __tests__/
│       └── app.test.js               # [MODIFY] Add overdue tests
│
└── frontend/
    ├── src/
    │   ├── App.js                    # Main app component
    │   ├── components/
    │   │   ├── TodoCard.js           # [MODIFY] Add overdue indicator UI
    │   │   ├── TodoList.js           # [MODIFY] Pass overdue state
    │   │   └── __tests__/
    │   │       └── TodoCard.test.js  # [MODIFY] Test overdue display
    │   ├── services/
    │   │   └── todoService.js        # [MODIFY] Add overdue utility
    │   └── styles/
    │       └── theme.css             # [REFERENCE] Use existing error/danger color
    └── __tests__/
        └── App.test.js               # [MODIFY] Integration tests
```

**Structure Decision**: This is a monorepo web application following Option 2 (frontend + backend). Frontend uses React functional components with hooks. Backend is Express.js REST API. The feature will modify existing TodoCard component to conditionally render overdue styling, and add utility functions in both frontend and backend to compute overdue status.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations detected. All principles pass without requiring justification or complexity tracking.
