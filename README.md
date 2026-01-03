# Control Time ⚡

A modern, feature-rich productivity and task management application built with Next.js 16, inspired by tools like Akiflow and Todoist.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)

## ✨ Features

### 📋 Task Management

- **Inbox** - Central hub for all your tasks with smart grouping by date
- **Create Tasks** - Natural language date parsing (e.g., "Meeting tomorrow at 9am")
- **Priority Levels** - High, Medium, Low with color-coded indicators
- **Drag & Drop** - Reorder tasks with smooth animations
- **Task Details** - Rich task editing with description, scheduling, and more

### 📅 Calendar

- **Multiple Views** - Day, Week, and Month views
- **Time Grid** - Visual time blocking with hourly slots
- **Current Time Indicator** - Red line showing current time
- **Event Display** - Color-coded by priority

### 🔄 Recurring Tasks

- **Flexible Recurrence** - Daily, Weekly, Monthly, Yearly options
- **Smart Generation** - Automatically creates instances within view range
- **Visual Indicator** - Repeat icon on recurring events

### ⏱️ Focus Timer (Pomodoro)

- **Customizable Timer** - Focus sessions with break intervals
- **Visual Progress** - Circular progress indicator
- **Session Tracking** - Track completed focus sessions

### 🏷️ Labels

- **Custom Labels** - Create colored labels for organization
- **Task Tagging** - Assign multiple labels to tasks
- **Label Management** - Full CRUD operations

### 📊 Statistics

- **Task Analytics** - Track completion rates and productivity
- **Visual Charts** - Progress visualization

### 🌅 Daily Rituals

- **Morning Planning** - Review inbox and schedule your day
- **Quick Scheduling** - One-click "Schedule for Today"

### ⚙️ Settings

- **Theme** - Light, Dark, and System themes
- **Sound Effects** - Completion sounds toggle
- **Compact Mode** - Reduced spacing option
- **Time Format** - 12-hour or 24-hour
- **Week Start** - Sunday or Monday
- **Data Management** - Export, Import, Reset options

### 🎨 UI/UX

- **Modern Design** - Clean, minimalist interface
- **Smooth Animations** - Framer Motion powered transitions
- **Keyboard Shortcuts** - Command palette (⌘K) for quick actions
- **Responsive** - Works on desktop and mobile
- **Collapsible Sidebar** - Icon-only mode for more space

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **cmdk** - Command palette
- **date-fns** - Date manipulation
- **chrono-node** - Natural language date parsing
- **@dnd-kit** - Drag and drop functionality

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database
- **NextAuth.js v5** - Authentication (Google OAuth)

## 📁 Project Structure

```
Control_Time/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── labels/        # Label CRUD
│   │   └── tasks/         # Task CRUD & reorder
│   ├── calendar/          # Calendar page
│   ├── focus/             # Focus timer page
│   ├── labels/            # Labels management
│   ├── profile/           # User profile
│   ├── rituals/           # Daily planning
│   ├── settings/          # App settings
│   ├── stats/             # Statistics
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Inbox (home)
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── app-sidebar.tsx   # Navigation sidebar
│   ├── calendar-view.tsx # Calendar component
│   ├── create-task.tsx   # Task creation form
│   ├── daily-task-list.tsx
│   ├── focus-timer.tsx
│   ├── task-item.tsx
│   └── ...
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── settings.ts       # Settings management
│   └── utils.ts          # Helper functions
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials (for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/control-time.git
   cd control-time
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   DATABASE_URL="postgresql://..."
   AUTH_SECRET="your-auth-secret"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   AUTH_TRUST_HOST=true
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🗄️ Database Schema

### Core Models

- **User** - User accounts with OAuth support
- **Task** - Tasks with priority, scheduling, recurrence
- **Label** - Custom labels for organization
- **TimeSlot** - Time blocking slots (for future features)

## 🎯 Keyboard Shortcuts

| Shortcut        | Action               |
| --------------- | -------------------- |
| `⌘K` / `Ctrl+K` | Open command palette |
| `⌘B` / `Ctrl+B` | Toggle sidebar       |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js and modern web technologies.
