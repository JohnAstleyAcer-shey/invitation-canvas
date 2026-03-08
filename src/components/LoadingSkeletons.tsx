import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function SkeletonPulse({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Skeleton className={className} />
    </motion.div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonPulse className="h-7 w-32" delay={0} />
          <SkeletonPulse className="h-4 w-48" delay={0.05} />
        </div>
        <SkeletonPulse className="h-10 w-36 rounded-full" delay={0.1} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => <SkeletonPulse key={i} className="h-24 rounded-2xl" delay={i * 0.06} />)}
      </div>
      <div className="flex gap-3">
        <SkeletonPulse className="h-10 flex-1 rounded-xl" delay={0.3} />
        <SkeletonPulse className="h-10 w-40 rounded-xl" delay={0.35} />
        <SkeletonPulse className="h-10 w-36 rounded-xl" delay={0.4} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map(i => <SkeletonPulse key={i} className="h-52 rounded-2xl" delay={0.45 + i * 0.05} />)}
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SkeletonPulse className="h-8 w-40" />
        <SkeletonPulse className="h-4 w-64" delay={0.05} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[0, 1, 2, 3, 4].map(i => <SkeletonPulse key={i} className="h-24 rounded-2xl" delay={i * 0.06} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <SkeletonPulse className="h-64 rounded-2xl" delay={0.35} />
        <SkeletonPulse className="h-64 rounded-2xl" delay={0.4} />
      </div>
      <SkeletonPulse className="h-72 rounded-2xl" delay={0.5} />
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <SkeletonPulse className="h-64 rounded-2xl" delay={0.55} />
        <SkeletonPulse className="h-64 rounded-2xl" delay={0.6} />
      </div>
    </div>
  );
}

export function GuestManagementSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-9 w-9 rounded-xl" />
        <div className="space-y-2 flex-1">
          <SkeletonPulse className="h-6 w-48" delay={0.05} />
          <SkeletonPulse className="h-3 w-32" delay={0.1} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map(i => <SkeletonPulse key={i} className="h-20 rounded-xl" delay={0.1 + i * 0.05} />)}
      </div>
      <div className="flex gap-3">
        <SkeletonPulse className="h-10 flex-1 rounded-xl" delay={0.35} />
        <SkeletonPulse className="h-10 w-36 rounded-xl" delay={0.4} />
        <SkeletonPulse className="h-10 w-32 rounded-full" delay={0.45} />
      </div>
      <SkeletonPulse className="h-80 rounded-xl" delay={0.5} />
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <SkeletonPulse className="h-8 w-32" />
        <SkeletonPulse className="h-4 w-56" delay={0.05} />
      </div>
      {[0, 1, 2, 3].map(i => (
        <SkeletonPulse key={i} className="h-48 rounded-2xl" delay={0.1 + i * 0.08} />
      ))}
    </div>
  );
}

export function TemplatesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SkeletonPulse className="h-8 w-36" />
        <SkeletonPulse className="h-4 w-72" delay={0.05} />
      </div>
      <div className="flex gap-3">
        <SkeletonPulse className="h-10 flex-1 rounded-xl" delay={0.1} />
        <SkeletonPulse className="h-10 w-80 rounded-xl" delay={0.15} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <SkeletonPulse key={i} className="h-56 rounded-2xl" delay={0.2 + i * 0.04} />)}
      </div>
    </div>
  );
}

export function ActivityLogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonPulse className="h-8 w-40" />
          <SkeletonPulse className="h-4 w-48" delay={0.05} />
        </div>
        <SkeletonPulse className="h-8 w-24 rounded-full" delay={0.1} />
      </div>
      <SkeletonPulse className="h-10 w-64 rounded-xl" delay={0.15} />
      <div className="space-y-3">
        {[0, 1, 2, 3, 4, 5].map(i => <SkeletonPulse key={i} className="h-20 rounded-xl" delay={0.2 + i * 0.04} />)}
      </div>
    </div>
  );
}

export function HelpSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <SkeletonPulse className="h-8 w-48" />
        <SkeletonPulse className="h-4 w-72" delay={0.05} />
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {[0, 1, 2].map(i => <SkeletonPulse key={i} className="h-32 rounded-2xl" delay={0.1 + i * 0.06} />)}
      </div>
      <SkeletonPulse className="h-28 rounded-2xl" delay={0.3} />
      <SkeletonPulse className="h-10 rounded-xl" delay={0.35} />
      <SkeletonPulse className="h-96 rounded-2xl" delay={0.4} />
    </div>
  );
}

export function EditInvitationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="h-9 w-9 rounded-xl" />
          <div className="space-y-2">
            <SkeletonPulse className="h-6 w-48" delay={0.05} />
            <SkeletonPulse className="h-3 w-32" delay={0.1} />
          </div>
        </div>
        <SkeletonPulse className="h-8 w-32 rounded-full" delay={0.15} />
      </div>
      <SkeletonPulse className="h-10 w-full rounded-xl" delay={0.2} />
      <SkeletonPulse className="h-48 rounded-xl" delay={0.25} />
      <div className="grid sm:grid-cols-2 gap-4">
        {[0, 1, 2, 3, 4, 5].map(i => <SkeletonPulse key={i} className="h-16 rounded-xl" delay={0.3 + i * 0.04} />)}
      </div>
    </div>
  );
}

export function BlockEditorSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden">
      <SkeletonPulse className="h-10 w-full border-b" />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 border-r p-3 space-y-3">
          <SkeletonPulse className="h-8 w-full rounded-lg" delay={0.1} />
          <SkeletonPulse className="h-6 w-full rounded-lg" delay={0.15} />
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <SkeletonPulse key={i} className="h-16 rounded-lg" delay={0.2 + i * 0.03} />)}
          </div>
        </div>
        <div className="flex-1 p-4 flex items-start justify-center">
          <div className="w-[375px] space-y-2">
            {[0, 1, 2, 3].map(i => <SkeletonPulse key={i} className="h-32 rounded-xl" delay={0.25 + i * 0.05} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="border-b border-border p-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => <SkeletonPulse key={i} className="h-4 flex-1" delay={i * 0.03} />)}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-border last:border-0 p-3 flex gap-4">
          {Array.from({ length: cols }).map((_, j) => <SkeletonPulse key={j} className="h-4 flex-1" delay={0.1 + (i * cols + j) * 0.02} />)}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <SkeletonPulse className="h-32 rounded-xl" />
      <SkeletonPulse className="h-4 w-3/4" delay={0.1} />
      <SkeletonPulse className="h-3 w-1/2" delay={0.15} />
    </div>
  );
}

export function InvitationViewSkeleton() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-6 bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative"
      >
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2 text-center"
      >
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </motion.div>
    </div>
  );
}
