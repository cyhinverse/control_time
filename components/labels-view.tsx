"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Check, X, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Label {
  id: string;
  name: string;
  color: string;
  _count: {
    tasks: number;
  };
}

interface LabelsViewProps {
  labels: Label[];
}

const COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
];

export function LabelsView({ labels: initialLabels }: LabelsViewProps) {
  const router = useRouter();
  const [labels, setLabels] = useState(initialLabels);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function createLabel() {
    if (!newName.trim()) return;

    setIsPending(true);
    try {
      const res = await fetch("/api/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, color: newColor }),
      });
      if (res.ok) {
        setNewName("");
        setNewColor(COLORS[0]);
        setIsCreating(false);
        router.refresh();
      }
    } finally {
      setIsPending(false);
    }
  }

  async function updateLabel(id: string) {
    if (!editName.trim()) return;

    setIsPending(true);
    try {
      await fetch(`/api/labels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, color: editColor }),
      });
      setEditingId(null);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  async function deleteLabel(id: string) {
    if (!confirm("Delete this label? Tasks won't be deleted.")) return;

    setIsPending(true);
    try {
      await fetch(`/api/labels/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  function startEdit(label: Label) {
    setEditingId(label.id);
    setEditName(label.name);
    setEditColor(label.color);
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Create Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="size-4 mr-1.5" />
          New Label
        </Button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Label name..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") createLabel();
                  if (e.key === "Escape") setIsCreating(false);
                }}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Color:</span>
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewColor(color)}
                    className={cn(
                      "size-6 rounded-full transition-transform",
                      newColor === color &&
                        "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={createLabel} disabled={isPending}>
                  Create
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Labels List */}
      <div className="space-y-2">
        {labels.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-muted/50 mb-4">
              <Tags className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No labels yet</h3>
            <p className="text-sm text-muted-foreground">
              Create labels to organize your tasks
            </p>
          </div>
        ) : (
          labels.map((label, index) => (
            <motion.div
              key={label.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              {editingId === label.id ? (
                <>
                  <div className="flex items-center gap-2 flex-1">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={cn(
                          "size-5 rounded-full transition-transform",
                          editColor === color &&
                            "ring-2 ring-offset-1 ring-offset-background ring-primary"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8 ml-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateLabel(label.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => updateLabel(label.id)}
                    className="p-1.5 rounded hover:bg-green-500/10 text-green-600"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                  >
                    <X className="size-4" />
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="size-4 rounded-full shrink-0"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="flex-1 font-medium">{label.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {label._count.tasks} tasks
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(label)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button
                      onClick={() => deleteLabel(label.id)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
