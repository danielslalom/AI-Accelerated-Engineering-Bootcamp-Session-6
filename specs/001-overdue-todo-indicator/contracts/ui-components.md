# UI Component Contract: TodoCard with Overdue Indicator

**Feature**: 001-overdue-todo-indicator  
**Contract Type**: React Component Interface  
**Component**: `TodoCard`

## Component Responsibility

Display a single todo item with conditional overdue indicator styling and icon when applicable.

## Visual Contract

### Standard Todo (Not Overdue)
```
[ ] Buy groceries               Due: Mar 5, 2026
```

### Overdue Todo (Incomplete + Past Due Date)
```
[ ] Call dentist ⚠️    Due: Feb 20, 2026
    ^^^^^^^^^^^^                          (text in error/danger color)
                 ^^                        (warning icon)
```

### Completed Todo (Never Shows Overdue)
```
[✓] Submit report               Due: Feb 15, 2026
```

## Rendering Rules

### MUST Display Overdue Indicator When:
- `isOverdue(todo) === true`

### Overdue Indicator MUST Include:
1. **Text Color**: Todo title text in error/danger color (from design system)
   - CSS Variable: `var(--color-error)` or equivalent
2. **Warning Icon**: ⚠️ (U+26A0) positioned immediately after todo title
   - Spacing: 8px margin-left (follows 8px grid system)
3. **Accessibility Attributes** (on icon element):
   - `role="alert"` - Announces to screen readers immediately
   - `aria-label="Overdue"` - Provides text alternative for icon

### MUST NOT Display Overdue Indicator When:
- `isOverdue(todo) === false`
- Todo is completed (`todo.completed === true`)
- Todo has no due date (`todo.dueDate === null/undefined`)
- Todo due date is today or future

## Props Contract

### Existing Props (Unchanged)
```typescript
interface TodoCardProps {
  todo: Todo;                    // The todo item to display
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  // ... other existing props
}
```

**No new props required** - overdue status computed internally using `isOverdue(todo)` utility.

## DOM Structure Contract

### Without Overdue Indicator
```html
<div class="todo-card">
  <input type="checkbox" />
  <span class="todo-title">Todo text here</span>
  <span class="todo-due-date">Due: Mar 5, 2026</span>
  <!-- ... other elements -->
</div>
```

### With Overdue Indicator
```html
<div class="todo-card">
  <input type="checkbox" />
  <span class="todo-title todo-overdue">
    Todo text here
    <span class="todo-overdue-icon" role="alert" aria-label="Overdue">⚠️</span>
  </span>
  <span class="todo-due-date">Due: Feb 20, 2026</span>
  <!-- ... other elements -->
</div>
```

## CSS Class Contract

### New CSS Classes

```css
/* Applied to todo title when overdue */
.todo-overdue {
  color: var(--color-error);    /* Required: Use design system error color */
}

/* Applied to warning icon span */
.todo-overdue-icon {
  margin-left: 8px;              /* Required: 8px spacing (grid system) */
  font-size: 1rem;               /* Required: Match title font size */
  display: inline;               /* Required: Keep inline with text */
}
```

## Behavior Contract

### Real-Time Updates
- When `todo.completed` changes: Re-render with/without indicator within 1 second (SC-004)
- When `todo.dueDate` changes: Re-render with/without indicator within 1 second (SC-004)
- Implementation: React state updates automatically trigger re-render

### No Reordering
- Overdue todos MUST maintain their existing position in the list (FR-009)
- Do NOT sort or reorder todos based on overdue status

### Due Date Display
- Due date MUST remain visible when todo is overdue (FR-007, User Story 2)
- Both indicator and due date should be clearly visible together

## Accessibility Contract (WCAG AA)

### Required Attributes
1. **Warning Icon Element**:
   - `role="alert"` - Polite assertive ARIA live region
   - `aria-label="Overdue"` - Screen reader text for icon

### Color Contrast
- Error/danger color MUST meet WCAG AA contrast ratio (≥4.5:1 for normal text)
- Existing design system color assumed compliant

### Keyboard Navigation
- No changes to existing keyboard navigation
- Overdue indicator is visual/semantic only, not interactive

### Screen Reader Announcement
```
Example screen reader output:
"Checkbox, not checked. Call dentist, Overdue. Due February 20, 2026."
```

## Testing Contract

### Visual Regression Tests
- ✅ Todo with past due date + incomplete → shows red text + ⚠️
- ✅ Todo with past due date + completed → no indicator
- ✅ Todo with future due date → no indicator
- ✅ Todo with today's due date → no indicator
- ✅ Todo with no due date → no indicator

### Accessibility Tests
- ✅ Warning icon has `role="alert"`
- ✅ Warning icon has `aria-label="Overdue"`
- ✅ Screen reader announces "Overdue" for overdue todos

### Interaction Tests
- ✅ Marking overdue todo complete → indicator disappears
- ✅ Changing past due date to future → indicator disappears
- ✅ Marking completed overdue todo incomplete → indicator reappears

## Performance Contract

- Overdue check on each render (acceptable for 10-100 todos)
- No memoization required initially (premature optimization)
- If performance issues arise: Add `useMemo([todo.completed, todo.dueDate])`

## Breaking Changes

**None** - This is an additive change:
- Existing TodoCard props unchanged
- Existing functionality unchanged
- New visual indicator added conditionally

## Version

**Version**: 1.0.0  
**Status**: Stable  
**Component Updated**: `TodoCard` (existing component enhanced)
