"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { SortableTaskItem } from "./sortable-task-item";
import { TaskItem } from "./task-item";
import {
  Inbox as InboxIcon,
  Sun,
  Sunrise,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string;
  dueDate?: string | null;
  startTime?: string | null;
  order?: number;
  isRecurring?: boolean;
  recurrence?: string | null;
}

interface DailyTaskListProps {
  tasks: Task[];
}

interface TaskGroup {
  label: string;
  icon: React.ReactNode;
  tasks: Task[];
  color: string;
}

export function DailyTaskList({ tasks: initialTasks }: DailyTaskListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();

  // Sync tasks when initialTasks changes
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group tasks by date
  const taskGroups = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const groups: TaskGroup[] = [
      {
        label: "Today",
        icon: <Sun className="size-4" />,
        tasks: [],
        color: "text-yellow-500",
      },
      {
        label: "Tomorrow",
        icon: <Sunrise className="size-4" />,
        tasks: [],
        color: "text-orange-500",
      },
      {
        label: "This Week",
        icon: <Calendar className="size-4" />,
        tasks: [],
        color: "text-blue-500",
      },
      {
        label: "Later",
        icon: <Calendar className="size-4" />,
        tasks: [],
        color: "text-purple-500",
      },
      {
        label: "No Date",
        icon: <InboxIcon className="size-4" />,
        tasks: [],
        color: "text-muted-foreground",
      },
    ];

    tasks.forEach((task) => {
      const taskDate = task.startTime
        ? new Date(task.startTime)
        : task.dueDate
        ? new Date(task.dueDate)
        : null;

      if (!taskDate) {
        groups[4].tasks.push(task); // No Date
      } else {
        taskDate.setHours(0, 0, 0, 0);

        if (taskDate.getTime() === today.getTime()) {
          groups[0].tasks.push(task); // Today
        } else if (taskDate.getTime() === tomorrow.getTime()) {
          groups[1].tasks.push(task); // Tomorrow
        } else if (taskDate < nextWeek && taskDate > today) {
          groups[2].tasks.push(task); // This Week
        } else if (taskDate >= nextWeek) {
          groups[3].tasks.push(task); // Later
        } else {
          // Past dates - show in Today as overdue
          groups[0].tasks.push(task);
        }
      }
    });

    return groups.filter((g) => g.tasks.length > 0);
  }, [tasks]);

  const activeTask = tasks.find((task) => task.id === activeId);

  function toggleGroup(label: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  async function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);

      // Update order in database
      try {
        await fetch("/api/tasks/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskIds: newTasks.map((t) => t.id),
          }),
        });
      } catch (error) {
        console.error("Failed to reorder tasks:", error);
        setTasks(initialTasks);
      }
    }
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center size-16 rounded-2xl bg-muted/50 mb-4"
        >
          <InboxIcon className="size-8 text-muted-foreground" />
        </motion.div>
        <h3 className="text-lg font-medium mb-1">All clear!</h3>
        <p className="text-sm text-muted-foreground">
          Create a task to get started
        </p>
      </motion.div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {taskGroups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.label);

          return (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 0 : 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="size-4 text-muted-foreground" />
                </motion.div>
                <span className={cn("size-4", group.color)}>{group.icon}</span>
                <span className="text-sm font-medium">{group.label}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {group.tasks.length}
                </span>
              </button>

              {/* Group Tasks */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-6"
                  >
                    <SortableContext
                      items={group.tasks.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1">
                        <AnimatePresence mode="popLayout">
                          {group.tasks.map((task, index) => (
                            <SortableTaskItem
                              key={task.id}
                              task={task}
                              index={index}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </SortableContext>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 shadow-lg rounded-lg">
            <TaskItem task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
