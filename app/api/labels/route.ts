import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const labels = await prisma.label.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(labels);
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
    const { name, color } = await req.json();
    const label = await prisma.label.create({
      data: {
        name,
        color: color || "#6b7280",
        userId: session.user.id,
      },
    });
    return NextResponse.json(label);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
