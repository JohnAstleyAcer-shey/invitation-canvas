import { motion } from "framer-motion";
import { AlertTriangle, Clock, CalendarX, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { differenceInDays, differenceInHours, isPast, format } from "date-fns";

interface InvitationExpiryBadgeProps {
  eventDate?: string | null;
  expiresAt?: string | null;
  compact?: boolean;
}

export function InvitationExpiryBadge({ eventDate, expiresAt, compact = false }: InvitationExpiryBadgeProps) {
  const now = new Date();
  const expiry = expiresAt ? new Date(expiresAt) : null;
  const event = eventDate ? new Date(eventDate) : null;

  // Check explicit expiry first, then event date
  const relevantDate = expiry || event;
  if (!relevantDate) return null;

  const isExpired = isPast(relevantDate);
  const daysLeft = differenceInDays(relevantDate, now);
  const hoursLeft = differenceInHours(relevantDate, now);

  if (isExpired) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20 gap-1">
            <CalendarX className="h-3 w-3" />
            {compact ? "Expired" : "Event Passed"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {expiry ? `Expired on ${format(relevantDate, "MMM d, yyyy")}` : `Event was on ${format(relevantDate, "MMM d, yyyy")}`}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (daysLeft <= 1) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20 gap-1">
              <AlertTriangle className="h-3 w-3" />
              {hoursLeft <= 0 ? "Expiring!" : `${hoursLeft}h left`}
            </Badge>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          {expiry ? "Invitation expires" : "Event"} {format(relevantDate, "MMM d, yyyy 'at' h:mm a")}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (daysLeft <= 7) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 gap-1">
            <Clock className="h-3 w-3" />
            {daysLeft}d left
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {expiry ? "Expires" : "Event"} on {format(relevantDate, "MMM d, yyyy")}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (daysLeft <= 30) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 gap-1">
            <Clock className="h-3 w-3" />
            {daysLeft}d
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {expiry ? "Expires" : "Event"} on {format(relevantDate, "MMM d, yyyy")}
        </TooltipContent>
      </Tooltip>
    );
  }

  return null;
}
