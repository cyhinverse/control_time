import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { taskIds } = await request.json();

    if (!Array.isArray(taskIds)) {
      return NextResponse.json(
        { error: "Invalid taskIds array" },
        { status: 400 }
      );
    }

    // Update order for each task
    const updates = taskIds.map((id: string, index: number) =>
      prisma.task.update({
        where: {
          id,
          userId: session.user!.id, // Ensure user owns the task
        },
        data: {
          order: index,
        },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder tasks:", error);
    return NextResponse.json(
      { error: "Failed to reorder tasks" },
      { status: 500 }
    );
  }
}
