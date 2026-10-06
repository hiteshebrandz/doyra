"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

const WeeklyBarInner = dynamic(
  () => import("@/components/dashboard/WeeklyBarInner"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-48 w-full" />,
  },
);

export function WeeklyBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return <WeeklyBarInner data={data} />;
}
