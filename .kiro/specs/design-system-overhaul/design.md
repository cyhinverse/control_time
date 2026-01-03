# Design Document: Design System Overhaul

## Overview

Tài liệu này mô tả thiết kế chi tiết cho việc refactor và áp dụng Design System mới cho ứng dụng Akiflow Clone. Thiết kế tập trung vào việc tạo ra trải nghiệm Premium với Glassmorphism, micro-interactions, và consistent visual language.

## Architecture

### Design Token Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Design Tokens Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Primitive Tokens    │  Semantic Tokens    │  Component     │
│  (colors, spacing)   │  (primary, accent)  │  Tokens        │
├─────────────────────────────────────────────────────────────┤
│                    CSS Variables (:root, .dark)              │
├─────────────────────────────────────────────────────────────┤
│                    Tailwind Theme Extension                  │
├─────────────────────────────────────────────────────────────┤
│                    Component Styles                          │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      RootLayout                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   ThemeProvider                          ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │                SidebarProvider                       │││
│  │  │  ┌───────────┐  ┌─────────────────────────────────┐│││
│  │  │  │ AppSidebar│  │         Main Content            ││││
│  │  │  │           │  │  ┌─────────────────────────────┐││││
│  │  │  │ - Header  │  │  │ Page Components             │││││
│  │  │  │ - Nav     │  │  │ - Inbox (TaskList)          │││││
│  │  │  │ - Footer  │  │  │ - Calendar (CalendarView)   │││││
│  │  │  │           │  │  │ - Rituals (PlanningView)    │││││
│  │  │  └───────────┘  │  └─────────────────────────────┘││││
│  │  │                 └─────────────────────────────────┘│││
│  │  │  ┌─────────────────────────────────────────────────┐│││
│  │  │  │              CommandBar (Modal)                 ││││
│  │  │  └─────────────────────────────────────────────────┘│││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Design Tokens (globals.css)

```css
/* Color Tokens */
:root {
  /* Primitive Colors */
  --purple-50: oklch(0.97 0.02 290);
  --purple-500: oklch(0.65 0.22 290);
  --purple-600: oklch(0.55 0.25 300);
  --coral-400: oklch(0.75 0.16 40);
  --coral-500: oklch(0.7 0.18 40);
  
  /* Semantic Colors */
  --primary: var(--purple-500);
  --accent: var(--coral-500);
  
  /* Spacing Scale */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  
  /* Animation Tokens */
  --duration-fast: 100ms;
  --duration-normal: 150ms;
  --duration-slow: 300ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 2. AppSidebar Component Interface

```typescript
interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
  isActive?: boolean;
}

// Component structure
const AppSidebar: React.FC<SidebarProps> = ({ collapsed, onCollapsedChange }) => {
  return (
    <Sidebar className="glass-sidebar">
      <SidebarHeader>
        <Logo />
        <AppName />
      </SidebarHeader>
      <SidebarContent>
        <NavMenu items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
        <SettingsButton />
      </SidebarFooter>
    </Sidebar>
  );
};
```

### 3. TaskItem Component Interface

```typescript
interface Task {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: Date;
  startTime?: Date;
}

interface TaskItemProps {
  task: Task;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  onEdit?: (taskId: string) => void;
}

// Visual states
type TaskItemState = 'default' | 'hover' | 'focused' | 'completed' | 'dragging';
```

### 4. CreateTask Component Interface

```typescript
interface CreateTaskProps {
  onTaskCreated?: (task: Task) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

// Input states with visual feedback
type InputState = 'idle' | 'focused' | 'typing' | 'submitting' | 'success';
```

### 5. CommandBar Component Interface

```typescript
interface CommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedInput {
  text: string;
  detectedDate?: Date;
  detectedPriority?: string;
}

// Visual elements
interface CommandItemProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  shortcut?: string;
  badge?: { text: string; variant: 'primary' | 'accent' };
}
```

## Data Models

### Design Token Types

```typescript
// Color tokens
type ColorToken = {
  light: string;  // oklch value
  dark: string;   // oklch value
};

// Spacing tokens
type SpacingToken = '1' | '2' | '3' | '4' | '6' | '8' | '12' | '16';

// Animation tokens
type DurationToken = 'fast' | 'normal' | 'slow';
type EasingToken = 'ease-out' | 'ease-in-out' | 'spring';

// Component variant types
type ButtonVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive';
type InputVariant = 'default' | 'filled' | 'ghost';
```

### Theme Configuration

```typescript
interface ThemeConfig {
  colors: {
    primary: ColorToken;
    accent: ColorToken;
    background: ColorToken;
    foreground: ColorToken;
    muted: ColorToken;
    border: ColorToken;
  };
  typography: {
    fontFamily: {
      sans: string;
      mono: string;
    };
    fontSize: Record<string, [string, { lineHeight: string; letterSpacing?: string }]>;
  };
  spacing: Record<SpacingToken, string>;
  borderRadius: Record<string, string>;
  animation: {
    duration: Record<DurationToken, string>;
    easing: Record<EasingToken, string>;
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Color Contrast Compliance

*For any* text element and its background color combination in the Design System, the computed contrast ratio SHALL be at least 4.5:1 to meet WCAG 2.1 AA standards.

**Validates: Requirements 1.5, 10.4**

### Property 2: Task List Spacing Consistency

*For any* task list containing multiple tasks, all task items SHALL have identical vertical padding (12px) to maintain visual consistency.

**Validates: Requirements 4.1**

### Property 3: Completed Task Visual State

*For any* task with status "DONE", the task title SHALL have text-decoration: line-through AND color set to muted-foreground.

**Validates: Requirements 4.4**

### Property 4: NLP Date Detection Badge

*For any* text input in the Command Bar where chrono-node detects a valid date/time, the parsed date SHALL be displayed in a badge with accent color styling.

**Validates: Requirements 8.3**

### Property 5: Interactive Element Focus States

*For any* interactive element (button, input, checkbox, link, menu item), there SHALL exist a visible focus state with outline or ring styling when the element receives keyboard focus.

**Validates: Requirements 10.3**

### Property 6: Keyboard Navigation Accessibility

*For any* interactive element in the application, it SHALL be reachable and activatable using only keyboard navigation (Tab, Enter, Space, Arrow keys as appropriate).

**Validates: Requirements 10.5**

## Error Handling

### Theme Loading Errors

```typescript
// Fallback to system preference if theme fails to load
const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    } catch {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  });
  // ...
};
```

### Component Render Errors

```typescript
// Error boundary for graceful degradation
class DesignSystemErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <div className="fallback-ui">Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

### CSS Variable Fallbacks

```css
/* Always provide fallback values */
.element {
  color: var(--foreground, #ffffff);
  background: var(--background, #0d0d0f);
}
```

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

1. **Color Token Tests**: Verify each color token has correct oklch value
2. **Typography Tests**: Verify font sizes and weights are correctly applied
3. **Component Render Tests**: Verify components render with correct classes
4. **Theme Toggle Tests**: Verify theme switching works correctly
5. **Responsive Tests**: Verify breakpoint behavior

### Property-Based Tests

Property-based tests will use **fast-check** library to verify universal properties:

1. **Contrast Ratio Property Test**: Generate random color combinations and verify contrast
2. **Task List Spacing Test**: Generate random task lists and verify consistent spacing
3. **Completed Task Styling Test**: Generate tasks with various statuses and verify styling
4. **Focus State Test**: Generate interactive elements and verify focus states exist
5. **Keyboard Navigation Test**: Generate UI trees and verify keyboard accessibility

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: design-system-overhaul, Property {number}: {property_text}**

### Integration Tests

1. **Full Page Render**: Verify pages render with design system applied
2. **Theme Persistence**: Verify theme preference persists across sessions
3. **Responsive Layout**: Verify layout adapts to different screen sizes

### Visual Regression Tests

1. **Component Screenshots**: Capture and compare component appearances
2. **Theme Comparison**: Verify light/dark theme consistency
3. **Animation Timing**: Verify transitions complete within expected duration

