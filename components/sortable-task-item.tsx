"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { TaskItem } from "./task-item";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string;
  dueDate?: string | null;
  startTime?: string | null;
  isRecurring?: boolean;
  recurrence?: string | null;
}

interface SortableTaskItemProps {
  task: Task;
  index: number;
}

export function SortableTaskItem({ task, index }: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ease: "easeOut",
      }}
      layout
      className={cn("relative group/sortable", isDragging && "opacity-50 z-50")}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full",
          "px-1 py-2 cursor-grab active:cursor-grabbing",
          "opacity-0 group-hover/sortable:opacity-100 transition-opacity",
          "text-muted-foreground hover:text-foreground"
        )}
      >
        <GripVertical className="size-4" />
      </div>

      <TaskItem task={task} />
    </motion.div>
  );
}
