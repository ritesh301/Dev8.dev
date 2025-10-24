import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type Conn = { provider: string; connected: boolean };

export async function GET() {
  // Derive connections for the signed-in user from the Accounts table
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ connections: [], updatedAt: new Date().toISOString() });
  }

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    select: { provider: true },
  });

  const connected = new Set(accounts.map((a) => a.provider.toLowerCase()));
  const providers: Conn[] = [
    { provider: "Google", connected: connected.has("google") },
    { provider: "GitHub", connected: connected.has("github") },
  ];

  return NextResponse.json({ connections: providers, updatedAt: new Date().toISOString() });
}
