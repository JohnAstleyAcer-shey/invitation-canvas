import { useParams, Link } from "react-router-dom";
import { useInvitation } from "@/features/admin/hooks/useInvitations";
import { BlockEditor } from "../components/BlockEditor";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/SEOHead";

function EditorSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-7 rounded" />
          <div className="space-y-1">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-2.5 w-20" />
          </div>
          <Skeleton className="h-5 w-px mx-1" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-6 rounded" />
          ))}
        </div>
      </div>
      {/* Body skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 border-r border-border p-3 space-y-3">
          <Skeleton className="h-8 w-full rounded-lg" />
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-12 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Skeleton className="h-16 w-full rounded-lg" />
              </motion.div>
            ))}
          </div>
        </div>
        {/* Canvas */}
        <div className="flex-1 p-6 flex justify-center">
          <div className="w-[375px] space-y-3">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <Skeleton className="h-[80px] w-full rounded-xl" />
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <Skeleton className="h-[60px] w-full rounded-xl" />
            <Skeleton className="h-[100px] w-full rounded-xl" />
          </div>
        </div>
      </div>
      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-border bg-muted/30">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

export default function BlockEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: invitation, isLoading } = useInvitation(id!);

  if (isLoading) {
    return (
      <>
        <SEOHead title="Loading Editor..." />
        <EditorSkeleton />
      </>
    );
  }

  if (!invitation) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-destructive/10 to-muted mx-auto flex items-center justify-center"
          >
            <Layers className="h-9 w-9 text-muted-foreground/40" />
          </motion.div>
          <div>
            <p className="text-lg font-display font-semibold text-foreground">Invitation not found</p>
            <p className="text-sm text-muted-foreground mt-1">It may have been deleted or you don't have access.</p>
          </div>
          <Button variant="outline" className="rounded-full" asChild>
            <Link to="/admin"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title={`Edit: ${invitation.title}`} />
      <BlockEditor invitationId={invitation.id} invitationTitle={invitation.title} invitationSlug={invitation.slug} />
    </>
  );
}
