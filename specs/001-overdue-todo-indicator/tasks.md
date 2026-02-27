# Tasks: Overdue Todo Indicator

**Input**: Design documents from `/specs/001-overdue-todo-indicator/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Tests are included following TDD mandate from Constitution Principle II (NON-NEGOTIABLE)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app monorepo: `packages/backend/src/`, `packages/frontend/src/`
- Tests: `packages/backend/__tests__/`, `packages/frontend/src/__tests__/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and dependencies

**Duration**: ~5 minutes

- [ ] T001 Verify React 18 and Jest dependencies are installed in packages/frontend/package.json
- [ ] T002 Verify Express.js and Jest dependencies are installed in packages/backend/package.json
- [ ] T003 [P] Confirm existing design system error/danger color variable in packages/frontend/src/styles/theme.css

**Checkpoint**: Project structure verified - no new setup required

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: None required - feature uses existing todo data model

**⚠️ CRITICAL**: This feature has no foundational blocking tasks. User story implementation can begin immediately after Phase 1.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Identification of Overdue Tasks (Priority: P1) 🎯 MVP

**Goal**: Display clear visual indicators (error/danger color text + ⚠️ icon) for incomplete todos with past due dates

**Independent Test**: Create todos with various due dates (past/today/future) and completion states, verify only incomplete + past due todos show red text and warning icon

### Tests for User Story 1: Utility Function

> **NOTE: Write tests FIRST (Red), ensure they FAIL, then implement (Green)**

- [ ] T004 [P] [US1] Write failing tests for isOverdue() utility with incomplete+past due date case in packages/frontend/src/services/__tests__/todoService.test.js
- [ ] T005 [P] [US1] Write failing tests for isOverdue() with completed+past due date case (expect false) in packages/frontend/src/services/__tests__/todoService.test.js
- [ ] T006 [P] [US1] Write failing tests for isOverdue() with incomplete+future due date case (expect false) in packages/frontend/src/services/__tests__/todoService.test.js
- [ ] T007 [P] [US1] Write failing tests for isOverdue() with incomplete+today due date case (expect false) in packages/frontend/src/services/__tests__/todoService.test.js
- [ ] T008 [P] [US1] Write failing tests for isOverdue() with null/undefined due date cases (expect false) in packages/frontend/src/services/__tests__/todoService.test.js

### Implementation: Utility Function

- [ ] T009 [US1] Implement isOverdue() utility function per contracts/utility-functions.md in packages/frontend/src/services/todoService.js
- [ ] T010 [US1] Verify all isOverdue() tests pass (Green phase) by running npm test in packages/frontend

### Tests for User Story 1: TodoCard Component

> **NOTE: Write component tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Write failing test for TodoCard displaying warning icon when todo is overdue in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T012 [P] [US1] Write failing test for TodoCard applying todo-overdue CSS class when overdue in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T013 [P] [US1] Write failing test for TodoCard NOT displaying warning icon when not overdue in packages/frontend/src/components/__tests__/TodoCard.test.js

### Implementation: TodoCard Component

- [ ] T014 [US1] Import isOverdue utility in packages/frontend/src/components/TodoCard.js
- [ ] T015 [US1] Add conditional todo-overdue CSS class to todo title element per contracts/ui-components.md in packages/frontend/src/components/TodoCard.js
- [ ] T016 [US1] Add conditional warning icon (⚠️) with role="alert" and aria-label="Overdue" per contracts/accessibility.md in packages/frontend/src/components/TodoCard.js
- [ ] T017 [US1] Verify all TodoCard component tests pass by running npm test in packages/frontend

### Implementation: CSS Styling

- [ ] T018 [P] [US1] Add .todo-overdue CSS class using var(--color-error) per contracts/ui-components.md in packages/frontend/src/App.css
- [ ] T019 [P] [US1] Add .todo-overdue-icon CSS class with 8px margin-left per contracts/ui-components.md in packages/frontend/src/App.css

### Tests for User Story 1: Accessibility

- [ ] T020 [P] [US1] Write test verifying role="alert" attribute presence on overdue icon in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T021 [P] [US1] Write test verifying aria-label="Overdue" attribute presence on overdue icon in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T022 [US1] Verify accessibility tests pass by running npm test in packages/frontend

**Checkpoint**: User Story 1 complete - overdue todos display with visual indicators. Test independently by creating sample todos.

---

## Phase 4: User Story 2 - Due Date Context Display (Priority: P2)

**Goal**: Ensure due dates remain visible alongside overdue indicators for prioritization context

**Independent Test**: View overdue todos and verify both the warning indicator and the due date are clearly visible

### Tests for User Story 2

> **NOTE: This story enhances US1 - tests verify due date visibility alongside indicator**

- [ ] T023 [P] [US2] Write test verifying overdue todos display both warning icon and due date text in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T024 [P] [US2] Write test verifying due date format is readable (e.g., "Feb 20, 2026") in packages/frontend/src/components/__tests__/TodoCard.test.js

### Implementation for User Story 2

- [ ] T025 [US2] Verify due date is displayed in TodoCard component layout (should already exist, confirm no conflict with overdue styling) in packages/frontend/src/components/TodoCard.js
- [ ] T026 [US2] Verify tests pass by running npm test in packages/frontend

**Checkpoint**: User Story 2 complete - overdue context is clear with visible due dates. Both US1 and US2 independently functional.

---

## Phase 5: User Story 3 - Consistency Across Todo Actions (Priority: P3)

**Goal**: Ensure overdue indicator updates correctly when todos are completed, reopened, or due dates change

**Independent Test**: Perform todo operations (complete, uncomplete, change due date) and verify overdue indicator updates immediately

### Tests for User Story 3: Real-Time Updates

> **NOTE: Integration tests verify overdue status updates on state changes**

- [ ] T027 [P] [US3] Write integration test for marking overdue todo complete removes indicator in packages/frontend/src/__tests__/App.test.js
- [ ] T028 [P] [US3] Write integration test for unmarking completed todo restores overdue indicator if still past due in packages/frontend/src/__tests__/App.test.js
- [ ] T029 [P] [US3] Write integration test for changing overdue todo due date to future removes indicator in packages/frontend/src/__tests__/App.test.js
- [ ] T030 [P] [US3] Write integration test for changing future due date to past adds overdue indicator in packages/frontend/src/__tests__/App.test.js

### Implementation for User Story 3

- [ ] T031 [US3] Verify TodoCard re-renders when todo.completed changes (React state should handle automatically) in packages/frontend/src/components/TodoCard.js
- [ ] T032 [US3] Verify TodoCard re-renders when todo.dueDate changes (React state should handle automatically) in packages/frontend/src/components/TodoCard.js
- [ ] T033 [US3] Run integration tests to verify real-time updates work by running npm test in packages/frontend
- [ ] T034 [US3] Manually test update scenarios per quickstart.md Step 4 scenarios

**Checkpoint**: User Story 3 complete - overdue status remains accurate during all todo operations. All user stories (US1, US2, US3) independently functional.

---

## Phase 6: Backend Enhancement (Optional)

**Purpose**: Add isOverdue() utility to backend for potential API enhancements (not required for frontend functionality)

- [ ] T035 [P] Add isOverdue() utility function to packages/backend/src/services/todoService.js (same logic as frontend)
- [ ] T036 [P] Write unit tests for backend isOverdue() in packages/backend/__tests__/app.test.js
- [ ] T037 Verify backend tests pass by running npm test in packages/backend

**Checkpoint**: Backend utility available for future API enhancements

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and accessibility verification

- [ ] T038 [P] Verify WCAG AA color contrast ratio for error/danger color using browser DevTools or axe
- [ ] T039 [P] Test with screen reader (NVDA/JAWS/VoiceOver) per contracts/accessibility.md expected announcements
- [ ] T040 [P] Verify keyboard navigation remains unchanged (Tab, Space, Enter work as expected)
- [ ] T041 [P] Run all tests across frontend and backend to ensure no regressions
- [ ] T042 [P] Validate complete quickstart.md workflow end-to-end
- [ ] T043 [P] Update project documentation if needed in docs/ folder
- [ ] T044 Code review and refactoring for code quality per Constitution Principle I
- [ ] T045 Final manual testing with various date scenarios (past, today, future, null)

**Checkpoint**: Feature complete, tested, accessible, and ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately ✅
- **Foundational (Phase 2)**: N/A - no blocking tasks ✅
- **User Story 1 (Phase 3)**: Depends on Setup completion → First MVP increment
- **User Story 2 (Phase 4)**: Depends on User Story 1 → Enhances visual context
- **User Story 3 (Phase 5)**: Depends on User Story 1 → Validates real-time behavior
- **Backend Enhancement (Phase 6)**: Can run in parallel after Phase 1 (optional)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - can start after Phase 1 ✅
  - Foundational feature - creates overdue visual indicator
- **User Story 2 (P2)**: Logically depends on User Story 1 (extends the display)
  - Can start immediately after US1 complete
  - Independent test: Verify due date + indicator are both visible
- **User Story 3 (P3)**: Depends on User Story 1 (validates behavior)
  - Integration tests verify US1 works correctly during state changes
  - Can start immediately after US1 complete

### Within Each User Story

1. Tests MUST be written FIRST and FAIL (Red phase)
2. Implementation MUST make tests pass (Green phase)
3. Refactor if needed while keeping tests green
4. Utility tests → utility implementation → component tests → component implementation
5. Verify story is independently testable before moving to next priority

### Parallel Opportunities

**Within Phase 3 (User Story 1)**:
- All utility function tests (T004-T008) can be written in parallel
- After isOverdue() implementation: All component tests (T011-T013) can be written in parallel
- CSS styling tasks (T018-T019) can run in parallel
- Accessibility tests (T020-T021) can be written in parallel

**Within Phase 4 (User Story 2)**:
- Both tests (T023-T024) can be written in parallel

**Within Phase 5 (User Story 3)**:
- All integration tests (T027-T030) can be written in parallel

**Within Phase 6 (Backend)**:
- Backend isOverdue() (T035) and backend tests (T036) and frontend work can run in parallel

**Within Phase 7 (Polish)**:
- Most polish tasks (T038-T043) can run in parallel

**Across User Stories**:
- After US1 (Phase 3) completes, US2 (Phase 4) and US3 (Phase 5) can start independently
- Backend enhancement (Phase 6) can start anytime after Phase 1

---

## Parallel Example: User Story 1

```bash
# Step 1: Write all utility tests in parallel (Red phase)
Task T004: Write test for incomplete+past due → true
Task T005: Write test for completed+past due → false
Task T006: Write test for incomplete+future → false
Task T007: Write test for incomplete+today → false
Task T008: Write test for null/undefined → false

# Step 2: Implement utility (Green phase)
Task T009: Implement isOverdue() function
Task T010: Verify tests pass

# Step 3: Write all component tests in parallel (Red phase)
Task T011: Write test for warning icon display
Task T012: Write test for CSS class application
Task T013: Write test for no icon when not overdue

# Step 4: Implement component in sequence + parallel CSS
Task T014: Import isOverdue utility
Task T015: Add conditional CSS class
Task T016: Add conditional warning icon
Task T017: Verify component tests pass
Task T018 & T019: (Parallel) Add CSS classes

# Step 5: Write accessibility tests in parallel (Red phase)
Task T020: Write test for role="alert"
Task T021: Write test for aria-label="Overdue"
Task T022: Verify accessibility tests pass
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) 🎯

**Goal**: Get basic overdue indicator working - minimal viable value

1. ✅ Complete Phase 1: Setup (verify dependencies)
2. ✅ Skip Phase 2: Foundational (nothing blocking)
3. 🎯 Complete Phase 3: User Story 1 (visual indicator)
   - Write tests → implement isOverdue() → write component tests → update TodoCard → add CSS
4. **STOP and VALIDATE**: 
   - Create test todos with past due dates
   - Verify red text and ⚠️ icon appear for incomplete+past due
   - Verify completed todos don't show indicator
   - Test with screen reader
5. **Deploy/demo MVP** - core value delivered!

**Estimated Time**: 2-4 hours (per quickstart.md)

### Incremental Delivery

**After MVP (US1)**:
1. Add User Story 2 (due date visibility validation) → 30 min
   - Already works if TodoCard shows due dates
   - Just add tests to verify context is clear
2. Add User Story 3 (real-time update validation) → 1 hour
   - Write integration tests
   - Verify React state updates work correctly
3. Add Polish (accessibility validation + docs) → 1 hour

**Total Estimated Time**: 4-6 hours for complete feature

### Parallel Team Strategy

With multiple developers available:

1. **Team completes Phase 1 together** (5 min)
2. **After Phase 1, split work**:
   - **Developer A**: User Story 1 (T004-T022) - Core feature
   - **Developer B**: Backend Enhancement (T035-T037) - Optional utility
   - **Developer C**: Prepare test data and accessibility checklist
3. **After US1 complete**:
   - **Developer A**: User Story 2 (T023-T026) - Context validation
   - **Developer B**: User Story 3 (T027-T034) - Update validation
4. **Final validation together**: Phase 7 (Polish)

**Team Delivery Time**: 2-3 hours (with 2-3 developers)

---

## Task Statistics

**Total Tasks**: 45 tasks
- **Phase 1 (Setup)**: 3 tasks (~5 minutes)
- **Phase 2 (Foundational)**: 0 tasks (no blocking work)
- **Phase 3 (User Story 1 - P1)**: 19 tasks (~2-4 hours) 🎯 MVP
- **Phase 4 (User Story 2 - P2)**: 4 tasks (~30 minutes)
- **Phase 5 (User Story 3 - P3)**: 8 tasks (~1 hour)
- **Phase 6 (Backend Optional)**: 3 tasks (~30 minutes)
- **Phase 7 (Polish)**: 8 tasks (~1 hour)

**Parallelizable Tasks**: 24 tasks marked with [P] (53% of total)

**Test Tasks**: 20 tasks (44% of total - following TDD mandate)

**Independent Test Criteria**:
- **US1**: Create todos with various due dates, verify visual indicators appear correctly
- **US2**: View overdue todos, confirm both indicator and due date are visible
- **US3**: Perform todo operations, verify indicator updates immediately

**MVP Scope**: Phase 1 + Phase 3 (User Story 1 only) = 22 tasks, 2-4 hours

---

## Notes

- ✅ **TDD Mandate**: Tests are included per Constitution Principle II (NON-NEGOTIABLE)
- ✅ **User Story Organization**: Tasks grouped by story for independent implementation
- ✅ **Checklist Format**: All tasks follow required format: `- [ ] [ID] [P?] [Story?] Description with file path`
- ✅ **Independent Testing**: Each user story has clear validation criteria
- ✅ **Incremental Delivery**: MVP (US1) → US2 → US3 progression
- ✅ **Parallel Opportunities**: 24 tasks can run in parallel within their phases
- 📋 **File Paths**: All tasks include exact file paths for implementation
- 🎯 **MVP Focus**: User Story 1 (Phase 3) delivers core value - stop there for fastest delivery
- ⚡ **Quick Wins**: No database migrations, no new dependencies, pure view-layer enhancement
- ♿ **Accessibility**: WCAG AA compliance built into tasks (tests + implementation)

**Ready to Execute**: Start with T001 and follow TDD workflow (Red → Green → Refactor)
