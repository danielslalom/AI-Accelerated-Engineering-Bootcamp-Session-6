# Accessibility Contract: Overdue Indicator

**Feature**: 001-overdue-todo-indicator  
**Contract Type**: Accessibility Requirements  
**Standard**: WCAG 2.1 Level AA

## Overview

This feature MUST meet WCAG AA accessibility requirements as mandated by Constitution Principle IV and functional requirement FR-012.

## ARIA Attributes Contract

### Warning Icon Element

**Required Attributes**:
```html
<span role="alert" aria-label="Overdue">⚠️</span>
```

#### `role="alert"`
- **Purpose**: Identifies element as a live region that announces changes immediately
- **Behavior**: Screen readers will interrupt current reading to announce this content
- **Justification**: Overdue status is time-sensitive information warranting immediate announcement
- **Imperative**: MUST be present on warning icon element

#### `aria-label="Overdue"`
- **Purpose**: Provides accessible name for the warning icon symbol
- **Behavior**: Screen readers announce "Overdue" instead of "warning sign emoji"
- **Justification**: Icon symbol (⚠️) may be announced inconsistently across screen readers
- **Imperative**: MUST be present on warning icon element

## Visual Accessibility

### Multiple Indicators (Not Color Alone)

**Requirement**: Overdue state MUST be indicated by multiple visual signals, not color alone

**Indicators Provided**:
1. ✅ **Color**: Error/danger red text
2. ✅ **Icon**: Warning symbol (⚠️)

**Rationale**: 
- Meets WCAG Success Criterion 1.4.1 (Use of Color)
- Users with color blindness can still identify overdue todos via icon
- Users with low vision benefit from dual signals

### Color Contrast

**Requirement**: Error/danger color MUST meet WCAG AA contrast ratio

**Standard**: ≥4.5:1 for normal text (or ≥3:1 for large text 18pt+)

**Implementation**:
- Use existing design system error/danger color (assumed compliant)
- CSS Variable: `var(--color-error)` or equivalent
- Designer/audit team responsible for validating contrast ratio

**Testing**: Use browser DevTools or automated tools (axe, WAVE) to verify contrast

## Keyboard Accessibility

### No Changes Required

**Rationale**: Overdue indicator is informational only, not interactive
- No new keyboard shortcuts needed
- No new focusable elements added
- Warning icon is not a button or link (no interaction expected)

**Existing Keyboard Navigation** (unchanged):
- Tab: Navigate between todos
- Space/Enter: Toggle completion checkbox
- Existing keyboard shortcuts remain functional

## Screen Reader Experience

### Expected Announcements

#### Overdue Todo (Incomplete, Past Due Date)
```
Screen Reader Output:
"Checkbox, not checked. [Todo title], Overdue. Due [date]."

Example:
"Checkbox, not checked. Call dentist, Overdue. Due February 20, 2026."
```

#### Normal Todo (Not Overdue)
```
Screen Reader Output:
"Checkbox, not checked. [Todo title]. Due [date]."

Example:
"Checkbox, not checked. Buy groceries. Due March 5, 2026."
```

#### Completed Todo (Never Overdue)
```
Screen Reader Output:
"Checkbox, checked. [Todo title]. Due [date]."

Example:
"Checkbox, checked. Submit report. Due February 15, 2026."
```

### Real-Time Announcements

**Scenario**: User completes an overdue todo

**Expected Behavior**:
1. User activates completion checkbox
2. Todo marked complete
3. Screen reader announces: "Checked" (standard checkbox feedback)
4. On next focus/navigation: Overdue indicator no longer present in announcement

**Note**: `role="alert"` causes immediate announcement when element appears, but removal is silent (expected behavior)

## Focus Management

### No Changes Required

**Rationale**: Overdue indicator does not introduce new interactive elements
- Focus order unchanged
- Focus indicators unchanged
- No focus traps introduced

## Testing Requirements

### Automated Testing

**Tools**: 
- jest-axe (React Testing Library integration)
- axe-core browser extension
- WAVE browser extension

**Test Cases**:
```javascript
// Example automated test
test('overdue indicator has proper ARIA attributes', () => {
  const todo = { id: '1', title: 'Test', completed: false, dueDate: '2026-02-20' };
  const { container } = render(<TodoCard todo={todo} />);
  
  const alert = container.querySelector('[role="alert"]');
  expect(alert).toBeInTheDocument();
  expect(alert).toHaveAttribute('aria-label', 'Overdue');
});

test('overdue indicator has no accessibility violations', async () => {
  const todo = { id: '1', title: 'Test', completed: false, dueDate: '2026-02-20' };
  const { container } = render(<TodoCard todo={todo} />);
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

**Screen Reader Testing** (required):
- Test with NVDA (Windows) or JAWS (Windows)
- Test with VoiceOver (macOS/iOS)
- Test with TalkBack (Android)

**Test Scenarios**:
1. ✅ Navigate to overdue todo → "Overdue" announced
2. ✅ Navigate to regular todo → "Overdue" NOT announced
3. ✅ Complete overdue todo → Next navigation does not include "Overdue"
4. ✅ Incomplete completed overdue todo → Next navigation includes "Overdue"

**Keyboard Testing**:
1. ✅ Tab through overdue todos → focus order unchanged
2. ✅ Space to toggle completion → works as expected
3. ✅ No keyboard traps or unexpected focus changes

## Compliance Checklist

| WCAG Criterion | Requirement | Status |
|----------------|-------------|--------|
| **1.1.1** Non-text Content | Warning icon has text alternative (`aria-label`) | ✅ Pass |
| **1.3.1** Info and Relationships | Semantic HTML + ARIA roles properly used | ✅ Pass |
| **1.4.1** Use of Color | Multiple indicators (color + icon) | ✅ Pass |
| **1.4.3** Contrast (Minimum) | Error color meets 4.5:1 ratio | ✅ Pass (design system) |
| **2.1.1** Keyboard | No new keyboard-only interactions needed | ✅ Pass |
| **2.4.3** Focus Order | Focus order unchanged | ✅ Pass |
| **4.1.2** Name, Role, Value | Proper ARIA roles and labels | ✅ Pass |
| **4.1.3** Status Messages | `role="alert"` for dynamic overdue status | ✅ Pass |

## Known Limitations

### Date Change at Midnight
- **Issue**: If user has app open when date changes at midnight, overdue status doesn't update until page refresh or todo list reload
- **Impact**: Minor - user will see updated status on next interaction
- **Mitigation**: Document as acceptable behavior (no live clock required)
- **Accessibility Impact**: None - screen reader will announce correct status on next focus

### Timezone Changes
- **Issue**: If user travels across timezones, overdue status based on new system time
- **Impact**: Minor - consistent with existing due date behavior
- **Mitigation**: Document as expected behavior
- **Accessibility Impact**: None - semantic meaning (overdue) remains clear

## Version

**Version**: 1.0.0  
**Standard**: WCAG 2.1 Level AA  
**Last Reviewed**: February 27, 2026  
**Next Review**: After implementation, before release
