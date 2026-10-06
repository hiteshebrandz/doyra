"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Download, Upload, LogOut, Trash2 } from "lucide-react";
import { MobileHeader } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ResponsiveDialog } from "@/components/ui/Sheet";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/app-store";
import type { ExportPayload, WeekStart } from "@/lib/types";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const exportJson = useAppStore((s) => s.exportJson);
  const importJson = useAppStore((s) => s.importJson);
  const deleteMyData = useAppStore((s) => s.deleteMyData);
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(settings.displayName);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(settings.displayName || user?.displayName || "");
  }, [settings.displayName, user?.displayName]);

  const saveName = () => {
    updateSettings({ displayName: name.trim() });
    toast({ title: "Profile updated" });
  };

  const onExport = () => {
    const payload = exportJson();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `doyra-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Backup downloaded" });
  };

  const onImportFile = async (file: File) => {
    setBusy(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text) as ExportPayload;
      if (!data || data.version !== 1) {
        throw new Error("Invalid backup file");
      }
      await importJson(data);
      if (data.settings.theme) setTheme(data.settings.theme);
      setName(data.settings.displayName ?? "");
      toast({ title: "Backup restored" });
    } catch (e) {
      toast({
        title: "Import failed",
        description: e instanceof Error ? e.message : "Invalid file",
      });
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    setBusy(true);
    try {
      await deleteMyData();
      await signOut();
    } catch (e) {
      toast({
        title: "Could not delete data",
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setBusy(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div>
      <MobileHeader title="Settings" />

      <div className="mb-6 hidden md:block">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--muted)]">
          Profile, preferences, and backups.
        </p>
      </div>

      <div className="space-y-4 max-w-xl">
        <GlassCard>
          <h2 className="mb-3 font-semibold">Profile</h2>
          <Label htmlFor="display-name">Display name</Label>
          <Input
            id="display-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              if (name !== settings.displayName) saveName();
            }}
          />
          <p className="mt-2 text-sm text-[var(--muted)]">{user?.email}</p>
          <Button className="mt-3" onClick={saveName}>
            Save name
          </Button>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 font-semibold">Appearance</h2>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-[var(--muted)]">
                Light, dark, or system
              </p>
            </div>
            <ThemeToggle />
          </div>
          <div className="mt-4">
            <Label htmlFor="week-start">Week starts on</Label>
            <select
              id="week-start"
              className="w-full min-h-11 rounded-2xl border border-[var(--glass-border)] bg-white/70 dark:bg-white/5 px-3 focus-ring"
              value={settings.weekStart}
              onChange={(e) => {
                const weekStart = Number(e.target.value) as WeekStart;
                updateSettings({ weekStart });
                toast({ title: "Week start updated" });
              }}
            >
              <option value={1}>Monday</option>
              <option value={0}>Sunday</option>
            </select>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-1 font-semibold">Backup</h2>
          <p className="mb-3 text-sm text-[var(--muted)]">
            Export or import your data as JSON. This is your backup mechanism.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onExport}>
              <Download className="h-4 w-4" /> Export JSON
            </Button>
            <Button
              variant="secondary"
              loading={busy}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Import JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onImportFile(file);
                e.target.value = "";
              }}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 font-semibold">Account</h2>
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => void signOut()}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
          <Button
            variant="danger"
            className="mt-2 w-full justify-start"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4" /> Delete my data
          </Button>
        </GlassCard>
      </div>

      <ResponsiveDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete all data?"
      >
        <p className="text-sm text-[var(--muted)]">
          This permanently deletes your Doyra tasks, habits, and logs from
          Firestore, then signs you out. Export a backup first if you might
          need it.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            loading={busy}
            onClick={() => void onDelete()}
          >
            Delete everything
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
