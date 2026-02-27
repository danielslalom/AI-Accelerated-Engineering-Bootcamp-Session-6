# Data Model: Overdue Todo Indicator

**Feature**: 001-overdue-todo-indicator  
**Date**: February 27, 2026  
**Phase**: 1 - Design & Contracts

## Overview

This feature does not introduce new entities or modify the stored data model. The overdue status is a **computed/derived property** calculated at runtime based on existing Todo entity fields. This document describes the logical data model extensions and computation rules.

## Entities

### Todo Item (Existing Entity - No Schema Changes)

The Todo entity remains unchanged in storage. The overdue indicator feature only adds derived computation logic.

**Stored Fields** (unchanged):
```typescript
interface Todo {
  id: string;              // Unique identifier
  title: string;           // Todo text/description
  dueDate?: Date | null;   // Optional due date (ISO 8601 string in storage)
  completed: boolean;      // Completion status
  // ... other existing fields (if any)
}
```

**Derived/Computed Properties** (not stored, calculated at display time):
```typescript
interface TodoWithDerivedState extends Todo {
  isOverdue: boolean;      // Computed: true if incomplete AND dueDate < today
}
```

## Computation Rules

### Overdue Status Logic

**Function Signature**:
```typescript
function isOverdue(todo: Todo): boolean
```

**Algorithm**:
```
IF todo.completed = true THEN
  RETURN false  // Completed todos are never overdue (FR-003)
  
IF todo.dueDate is null OR undefined THEN
  RETURN false  // Todos without due dates cannot be overdue (FR-004)
  
SET today = current date with time normalized to 00:00:00
SET dueDate = todo.dueDate with time normalized to 00:00:00

IF dueDate < today THEN
  RETURN true   // Due date is strictly before today (FR-001, FR-011)
ELSE
  RETURN false  // Due date is today or in the future
END
```

**Edge Cases**:
- **Due date = today**: Returns `false` (today is not overdue per FR-011)
- **Completed + past due date**: Returns `false` (completion status takes precedence per FR-003)
- **Null/undefined due date**: Returns `false` (no due date means cannot be overdue per FR-004)
- **Invalid date**: Treated as null/undefined, returns `false`

## State Transitions

The overdue status transitions automatically based on todo state changes:

```
[Incomplete, Past Due Date] → OVERDUE = true
     ↓ (Mark Complete)
[Complete, Past Due Date] → OVERDUE = false
     ↓ (Mark Incomplete)
[Incomplete, Past Due Date] → OVERDUE = true

[Incomplete, Past Due Date] → OVERDUE = true
     ↓ (Update Due Date to Future)
[Incomplete, Future Due Date] → OVERDUE = false
     ↓ (Update Due Date to Past)
[Incomplete, Past Due Date] → OVERDUE = true

[Incomplete, No Due Date] → OVERDUE = false
     ↓ (Set Past Due Date)
[Incomplete, Past Due Date] → OVERDUE = true
```

**State Transition Requirements** (per FR-005, FR-006):
- Overdue status MUST update within 1 second when `completed` changes (SC-004)
- Overdue status MUST update within 1 second when `dueDate` changes (SC-004)
- Updates occur via React state re-render (no database writes required)

## Validation Rules

No new validation rules are introduced. Existing validation remains:
- `title`: Required, non-empty string
- `dueDate`: Optional, valid ISO 8601 date string when present
- `completed`: Required boolean

## Relationships

No new relationships introduced. This feature operates on individual Todo items in isolation.

## Data Flow

### Frontend (Display Time)
```
1. Fetch todos from API
2. For each todo in list:
   a. Call isOverdue(todo)
   b. If true, apply overdue styling + icon
   c. If false, render normally
3. Display todos with conditional overdue indicators
```

### Backend (Optional API Enhancement)
```
1. Fetch todos from storage
2. For each todo, optionally compute isOverdue
3. Return todos to client (with or without pre-computed overdue flag)
```

**Note**: Backend computation is optional. Frontend can calculate overdue status client-side since computation is inexpensive and data is already available.

## Performance Considerations

**Computation Cost**: O(1) per todo
- Date comparison is simple arithmetic (milliseconds comparison)
- No database queries or external calls

**Scale**: 
- Expected: 10-100 todos per user
- Per-render cost: ~0.01-0.1ms per todo (negligible)
- Total: <10ms for 100 todos (well within performance budget)

**Optimization Strategy**:
- Initial implementation: Compute on each render
- If performance issues arise (unlikely): Add `useMemo` with dependencies `[todo.completed, todo.dueDate]`

## Migration Requirements

**Database Migration**: None required (no schema changes)

**Data Migration**: None required (no stored data changes)

**Code Migration**: Add utility function and update rendering logic (non-breaking changes)

## Testing Data Model

**Test Data Requirements**:
```javascript
// Test fixtures needed
const testTodos = [
  { id: '1', title: 'Overdue incomplete', completed: false, dueDate: '2026-02-20' },
  { id: '2', title: 'Overdue but completed', completed: true, dueDate: '2026-02-20' },
  { id: '3', title: 'Future due date', completed: false, dueDate: '2026-03-10' },
  { id: '4', title: 'Due today', completed: false, dueDate: '2026-02-27' },
  { id: '5', title: 'No due date', completed: false, dueDate: null },
];

// Expected overdue status (assuming today is 2026-02-27)
// id '1': true (incomplete + past)
// id '2': false (completed)
// id '3': false (future)
// id '4': false (today not overdue)
// id '5': false (no due date)
```

## Summary

This feature is a **pure view-layer enhancement** with no data model changes. The overdue status is computed from existing Todo fields using deterministic logic, ensuring consistency and simplifying implementation (KISS principle). No database migrations, schema changes, or data persistence are required.
