# Implementation Plan: Design System Overhaul

## Overview

Kế hoạch triển khai Design System mới cho ứng dụng Akiflow Clone, bao gồm refactor CSS tokens, component styling, và micro-interactions. Sử dụng TypeScript/React với Next.js và Tailwind CSS.

## Tasks

- [-] 1. Setup Design Tokens và Color System
  - [x] 1.1 Refactor globals.css với color tokens mới
    - Cập nhật CSS variables cho primary (Deep Purple), accent (Coral)
    - Định nghĩa spacing scale và animation tokens
    - Thêm glassmorphism utility classes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 7.1_

  - [x] 1.2 Cập nhật Tailwind theme extension
    - Extend theme với custom colors và spacing
    - Thêm custom animation utilities
    - _Requirements: 1.1, 1.2, 7.1, 7.2_

  - [ ] 1.3 Write property test for color contrast compliance
    - **Property 1: Color Contrast Compliance**
    - **Validates: Requirements 1.5, 10.4**

- [x] 2. Refactor AppSidebar Component
  - [x] 2.1 Implement glassmorphism sidebar styling
    - Thêm backdrop-blur và semi-transparent background
    - Style header với logo và app name
    - Style footer với profile và settings
    - _Requirements: 3.1, 3.4, 3.5_

  - [x] 2.2 Implement menu item hover và active states
    - Thêm hover animation (150ms ease)
    - Highlight active item với primary color
    - _Requirements: 3.3, 3.6_

  - [x] 2.3 Implement collapsed mode styling
    - Style icon-only mode
    - Smooth transition khi collapse/expand
    - _Requirements: 3.2_

- [-] 3. Refactor TaskItem Component
  - [x] 3.1 Implement compact task row styling
    - Consistent 12px vertical padding
    - Circular checkbox với primary color
    - Hover background highlight
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 3.2 Implement completed task styling
    - Strikethrough và muted color cho completed tasks
    - Smooth transition (150ms) cho state changes
    - _Requirements: 4.4, 4.6_

  - [ ] 3.3 Write property test for task list spacing consistency
    - **Property 2: Task List Spacing Consistency**
    - **Validates: Requirements 4.1**

  - [ ] 3.4 Write property test for completed task visual state
    - **Property 3: Completed Task Visual State**
    - **Validates: Requirements 4.4**

- [x] 4. Refactor CreateTask Component
  - [x] 4.1 Implement enhanced input styling
    - Subtle border với rounded corners (8px)
    - Focus ring với primary color glow
    - Placeholder text với muted color
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 4.2 Implement gradient button styling
    - Primary action button với gradient background
    - Hover và active states
    - _Requirements: 5.5_

- [x] 5. Checkpoint - Core Components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Refactor CalendarView Component
  - [x] 6.1 Apply dark theme styling to react-big-calendar
    - Override calendar CSS với design system colors
    - Style events với primary color background
    - Style time indicator với accent color
    - _Requirements: 6.1, 6.2, 6.4_

  - [x] 6.2 Implement hover states và typography
    - Time slot hover highlight
    - Consistent typography từ design system
    - _Requirements: 6.3, 6.5_

- [-] 7. Refactor CommandBar Component
  - [x] 7.1 Implement glassmorphism dialog styling
    - Backdrop-blur và semi-transparent background
    - Centered modal position
    - _Requirements: 8.1_

  - [x] 7.2 Implement search result styling
    - Highlight matched text với primary color
    - Keyboard shortcut kbd styling
    - Selected item highlight
    - _Requirements: 8.2, 8.4, 8.5_

  - [x] 7.3 Implement NLP date badge
    - Accent color badge cho detected dates
    - Badge animation khi date detected
    - _Requirements: 8.3_

  - [ ] 7.4 Write property test for NLP date detection badge
    - **Property 4: NLP Date Detection Badge**
    - **Validates: Requirements 8.3**

- [x] 8. Refactor DailyPlanningView Component
  - [x] 8.1 Implement two-column glassmorphism layout
    - Grid layout với 2 columns
    - Glassmorphism cards
    - Gradient headers
    - _Requirements: 9.1, 9.2_

  - [x] 8.2 Implement progress indicators và empty states
    - Progress với primary color
    - Encouraging messages khi inbox empty
    - _Requirements: 9.4, 9.5_

- [x] 9. Implement Micro-interactions
  - [x] 9.1 Add transition utilities
    - Define fast/normal/slow durations
    - Ease-out timing function
    - _Requirements: 7.1, 7.2_

  - [x] 9.2 Implement card hover effects
    - Scale effect (1.02) cho interactive cards
    - Smooth shadow transitions
    - _Requirements: 7.3_

  - [x] 9.3 Implement modal animations
    - Fade-in và scale-up animation
    - Exit animation
    - _Requirements: 7.4_

  - [x] 9.4 Implement skeleton loading states
    - Skeleton component với pulse animation
    - Apply to async content areas
    - _Requirements: 7.5_

- [x] 10. Checkpoint - UI Components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement Responsive Behavior
  - [x] 11.1 Define responsive breakpoints
    - sm (640px), md (768px), lg (1024px), xl (1280px)
    - _Requirements: 10.1_

  - [x] 11.2 Implement sidebar responsive collapse
    - Auto-collapse below md breakpoint
    - _Requirements: 10.2_

- [ ] 12. Implement Accessibility Features
  - [x] 12.1 Add focus states to all interactive elements
    - Visible focus ring/outline
    - Consistent focus styling
    - _Requirements: 10.3_

  - [x] 12.2 Ensure keyboard navigation
    - Tab order cho all interactive elements
    - Arrow key navigation where appropriate
    - _Requirements: 10.5_

  - [ ] 12.3 Write property test for focus states
    - **Property 5: Interactive Element Focus States**
    - **Validates: Requirements 10.3**

  - [ ] 12.4 Write property test for keyboard navigation
    - **Property 6: Keyboard Navigation Accessibility**
    - **Validates: Requirements 10.5**

- [x] 13. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.
  - Review visual consistency across all components
  - Verify responsive behavior on different screen sizes

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Use fast-check library for property-based testing
