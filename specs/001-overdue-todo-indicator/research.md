# Research: Overdue Todo Indicator

**Feature**: 001-overdue-todo-indicator  
**Date**: February 27, 2026  
**Phase**: 0 - Research & Discovery

## Overview

This document consolidates technical research and design decisions for implementing the overdue todo indicator feature. All NEEDS CLARIFICATION items from Technical Context have been resolved, and implementation patterns have been identified.

## Key Decisions

### 1. Overdue Status Computation Strategy

**Decision**: Compute overdue status dynamically at display time (derived state), not stored in database

**Rationale**:
- Overdue status is time-dependent and changes daily without user action
- Storing overdue status would require background jobs or scheduled updates
- Derived computation is simpler (KISS principle) and always accurate
- JavaScript Date comparison is efficient for the expected scale (10-100 todos)

**Alternatives Considered**:
- **Stored Status with Background Job**: Rejected - adds complexity, requires cron/scheduler, violates YAGNI
- **Client-Side Only Computation**: Rejected - backend should also know overdue status for potential API responses
- **Time-Based WebSocket Updates**: Rejected - over-engineered, unnecessary for this use case

**Implementation Pattern**:
```javascript
// Utility function (frontend/backend)
function isOverdue(todo) {
  if (todo.completed || !todo.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(todo.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today; // Strictly before today
}
```

### 2. Date Comparison Without Time Components

**Decision**: Compare dates using midnight (00:00:00) normalization, treating entire days as atomic units

**Rationale**:
- Spec requires "date comparison only (not time of day)" (FR-010)
- Users think in terms of days, not hours/minutes
- Simplifies edge cases (todo due at 11:59 PM vs 12:01 AM)
- JavaScript `setHours(0,0,0,0)` provides clean date-only comparison

**Alternatives Considered**:
- **ISO Date String Comparison**: Rejected - requires careful timezone handling, error-prone
- **Date.toDateString()**: Considered - but direct millisecond comparison after normalization is more efficient
- **Library (date-fns, dayjs)**: Rejected - adds external dependency for simple operation (YAGNI)

### 3. Visual Indicator Design

**Decision**: Use error/danger color text + warning icon (⚠️) positioned after todo title

**Rationale**:
- Clarifications specified: "Red text color + warning/alert icon (⚠️)" positioned "After the todo title"
- Provides dual visual signal (color + icon) for accessibility
- Leverages existing design system color (consistency)
- Icon position doesn't disrupt reading flow (comes after title)

**Alternatives Considered**:
- **Background Color Change**: Rejected - too visually heavy, reduces text readability
- **Icon Before Title**: Rejected - clarification explicitly stated "after"
- **Animated Indicator**: Rejected - violates KISS, could be distracting

**CSS Implementation**:
```css
.todo-overdue {
  color: var(--color-error); /* Use existing design system variable */
}
.todo-overdue-icon {
  margin-left: 8px; /* Follow 8px grid system */
  font-size: 1rem;
}
```

### 4. Accessibility Implementation

**Decision**: Use `aria-label="Overdue"` and `role="alert"` on the warning icon element

**Rationale**:
- Spec requirement (FR-012): "aria-label='Overdue' and role='alert' attributes"
- `role="alert"` causes screen readers to announce immediately (appropriate for time-sensitive information)
- `aria-label` provides context for the warning icon symbol
- Meets WCAG AA compliance requirement

**Alternatives Considered**:
- **aria-live="polite"**: Rejected - `role="alert"` is more semantically appropriate for warnings
- **Hidden Text with sr-only class**: Considered - but aria-label is cleaner and sufficient
- **title attribute**: Rejected - not accessible to keyboard/screen reader users

**React Implementation**:
```jsx
{isOverdue(todo) && (
  <span className="todo-overdue-icon" role="alert" aria-label="Overdue">
    ⚠️
  </span>
)}
```

### 5. Real-Time Update Strategy

**Decision**: React state updates trigger automatic re-render with updated overdue status

**Rationale**:
- React's declarative rendering automatically reflects state changes
- When todo completion status or due date changes, state update triggers re-render
- `isOverdue()` utility is called during each render (acceptable performance for 10-100 todos)
- No additional watcher/observer logic needed

**Alternatives Considered**:
- **Memoization with useMemo**: Future optimization if performance issues arise (premature optimization)
- **Separate Overdue State Variable**: Rejected - violates single source of truth, requires manual sync
- **Event-Based Updates**: Rejected - unnecessary complexity

**Performance Note**: 
Success criteria SC-004 requires "updates within 1 second". React state updates are typically <100ms, well within requirement.

### 6. Component Responsibility Separation

**Decision**: 
- `TodoCard` component handles conditional rendering (presentation)
- `isOverdue()` utility function handles logic (business logic)
- Parent component passes todo data (data flow)

**Rationale**:
- Aligns with Single Responsibility Principle (Constitution I)
- Utility function is testable independently
- Component focuses on rendering, not business logic
- DRY - utility can be reused in backend if needed

**Alternatives Considered**:
- **Inline Logic in Component**: Rejected - violates SRP, harder to test
- **Custom Hook (useOverdue)**: Rejected - over-engineered for simple calculation (YAGNI)
- **HOC or Render Props**: Rejected - unnecessary abstraction

### 7. Testing Strategy

**Decision**: Follow TDD with unit tests first, then integration tests

**Test Coverage Required**:
- **Unit Tests**: 
  - `isOverdue()` utility with all edge cases (completed, no due date, past, future, today)
  - TodoCard rendering with/without overdue indicator
  - Accessibility attributes presence
- **Integration Tests**:
  - Complete todo → indicator disappears
  - Change due date → indicator updates
  - End-to-end user flows from spec scenarios

**Rationale**:
- Constitution II mandates TDD (NON-NEGOTIABLE)
- Target: 80%+ coverage maintained
- Tests document expected behavior

### 8. Browser Compatibility

**Decision**: Use standard JavaScript Date API (supported in all modern browsers)

**Rationale**:
- Target platform is "modern browsers" (from Technical Context)
- Date API is ES5 standard (IE9+, all modern browsers)
- No polyfills or transpilation needed
- No external dependencies required

**Alternatives Considered**:
- **Intl.DateTimeFormat**: Considered for display, but comparison doesn't need formatting
- **Temporal API**: Rejected - still Stage 3 proposal, not widely supported

## Implementation Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Timezone edge cases (user travels across timezones) | Medium | Document that app uses client system date; existing behavior for due dates |
| System clock changes (daylight saving, manual adjustment) | Low | Acceptable - overdue status updates on reload/interaction |
| Performance with 100+ todos | Low | Current scale is 10-100 todos; can add memoization if needed |
| Color-only indication fails for colorblind users | Medium | Mitigated by dual indicators (color + icon) |

## Dependencies

**No New Dependencies Required**
- React (existing)
- Jest + @testing-library/react (existing)
- Native JavaScript Date API (built-in)

## Open Questions

None - All technical decisions resolved. Ready to proceed to Phase 1 (Data Model & Contracts).
