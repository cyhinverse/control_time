import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        status: {
          not: "DONE", // Default view: hide done tasks
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const json = await req.json();

    // Parse the date/time from request
    const startTime = json.startTime ? new Date(json.startTime) : null;

    // If startTime is set, also set dueDate to the same day
    const dueDate = startTime ? new Date(startTime) : null;
    if (dueDate) {
      dueDate.setHours(23, 59, 59, 999); // End of day
    }

    const task = await prisma.task.create({
      data: {
        title: json.title,
        description: json.description || null,
        userId: session.user.id,
        startTime: startTime,
        dueDate: dueDate,
        priority: json.priority || "MEDIUM",
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Failed to create task:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
