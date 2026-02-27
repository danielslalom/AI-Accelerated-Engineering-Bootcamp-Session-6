# Utility Function Contract: isOverdue

**Feature**: 001-overdue-todo-indicator  
**Contract Type**: Shared Utility Function  
**Applies To**: Frontend and Backend

## Function Signature

```typescript
function isOverdue(todo: Todo): boolean
```

## Purpose

Determines whether a todo item should be marked as overdue based on its completion status and due date relative to the current date.

## Parameters

### Input: `todo` (object)

**Type**: `Todo`

**Required Properties**:
- `completed` (boolean): Whether the todo has been marked as complete
- `dueDate` (Date | string | null | undefined): The due date of the todo
  - Can be a Date object, ISO 8601 date string, null, or undefined

**Optional Properties**:
- All other Todo properties are ignored by this function

## Return Value

**Type**: `boolean`

**Values**:
- `true`: Todo is overdue (incomplete AND due date is strictly before today)
- `false`: Todo is NOT overdue (completed OR no due date OR due date is today/future)

## Behavior Contract

### MUST Return `false` When:
1. `todo.completed === true` (regardless of due date)
2. `todo.dueDate` is `null` or `undefined`
3. `todo.dueDate` is invalid (cannot be parsed to valid date)
4. `todo.dueDate` is equal to today's date (date-only comparison)
5. `todo.dueDate` is in the future

### MUST Return `true` When:
1. `todo.completed === false` AND
2. `todo.dueDate` is a valid date AND
3. `todo.dueDate` is strictly before today's date (date-only comparison)

### Date Comparison Rules:
- **Time components MUST be ignored**: Compare dates only, not times
  - Implementation: Normalize both dates to midnight (00:00:00.000)
- **Today's date is NOT overdue**: Only dates strictly before today return true
- **Timezone**: Use client system's local timezone (consistent with existing app behavior)

## Examples

```javascript
// Assume today is February 27, 2026

// Case 1: Overdue incomplete todo
isOverdue({ completed: false, dueDate: '2026-02-20' })
// Returns: true

// Case 2: Completed todo with past due date
isOverdue({ completed: true, dueDate: '2026-02-20' })
// Returns: false

// Case 3: Future due date
isOverdue({ completed: false, dueDate: '2026-03-10' })
// Returns: false

// Case 4: Due today
isOverdue({ completed: false, dueDate: '2026-02-27' })
// Returns: false

// Case 5: No due date
isOverdue({ completed: false, dueDate: null })
// Returns: false

// Case 6: Invalid due date
isOverdue({ completed: false, dueDate: 'invalid-date' })
// Returns: false

// Case 7: Undefined due date
isOverdue({ completed: false, dueDate: undefined })
// Returns: false
```

## Edge Cases & Error Handling

| Input | Expected Behavior |
|-------|-------------------|
| `todo` is `null` or `undefined` | Should throw TypeError or return `false` (implementation choice) |
| `todo.completed` is missing | Treat as `false` (incomplete) |
| `todo.dueDate` is empty string `""` | Return `false` (invalid date) |
| `todo.dueDate` is `0` (epoch) | Return `true` if epoch < today, `false` otherwise |
| System date changes while app runs | New calls use new current date (no caching required) |

## Performance Contract

- **Time Complexity**: O(1) - constant time operation
- **Space Complexity**: O(1) - no additional memory allocation
- **Side Effects**: None - pure function (no mutations, no external state changes)

## Testing Requirements

**Minimum Test Cases** (per TDD requirement):
1. ✅ Incomplete todo with past due date → `true`
2. ✅ Completed todo with past due date → `false`
3. ✅ Incomplete todo with future due date → `false`
4. ✅ Incomplete todo with today's due date → `false`
5. ✅ Incomplete todo with null due date → `false`
6. ✅ Incomplete todo with undefined due date → `false`
7. ✅ Incomplete todo with invalid due date string → `false`

## Implementation Notes

- Function MUST be **pure** (no side effects, deterministic)
- Function MUST be **stateless** (no closures or cached state)
- Function SHOULD be lightweight (suitable for repeated calls during rendering)
- Function MAY use built-in Date API (no external dependencies required)

## Version

**Version**: 1.0.0  
**Status**: Stable  
**Breaking Changes**: None (new function)
