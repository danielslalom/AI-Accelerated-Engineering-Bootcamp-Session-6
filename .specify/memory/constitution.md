<!--
SYNC IMPACT REPORT
==================
Version Change: Template → 1.0.0
Initial constitution created from project documentation

Principles Defined:
  1. Code Quality & SOLID Design - Derived from docs/coding-guidelines.md (SOLID section)
  2. Test-First Development (NON-NEGOTIABLE) - Derived from docs/testing-guidelines.md (TDD principle)
  3. Single Responsibility & Simplicity (KISS/YAGNI) - Derived from docs/coding-guidelines.md
                                                       and docs/functional-requirements.md
  4. User Experience & Accessibility - Derived from docs/ui-guidelines.md (accessibility section)
  5. Consistency & Maintainability (DRY) - Derived from docs/coding-guidelines.md (DRY principle)

Sections Added:
  - Technical Standards - Derived from docs/project-overview.md and docs/coding-guidelines.md
  - Development Workflow - Derived from docs/testing-guidelines.md and docs/coding-guidelines.md
  - Governance - Standard governance rules for constitutional compliance

Template Alignment Review:
  ✅ .specify/memory/constitution.md - Created with all principles defined
  ✅ .specify/templates/plan-template.md - "Constitution Check" section aligns with governance
  ✅ .specify/templates/spec-template.md - User story format aligns with Principle III (simplicity)
  ✅ .specify/templates/tasks-template.md - Test-first approach aligns with Principle II (TDD)
  ✅ .specify/templates/checklist-template.md - Generic template, no conflicts
  ✅ .specify/templates/agent-file-template.md - Auto-generated file, no conflicts
  ✅ .specify/templates/constitution-template.md - Source template, no updates needed

Documentation Cross-References:
  ✅ docs/coding-guidelines.md - Referenced in Technical Standards and Development Workflow
  ✅ docs/testing-guidelines.md - Referenced in Principle II and Development Workflow
  ✅ docs/ui-guidelines.md - Referenced in Principle IV
  ✅ docs/functional-requirements.md - Referenced in Principle III and Governance
  ✅ docs/project-overview.md - Referenced in Technical Standards

Follow-up TODOs: None - All templates align with constitutional principles
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & SOLID Design

All code MUST adhere to SOLID principles and established coding standards:
- **Single Responsibility**: Each module, component, and function has one reason to change
- **Open/Closed**: Code is open for extension, closed for modification (use composition)
- **Liskov Substitution**: Subtypes are substitutable for parent types without breaking contracts
- **Interface Segregation**: Components depend only on specific interfaces they use
- **Dependency Inversion**: Depend on abstractions, not concrete implementations

**Naming Conventions**: camelCase for variables/functions, PascalCase for components/classes,
UPPER_SNAKE_CASE for constants. Files match component names.

**Import Organization**: External libraries → Internal modules → Styles, separated by blank lines.

**Rationale**: SOLID principles ensure maintainability, testability, and scalability. Consistent
conventions reduce cognitive load and prevent errors.

### II. Test-First Development (NON-NEGOTIABLE)

Test-Driven Development is MANDATORY for all features:
- Tests describe expected behavior BEFORE implementation
- **Target Coverage**: 80%+ across all packages
- Follow Red-Green-Refactor cycle: Write test → Verify failure → Implement → Pass → Refactor
- Tests validate and document functionality
- All code changes require corresponding test updates

**Test Types Required**:
- Unit tests for individual components and functions
- Integration tests for component interactions and API communication

**Rationale**: TDD ensures code correctness, prevents regression, and creates living documentation.
High coverage catches bugs early and enables confident refactoring.

### III. Single Responsibility & Simplicity (KISS/YAGNI)

Features MUST remain focused and simple:
- **KISS (Keep It Simple)**: Prefer straightforward implementations over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Build only what is required, avoid premature 
  optimization and feature creep
- Each component/function performs one well-defined task
- Code readability takes precedence over cleverness
- Break complex logic into smaller, understandable functions

**Out of Scope**: Multi-user support, authentication, advanced filtering, search, bulk
operations, categories, priorities, recurring tasks, undo/redo, reminders.

**Rationale**: Simple code is easy to understand, test, and maintain. Single responsibility
reduces coupling and improves modularity.

### IV. User Experience & Accessibility

All UI implementations MUST meet accessibility and design standards:
- **WCAG AA Compliance**: Color contrast ratios, keyboard navigation, ARIA labels
- **Material Design Principles**: Elevation, consistent spacing (8px grid), clear typography
- **Component States**: Proper hover, focus, active, and disabled states
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 1024px
- **Theme Support**: Light and dark modes with persistent user preference
- Form labels properly associated with inputs
- Icon buttons have descriptive aria-labels

**Rationale**: Accessible applications serve all users regardless of ability. Consistent design
systems improve usability and reduce implementation errors.

### V. Consistency & Maintainability (DRY)

Code MUST be maintainable and avoid duplication:
- **DRY (Don't Repeat Yourself)**: Extract common code into shared functions or utilities
- **Reusable Components**: Build UI components that can be reused across the application
- **Shared Utilities**: Create utility modules for common operations (formatting, validation, etc.)
- **Proper Error Handling**: Try-catch blocks with meaningful messages and user feedback
- **Comments for "Why"**: Document rationale, not obvious implementation details
- **Keep Comments Updated**: Outdated comments are worse than no comments

**Code Organization**: Imports → Constants → Utilities → Main component/class → Helpers → Exports

**Rationale**: DRY reduces maintenance burden and ensures consistency. Well-organized code is
easier to navigate and understand.

## Technical Standards

**Technology Stack**:
- Frontend: React with functional components and hooks
- Backend: Node.js with Express.js REST API
- Testing: Jest with @testing-library/react for frontend
- Styling: CSS with Material Design principles
- Persistence: Backend API (single-user, no authentication required)

**Code Formatting**:
- Indentation: 2 spaces for all file types
- Line length: Ideally under 100 characters
- Line endings: LF (Unix-style)
- No trailing whitespace
- ESLint configuration enforced

**Error Handling**:
- All async operations wrapped in try-catch blocks
- Meaningful error messages provided to users
- Errors logged appropriately (console.error in development)
- Graceful degradation when operations fail

**Performance**:
- Use React hooks (useMemo, useCallback) appropriately to avoid unnecessary renders
- Efficient algorithms and data structures
- Keep component and bundle sizes reasonable

## Development Workflow

**Test Organization**:
- Tests colocated in `__tests__/` directories next to source files
- Test files named `{filename}.test.js`
- Mock data and fixtures in `__mocks__/` or `fixtures/` directories
- Test structure: Imports → Setup → Describe blocks → Individual tests

**Code Review Requirements**:
- All code changes go through pull request review
- ESLint errors must be resolved before merge
- Test coverage must be maintained at 80%+ after changes
- Tests must pass in CI before merge
- Review checklist verifies compliance with all principles

**Documentation**:
- JSDoc comments for public functions and components
- README files for each package explaining purpose and usage
- Keep documentation in sync with code changes
- Reference docs/coding-guidelines.md, docs/testing-guidelines.md, docs/ui-guidelines.md,
  and docs/functional-requirements.md for detailed guidance

**Git Practices**:
- Meaningful commit messages describing "what" and "why"
- Feature branches for new work
- Keep commits focused and atomic

## Governance

This Constitution supersedes all other development practices and guidelines. All team members
MUST comply with the principles and standards defined herein.

**Amendment Process**:
- Proposed amendments must be documented with justification
- Changes require team consensus
- Version number updated according to semantic versioning:
  - MAJOR: Backward-incompatible principle removals or redefinitions
  - MINOR: New principles or materially expanded guidance
  - PATCH: Clarifications, wording improvements, typo fixes
- Amendments include migration plan for affected code
- Last Amended date updated on approval

**Compliance Review**:
- All pull requests must verify adherence to constitutional principles
- Complexity must be justified against KISS/YAGNI principles
- Any deviation from principles requires explicit documentation and approval
- Regular audits to ensure ongoing compliance

**Reference Documentation**:
- Runtime development guidance found in docs/ directory
- Coding standards: docs/coding-guidelines.md
- Testing strategy: docs/testing-guidelines.md
- Design system: docs/ui-guidelines.md
- Feature scope: docs/functional-requirements.md

**Version**: 1.0.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-02-27
