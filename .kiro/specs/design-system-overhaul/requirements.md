# Requirements Document

## Introduction

Tài liệu này định nghĩa các yêu cầu cho việc refactor và áp dụng Design System mới cho ứng dụng quản lý thời gian (Akiflow Clone). Mục tiêu là tạo ra giao diện Premium, hiện đại với trải nghiệm người dùng mượt mà, tập trung vào productivity.

## Glossary

- **Design_System**: Hệ thống thiết kế bao gồm typography, color palette, spacing, và components
- **Glassmorphism**: Hiệu ứng kính mờ với backdrop-blur và transparency
- **Sidebar**: Thanh điều hướng bên trái của ứng dụng
- **Task_List**: Danh sách các tác vụ trong Inbox
- **Command_Bar**: Giao diện điều khiển nhanh bằng bàn phím (Ctrl+K)
- **Calendar_View**: Giao diện hiển thị lịch tuần/ngày
- **Rituals_View**: Giao diện Daily Planning và Daily Shutdown
- **Micro_Interaction**: Hiệu ứng hover, focus, và transition nhỏ tạo cảm giác mượt mà

## Requirements

### Requirement 1: Color Palette và Theme System

**User Story:** As a user, I want a consistent dark theme with premium colors, so that the app feels professional and reduces eye strain during long work sessions.

#### Acceptance Criteria

1. THE Design_System SHALL define a primary color using Deep Purple (oklch ~0.65 0.22 290)
2. THE Design_System SHALL define an accent color using Coral/Orange (oklch ~0.7 0.18 40) for highlighting actions
3. THE Design_System SHALL define neutral colors using Slate tones for text and borders
4. WHEN Dark Mode is active, THE Design_System SHALL use Deep Charcoal (#0d0d0f to #1a1a1f) as background
5. THE Design_System SHALL ensure minimum contrast ratio of 4.5:1 for all text elements

### Requirement 2: Typography System

**User Story:** As a user, I want modern, readable typography, so that I can quickly scan and process information.

#### Acceptance Criteria

1. THE Design_System SHALL use Inter or Geist Sans as the primary font family
2. THE Design_System SHALL define font sizes: xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px)
3. THE Design_System SHALL use tight letter-spacing (-0.01em to -0.02em) for headings
4. WHEN displaying task titles, THE Task_List SHALL use font-weight 500 (medium)
5. WHEN displaying secondary text, THE Design_System SHALL use muted-foreground color with font-weight 400

### Requirement 3: Sidebar Component Redesign

**User Story:** As a user, I want a sleek sidebar with glassmorphism effect, so that navigation feels modern and premium.

#### Acceptance Criteria

1. THE Sidebar SHALL display a glassmorphism effect with backdrop-blur-lg and semi-transparent background
2. THE Sidebar SHALL support collapsed mode showing only icons
3. WHEN hovering over a menu item, THE Sidebar SHALL display a subtle highlight animation (150ms ease)
4. THE Sidebar SHALL display the app logo and name in the header section
5. THE Sidebar SHALL display user profile and settings in the footer section
6. WHEN a menu item is active, THE Sidebar SHALL highlight it with primary color background

### Requirement 4: Task List Redesign

**User Story:** As a user, I want a clean, compact task list with clear visual hierarchy, so that I can efficiently manage my tasks.

#### Acceptance Criteria

1. THE Task_List SHALL display tasks in a compact row format with consistent spacing (12px vertical padding)
2. THE Task_List SHALL display a circular checkbox with primary color when checked
3. WHEN hovering over a task, THE Task_List SHALL display a subtle background highlight and border
4. WHEN a task is completed, THE Task_List SHALL apply strikethrough and muted color to the title
5. THE Task_List SHALL display task metadata (due date, priority) with appropriate icons
6. THE Task_List SHALL support smooth transitions (150ms) for all state changes

### Requirement 5: Input và Form Components

**User Story:** As a user, I want elegant input fields that provide clear feedback, so that data entry feels smooth and intuitive.

#### Acceptance Criteria

1. THE Design_System SHALL style input fields with subtle borders and rounded corners (8px radius)
2. WHEN an input receives focus, THE Design_System SHALL display a primary color ring with glow effect
3. THE Design_System SHALL display placeholder text in muted-foreground color
4. WHEN the user types in the task input, THE Design_System SHALL provide immediate visual feedback
5. THE Design_System SHALL style buttons with gradient backgrounds for primary actions

### Requirement 6: Calendar View Enhancement

**User Story:** As a user, I want a visually appealing calendar that integrates with the design system, so that time blocking feels seamless.

#### Acceptance Criteria

1. THE Calendar_View SHALL apply dark theme styling consistent with the Design_System
2. THE Calendar_View SHALL display events with primary color background and rounded corners
3. WHEN hovering over a time slot, THE Calendar_View SHALL display a subtle highlight
4. THE Calendar_View SHALL display the current time indicator with accent color
5. THE Calendar_View SHALL use consistent typography from the Design_System

### Requirement 7: Micro-interactions và Animations

**User Story:** As a user, I want smooth animations and transitions, so that the app feels responsive and polished.

#### Acceptance Criteria

1. THE Design_System SHALL define transition duration: fast (100ms), normal (150ms), slow (300ms)
2. WHEN elements change state, THE Design_System SHALL apply ease-out timing function
3. THE Design_System SHALL implement hover scale effect (1.02) for interactive cards
4. WHEN modals open, THE Design_System SHALL apply fade-in and scale-up animation
5. THE Design_System SHALL implement skeleton loading states for async content

### Requirement 8: Command Bar Enhancement

**User Story:** As a user, I want a powerful command bar with visual polish, so that I can quickly navigate and create tasks.

#### Acceptance Criteria

1. THE Command_Bar SHALL display with glassmorphism effect and centered modal position
2. THE Command_Bar SHALL highlight matched text in search results with primary color
3. WHEN NLP detects a date/time, THE Command_Bar SHALL display it with accent color badge
4. THE Command_Bar SHALL display keyboard shortcuts with subtle kbd styling
5. WHEN navigating results, THE Command_Bar SHALL highlight the selected item with smooth transition

### Requirement 9: Rituals/Planning View Enhancement

**User Story:** As a user, I want an inspiring daily planning interface, so that I feel motivated to organize my day.

#### Acceptance Criteria

1. THE Rituals_View SHALL display two-column layout with glassmorphism cards
2. THE Rituals_View SHALL use gradient headers for visual distinction
3. WHEN scheduling a task for today, THE Rituals_View SHALL animate the task moving to the schedule column
4. THE Rituals_View SHALL display progress indicators with primary color
5. THE Rituals_View SHALL show encouraging messages when inbox is empty

### Requirement 10: Responsive và Accessibility

**User Story:** As a user, I want the app to work well on different screen sizes and be accessible, so that I can use it anywhere.

#### Acceptance Criteria

1. THE Design_System SHALL support responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
2. WHEN screen width is below md, THE Sidebar SHALL collapse to icon-only mode by default
3. THE Design_System SHALL ensure all interactive elements have visible focus states
4. THE Design_System SHALL maintain WCAG 2.1 AA compliance for color contrast
5. THE Design_System SHALL support keyboard navigation for all interactive elements
