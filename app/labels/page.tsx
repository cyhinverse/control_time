import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LabelsView } from "@/components/labels-view";
import { Tags } from "lucide-react";

export default async function LabelsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const labels = await prisma.label.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="flex size-10 items-center justify-center rounded-lg bg-pink-500/10">
          <Tags className="size-5 text-pink-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Labels</h1>
          <p className="text-sm text-muted-foreground">
            Organize your tasks with labels
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <LabelsView labels={labels} />
      </div>
    </div>
  );
}
