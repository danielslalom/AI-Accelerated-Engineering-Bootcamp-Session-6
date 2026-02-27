# Quick Start Guide: Overdue Todo Indicator

**Feature**: 001-overdue-todo-indicator  
**Estimated Time**: 2-4 hours (following TDD)  
**Prerequisites**: Node.js 18+, React 18, Jest configured

## Overview

Implement a visual indicator for overdue todo items that displays when a todo is incomplete and past its due date. Follow Test-Driven Development - write tests first, then implement.

## Implementation Checklist

- [ ] **Step 1**: Implement `isOverdue()` utility function (TDD)
- [ ] **Step 2**: Update TodoCard component styling (TDD)
- [ ] **Step 3**: Add accessibility attributes (TDD)
- [ ] **Step 4**: Integration tests for real-time updates
- [ ] **Step 5**: Manual accessibility validation

## Step 1: Implement `isOverdue()` Utility (30-45 min)

### 1.1 Write Tests First (Red Phase)

**File**: `packages/frontend/src/services/__tests__/todoService.test.js`

Add test cases:
```javascript
describe('isOverdue', () => {
  beforeEach(() => {
    // Mock current date to Feb 27, 2026
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns true for incomplete todo with past due date', () => {
    const todo = { completed: false, dueDate: '2026-02-20' };
    expect(isOverdue(todo)).toBe(true);
  });

  test('returns false for completed todo with past due date', () => {
    const todo = { completed: true, dueDate: '2026-02-20' };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for incomplete todo with future due date', () => {
    const todo = { completed: false, dueDate: '2026-03-10' };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for incomplete todo with today due date', () => {
    const todo = { completed: false, dueDate: '2026-02-27' };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for incomplete todo with no due date', () => {
    const todo = { completed: false, dueDate: null };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for incomplete todo with undefined due date', () => {
    const todo = { completed: false, dueDate: undefined };
    expect(isOverdue(todo)).toBe(false);
  });
});
```

**Run**: `npm test` → Should see 6 failing tests ✅ RED

### 1.2 Implement Function (Green Phase)

**File**: `packages/frontend/src/services/todoService.js`

Add function:
```javascript
export function isOverdue(todo) {
  // Completed todos are never overdue
  if (todo.completed) return false;
  
  // Todos without due dates cannot be overdue
  if (!todo.dueDate) return false;
  
  // Normalize dates to midnight for date-only comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(todo.dueDate);
  // Handle invalid dates
  if (isNaN(dueDate.getTime())) return false;
  
  dueDate.setHours(0, 0, 0, 0);
  
  // Due date must be strictly before today
  return dueDate < today;
}
```

**Run**: `npm test` → Should see 6 passing tests ✅ GREEN

### 1.3 Refactor (Optional)

If code can be simplified while keeping tests green, refactor now.

**Duration**: ~30-45 minutes (with TDD cycle)

---

## Step 2: Update TodoCard Component (45-60 min)

### 2.1 Write Component Tests First (Red Phase)

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

Add test cases:
```javascript
import { render, screen } from '@testing-library/react';
import TodoCard from '../TodoCard';

// Mock isOverdue utility
jest.mock('../../services/todoService', () => ({
  ...jest.requireActual('../../services/todoService'),
  isOverdue: jest.fn(),
}));

import { isOverdue } from '../../services/todoService';

describe('TodoCard - Overdue Indicator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays warning icon and red text when todo is overdue', () => {
    isOverdue.mockReturnValue(true);
    const todo = { id: '1', title: 'Test Todo', completed: false, dueDate: '2026-02-20' };
    
    render(<TodoCard todo={todo} />);
    
    // Check for warning icon
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('⚠️');
    
    // Check for overdue styling
    const title = screen.getByText('Test Todo');
    expect(title).toHaveClass('todo-overdue');
  });

  test('does not display warning icon when todo is not overdue', () => {
    isOverdue.mockReturnValue(false);
    const todo = { id: '1', title: 'Test Todo', completed: false, dueDate: '2026-03-10' };
    
    render(<TodoCard todo={todo} />);
    
    // Warning icon should not be present
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('displays due date alongside overdue indicator', () => {
    isOverdue.mockReturnValue(true);
    const todo = { id: '1', title: 'Test Todo', completed: false, dueDate: '2026-02-20' };
    
    render(<TodoCard todo={todo} />);
    
    // Both indicator and due date should be visible
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Feb.*20.*2026/i)).toBeInTheDocument();
  });
});
```

**Run**: `npm test` → Should see 3 failing tests ✅ RED

### 2.2 Update Component (Green Phase)

**File**: `packages/frontend/src/components/TodoCard.js`

Add overdue indicator logic:
```javascript
import React from 'react';
import { isOverdue } from '../services/todoService';

function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(todo);
  
  return (
    <div className="todo-card">
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => onToggle?.(todo.id)}
      />
      <span className={`todo-title ${overdue ? 'todo-overdue' : ''}`}>
        {todo.title}
        {overdue && (
          <span 
            className="todo-overdue-icon" 
            role="alert" 
            aria-label="Overdue"
          >
            ⚠️
          </span>
        )}
      </span>
      {todo.dueDate && (
        <span className="todo-due-date">
          Due: {new Date(todo.dueDate).toLocaleDateString()}
        </span>
      )}
      {/* ...other elements */}
    </div>
  );
}

export default TodoCard;
```

### 2.3 Add CSS Styling

**File**: `packages/frontend/src/styles/theme.css` (or relevant CSS file)

Add styles:
```css
.todo-overdue {
  color: var(--color-error); /* Use existing design system variable */
}

.todo-overdue-icon {
  margin-left: 8px;
  font-size: 1rem;
  display: inline;
}
```

**Run**: `npm test` → Should see 3 passing tests ✅ GREEN

**Duration**: ~45-60 minutes

---

## Step 3: Accessibility Tests (20-30 min)

### 3.1 Add Accessibility Test Cases

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

Add tests:
```javascript
test('overdue indicator has proper ARIA attributes', () => {
  isOverdue.mockReturnValue(true);
  const todo = { id: '1', title: 'Test', completed: false, dueDate: '2026-02-20' };
  
  render(<TodoCard todo={todo} />);
  
  const alert = screen.getByRole('alert');
  expect(alert).toHaveAttribute('aria-label', 'Overdue');
});

test('overdue indicator has no axe accessibility violations', async () => {
  isOverdue.mockReturnValue(true);
  const todo = { id: '1', title: 'Test', completed: false, dueDate: '2026-02-20' };
  
  const { container } = render(<TodoCard todo={todo} />);
  
  // Requires jest-axe: npm install --save-dev jest-axe
  const { axe, toHaveNoViolations } = require('jest-axe');
  expect.extend(toHaveNoViolations);
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Run**: `npm test` → Should pass ✅

**Duration**: ~20-30 minutes

---

## Step 4: Integration Tests (30-45 min)

### 4.1 Test Real-Time Updates

**File**: `packages/frontend/src/__tests__/App.test.js`

Add integration tests:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

test('overdue indicator disappears when todo is completed', () => {
  // Mock date
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-27'));
  
  render(<App />);
  
  // Assume app has an overdue todo
  const overdueAlert = screen.queryByRole('alert');
  expect(overdueAlert).toBeInTheDocument();
  
  // Complete the todo
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  
  // Alert should disappear
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  
  jest.useRealTimers();
});

test('overdue indicator disappears when due date is changed to future', async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-27'));
  
  render(<App />);
  
  // Edit todo and change due date to future
  const editButton = screen.getByLabelText(/edit/i);
  fireEvent.click(editButton);
  
  const dateInput = screen.getByLabelText(/due date/i);
  fireEvent.change(dateInput, { target: { value: '2026-03-10' } });
  
  const saveButton = screen.getByText(/save/i);
  fireEvent.click(saveButton);
  
  // Alert should disappear
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  
  jest.useRealTimers();
});
```

**Run**: `npm test` → Should pass ✅

**Duration**: ~30-45 minutes

---

## Step 5: Manual Testing (20-30 min)

### 5.1 Visual Verification

**Steps**:
1. Start dev server: `npm start`
2. Create test todos:
   - Incomplete with past due date → ✅ Should show ⚠️ in red
   - Completed with past due date → ✅ Should NOT show ⚠️
   - Incomplete with future due date → ✅ Should NOT show ⚠️
   - Incomplete with no due date → ✅ Should NOT show ⚠️
3. Toggle completion → ✅ Indicator updates immediately
4. Edit due date → ✅ Indicator updates immediately

### 5.2 Screen Reader Testing

**Tools**: NVDA (Windows) or VoiceOver (macOS)

**Steps**:
1. Enable screen reader
2. Navigate to overdue todo
3. ✅ Should announce: "[Title], Overdue, Due [date]"
4. Navigate to normal todo
5. ✅ Should NOT announce "Overdue"

### 5.3 Keyboard Testing

**Steps**:
1. Tab through todos → ✅ Focus order unchanged
2. Space to toggle → ✅ Works as expected
3. ✅ No keyboard traps

**Duration**: ~20-30 minutes

---

## Verification Checklist

Before considering feature complete:

### Functional Requirements
- [ ] FR-001: Overdue status correctly identifies incomplete todos with past due dates
- [ ] FR-002: Visual styling includes error color + ⚠️ icon
- [ ] FR-003: Completed todos never show overdue (regardless of due date)
- [ ] FR-004: Todos without due dates never show overdue
- [ ] FR-005: Updates when completion status changes
- [ ] FR-006: Updates when due date changes
- [ ] FR-007: Due date visible alongside indicator
- [ ] FR-009: No reordering based on overdue status
- [ ] FR-011: Today's date not considered overdue
- [ ] FR-012: Accessibility attributes present

### Success Criteria
- [ ] SC-001: Overdue todos identifiable within 2 seconds
- [ ] SC-004: Updates within 1 second when status/date changes
- [ ] SC-005: No performance degradation

### Testing
- [ ] 80%+ test coverage maintained
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Manual screen reader test passed
- [ ] Manual keyboard navigation test passed

---

## Common Issues & Solutions

### Issue: Tests failing due to date mocking
**Solution**: Use `jest.useFakeTimers()` and `jest.setSystemTime()` to mock current date

### Issue: Overdue indicator not updating immediately
**Solution**: Ensure React state updates properly trigger re-render. Check that `isOverdue()` is called during render, not cached.

### Issue: Screen reader not announcing "Overdue"
**Solution**: Verify `role="alert"` and `aria-label="Overdue"` are present on icon span

### Issue: CSS styles not applying
**Solution**: Check that design system error color variable exists (`var(--color-error)`)

---

## Next Steps

After completing implementation:
1. Create pull request
2. Run full test suite: `npm test` (all packages)
3. Run accessibility audit: `npm run a11y` (if available)
4. Request code review
5. Verify all acceptance scenarios from spec

---

## Resources

- **Spec**: [spec.md](spec.md)
- **Research**: [research.md](research.md)
- **Data Model**: [data-model.md](data-model.md)
- **Contracts**: [contracts/](contracts/)
- **Constitution**: `/.specify/memory/constitution.md`

---

**Estimated Total Time**: 2-4 hours (following TDD rigorously)

**Status**: Ready for implementation ✅
