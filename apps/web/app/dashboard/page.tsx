"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Code,
  GitBranch,
  Terminal,
  Zap,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
    }
  }, [session, status, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-lg text-muted-foreground">Loading your workspace...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const recentProjects = [
    {
      name: "my-next-app",
      language: "TypeScript",
      lastModified: "2 hours ago",
      status: "active",
    },
    {
      name: "api-backend",
      language: "Node.js",
      lastModified: "5 hours ago",
      status: "idle",
    },
    {
      name: "portfolio-site",
      language: "React",
      lastModified: "1 day ago",
      status: "deployed",
    },
  ];

  const stats = [
    {
      title: "Total Projects",
      value: "12",
      icon: Code,
      trend: "+2 this week",
      color: "primary",
    },
    {
      title: "Active Sessions",
      value: "3",
      icon: Activity,
      trend: "2 running now",
      color: "accent",
    },
    {
      title: "Deployments",
      value: "24",
      icon: Zap,
      trend: "+6 this month",
      color: "secondary",
    },
    {
      title: "Build Time",
      value: "2.3s",
      icon: Clock,
      trend: "25% faster",
      color: "primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10 grid-background opacity-20" />
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <Sidebar />

      <main className="ml-64 min-h-screen transition-all duration-300">
        <div className="container mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Welcome back, {session.user?.name || "Developer"}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Here&apos;s what&apos;s happening with your projects today
              </p>
            </div>
            <Button
              onClick={() => router.push("/editor")}
              className="bg-gradient-to-r from-primary to-secondary hover:glow-primary"
            >
              <Code className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="border-border bg-card/50 backdrop-blur hover:glow-primary hover-lift transition-all duration-300"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-border bg-card/50 backdrop-blur mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Recent Projects</CardTitle>
                  <CardDescription>Your most recently active projects</CardDescription>
                </div>
                <Button variant="outline" className="hover:glow-secondary">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all cursor-pointer hover-lift"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Code className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.language}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{project.lastModified}</p>
                      </div>
                      <Badge
                        variant={
                          project.status === "active"
                            ? "default"
                            : project.status === "deployed"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          project.status === "active"
                            ? "bg-accent/20 text-accent border-accent/50"
                            : ""
                        }
                      >
                        {project.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Terminal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border bg-card/50 backdrop-blur hover:glow-primary hover-lift cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
                  <GitBranch className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Clone Repository</CardTitle>
                <CardDescription>Import a project from GitHub, GitLab, or Bitbucket</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur hover:glow-secondary hover-lift cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 mb-2">
                  <Terminal className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>New Terminal</CardTitle>
                <CardDescription>Open a new terminal session in the cloud</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur hover:glow-accent hover-lift cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-2">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Deploy Project</CardTitle>
                <CardDescription>Deploy your application with one click</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
