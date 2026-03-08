import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAdmin } from "../hooks/useCustomerAdmin";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerMessagesPage() {
  const { session } = useCustomerAdmin();
  const invId = session!.invitation.id;

  const { data: rsvps } = useQuery({
    queryKey: ["cp-messages", invId],
    queryFn: async () => {
      const { data } = await supabase
        .from("rsvps")
        .select("*, guests(full_name)")
        .eq("invitation_id", invId)
        .not("message", "is", null)
        .order("responded_at", { ascending: false });
      return data?.filter(r => r.message?.trim()) ?? [];
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Guest Messages</h2>

      {rsvps?.length ? (
        <div className="space-y-3">
          {rsvps.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground text-sm">{(r.guests as any)?.full_name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    r.status === "attending" ? "bg-green-100 text-green-700" :
                    r.status === "not_attending" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {r.status === "attending" ? "Attending" : r.status === "not_attending" ? "Not Attending" : "Maybe"}
                  </span>
                  {r.responded_at && (
                    <span className="text-xs text-muted-foreground">{format(new Date(r.responded_at), "MMM d")}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.message}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm">No messages from guests yet.</p>
        </div>
      )}
    </div>
  );
}
