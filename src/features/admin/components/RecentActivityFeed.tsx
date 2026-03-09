import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Eye, Send, UserPlus, Edit, Trash2, Globe, Clock } from "lucide-react";

const actionIcons: Record<string, { icon: React.ElementType; color: string }> = {
  "invitation.created": { icon: Edit, color: "text-blue-500" },
  "invitation.published": { icon: Globe, color: "text-green-500" },
  "invitation.unpublished": { icon: Eye, color: "text-amber-500" },
  "invitation.updated": { icon: Edit, color: "text-muted-foreground" },
  "invitation.deleted": { icon: Trash2, color: "text-destructive" },
  "guest.added": { icon: UserPlus, color: "text-indigo-500" },
  "rsvp.received": { icon: Send, color: "text-primary" },
};

function getActionDisplay(action: string) {
  return actionIcons[action] || { icon: Clock, color: "text-muted-foreground" };
}

export function RecentActivityFeed() {
  const { data: logs } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data || [];
    },
  });

  if (!logs?.length) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
        <p className="text-xs text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {logs.map((log, i) => {
        const { icon: Icon, color } = getActionDisplay(log.action);
        const details = log.details as Record<string, any> | null;
        return (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/30 transition-colors"
          >
            <div className={`mt-0.5 ${color}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {log.action.replace(/\./g, " → ").replace(/^./, s => s.toUpperCase())}
              </p>
              {details?.title && (
                <p className="text-[10px] text-muted-foreground truncate">{details.title}</p>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">
              {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
