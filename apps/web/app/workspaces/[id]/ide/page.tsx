"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Square, RotateCw } from "lucide-react";

type Details = {
  id: string;
  name: string;
  provider: string;
  size: string;
  region: string;
  status: "running" | "stopped";
  assistant: { tips: string[]; note: string };
  updatedAt: number;
};
type Metrics = {
  cpu: number;
  memory: { usedGb: number; totalGb: number };
  disk: { usedGb: number; totalGb: number };
  network: { inMb: number; outMb: number };
  updatedAt: number;
};

export default function WorkspaceIDEPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [details, setDetails] = useState<Details | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [terminal, setTerminal] = useState<string[]>([]);
  const [snapshots, setSnapshots] = useState<Array<{ id: string; createdAt: number; location: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<"start" | "stop" | "restart" | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/signin");
  }, [status, session, router]);

  async function loadAll(signal?: AbortSignal) {
    try {
      const [d, m, t, s] = await Promise.all([
        fetch(`/api/workspaces/${id}/details`, { cache: "no-store", signal }).then((r) => r.json()),
        fetch(`/api/workspaces/${id}/metrics`, { cache: "no-store", signal }).then((r) => r.json()),
        fetch(`/api/workspaces/${id}/terminal`, { cache: "no-store", signal }).then((r) => r.json()),
        fetch(`/api/workspaces/${id}/snapshots`, { cache: "no-store", signal }).then((r) => r.json()),
      ]);
      setDetails(d);
      setMetrics(m);
      setTerminal(t.lines);
      setSnapshots(s.snapshots);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id || status !== "authenticated") return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setInterval> | undefined;
    loadAll(controller.signal);
    timer = setInterval(() => loadAll(controller.signal), 5000);
    return () => {
      controller.abort();
      if (timer) clearInterval(timer);
    };
  }, [id, status]);

  async function doAction(action: "start" | "stop" | "restart") {
    setActing(action);
    try {
      await fetch(`/api/workspaces/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await loadAll();
    } finally {
      setActing(null);
    }
  }

  async function createSnapshot() {
    await fetch(`/api/workspaces/${id}/snapshots`, { method: "POST" });
    const s = await fetch(`/api/workspaces/${id}/snapshots`, { cache: "no-store" }).then((r) => r.json());
    setSnapshots(s.snapshots);
  }

  if (status === "loading" || loading || !details || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Opening workspace IDE...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10 grid-background opacity-20" />
      <Sidebar />

      <main className="ml-64 min-h-screen transition-all duration-300">
        <div className="container mx-auto px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Workspace: <span className="text-foreground font-medium">{details.name}</span> ({details.provider.toUpperCase()} {details.size} • {details.region})
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => doAction("restart")} disabled={!!acting}><RotateCw className="h-4 w-4 mr-1"/> Restart</Button>
              {details.status === "running" ? (
                <Button variant="destructive" onClick={() => doAction("stop")} disabled={!!acting}><Square className="h-4 w-4 mr-1"/> Stop</Button>
              ) : (
                <Button onClick={() => doAction("start")} disabled={!!acting}><Play className="h-4 w-4 mr-1"/> Start</Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* VS Code Editor placeholder */}
            <Card className="xl:col-span-2 border-border bg-card/50">
              <div className="p-4 md:p-6 h-80 md:h-[420px] rounded-md border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">
                VS Code Editor (Web)
              </div>
            </Card>

            {/* System Metrics + Snapshots */}
            <div className="space-y-6">
              <Card className="border-border bg-card/50">
                <div className="p-4 md:p-6 space-y-1">
                  <div className="text-sm font-medium">System Metrics</div>
                  <div className="text-xs text-muted-foreground">CPU: {metrics.cpu}%</div>
                  <div className="text-xs text-muted-foreground">Memory: {metrics.memory.usedGb}GB / {metrics.memory.totalGb}GB</div>
                  <div className="text-xs text-muted-foreground">Disk: {metrics.disk.usedGb}GB / {metrics.disk.totalGb}GB</div>
                  <div className="text-xs text-muted-foreground">Network: {metrics.network.inMb}MB/s | {metrics.network.outMb}MB/s</div>
                </div>
              </Card>

              <Card className="border-border bg-card/50">
                <div className="p-4 md:p-6 space-y-3">
                  <div className="text-sm font-medium">Snapshots & Backups</div>
                  <div className="text-xs text-muted-foreground">Last snapshot: {snapshots[0] ? new Date(snapshots[0].createdAt).toLocaleTimeString() : "—"}</div>
                  <div className="text-xs text-muted-foreground">Next auto-backup: 3 hrs</div>
                  <Button variant="outline" onClick={createSnapshot}>Create Snapshot</Button>
                </div>
              </Card>

              <Card className="border-border bg-card/50">
                <div className="p-4 md:p-6 space-y-2">
                  <div className="text-sm font-medium">AI Assistant</div>
                  <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                    {details.assistant.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                  <div className="text-[11px] text-muted-foreground/80">💡 {details.assistant.note}</div>
                </div>
              </Card>
            </div>
          </div>

          {/* Terminal */}
          <div className="mt-6">
            <Card className="border-border bg-card/50">
              <div className="p-4">
                <div className="text-sm font-medium mb-2">Terminal</div>
                <div className="h-48 overflow-auto rounded-md bg-slate-900/80 text-slate-100 text-xs p-3 font-mono">
                  {terminal.map((l, i) => (
                    <div key={i}>{l}</div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
