import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ labelId: string }> }
) {
  const session = await auth();
  const { labelId } = await params;

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const json = await req.json();
    const label = await prisma.label.update({
      where: {
        id: labelId,
        userId: session.user.id,
      },
      data: json,
    });
    return NextResponse.json(label);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ labelId: string }> }
) {
  const session = await auth();
  const { labelId } = await params;

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await prisma.label.delete({
      where: {
        id: labelId,
        userId: session.user.id,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
