import { NextResponse } from "next/server";

type WS = { id: number; name: string; status: "running" | "stopped" };

let workspaces: WS[] = [
  { id: 1, name: "Workspace #1 - AWS EC2 XL", status: "running" },
  { id: 2, name: "Workspace #2 - GCP VM", status: "stopped" },
  { id: 3, name: "Workspace #3 - Azure VM", status: "running" },
];

export async function GET() {
  // add tiny random toggles to look alive
  if (Math.random() < 0.1) {
    const i = Math.floor(Math.random() * workspaces.length);
    const w = workspaces[i];
    if (w) workspaces[i] = { ...w, status: w.status === "running" ? "stopped" : "running" };
  }
  return NextResponse.json({ workspaces, updatedAt: new Date().toISOString() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { id, action } = body;
  if (action === "toggle") {
    workspaces = workspaces.map((w) => (w.id === Number(id) ? { ...w, status: w.status === "running" ? "stopped" : "running" } : w));
  } else if (action === "clone") {
    const src = workspaces.find((w) => w.id === Number(id));
    if (src) {
      const maxId = workspaces.reduce((m, w) => Math.max(m, w.id), 0);
      workspaces.push({ id: maxId + 1, name: src.name + " (Clone)", status: "stopped" });
    }
  } else if (action === "delete") {
    workspaces = workspaces.filter((w) => w.id !== Number(id));
  } else if (action === "create") {
    // Create a new workspace from provided payload
    const maxId = workspaces.reduce((m, w) => Math.max(m, w.id), 0);
    const name: string = body?.name || `Workspace #${maxId + 1}`;
    const provider: string = body?.provider ?? "multi";
    const image: string = body?.image ?? "docker";
    const size: string = body?.size ?? "small";
    const created: WS = { id: maxId + 1, name: `${name} - ${provider.toUpperCase()} (${image}/${size})`, status: "running" };
    workspaces = [...workspaces, created];
  }
  return NextResponse.json({ ok: true, workspaces });
}
