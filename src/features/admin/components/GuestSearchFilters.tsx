import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Mail, Phone, UserCheck, UserX, HelpCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RSVP_STATUS_LABELS, type RsvpStatus } from "../types";

interface GuestSearchFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: RsvpStatus | "all";
  onStatusChange: (v: RsvpStatus | "all") => void;
  hasEmailFilter: boolean | null;
  onHasEmailChange: (v: boolean | null) => void;
  hasPhoneFilter: boolean | null;
  onHasPhoneChange: (v: boolean | null) => void;
  totalCount: number;
  filteredCount: number;
}

const statusChips: { value: RsvpStatus | "all"; label: string; icon: React.ElementType; activeColor: string }[] = [
  { value: "all", label: "All", icon: Filter, activeColor: "bg-primary text-primary-foreground" },
  { value: "attending", label: "Attending", icon: UserCheck, activeColor: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30" },
  { value: "not_attending", label: "Declined", icon: UserX, activeColor: "bg-destructive/20 text-destructive border-destructive/30" },
  { value: "maybe", label: "Maybe", icon: HelpCircle, activeColor: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30" },
  { value: "pending", label: "Pending", icon: Clock, activeColor: "bg-muted text-foreground border-border" },
];

export function GuestSearchFilters({
  search, onSearchChange, statusFilter, onStatusChange,
  hasEmailFilter, onHasEmailChange, hasPhoneFilter, onHasPhoneChange,
  totalCount, filteredCount,
}: GuestSearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeFilters = (hasEmailFilter !== null ? 1 : 0) + (hasPhoneFilter !== null ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const clearAll = () => {
    onSearchChange("");
    onStatusChange("all");
    onHasEmailChange(null);
    onHasPhoneChange(null);
  };

  return (
    <div className="space-y-3">
      {/* Search + filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 rounded-xl bg-muted/50 border-transparent focus:border-border focus:bg-background"
          />
          {search && (
            <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          size="icon"
          className="h-10 w-10 rounded-xl shrink-0 relative"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter className="h-4 w-4" />
          {activeFilters > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
              {activeFilters}
            </div>
          )}
        </Button>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {statusChips.map(chip => (
          <Button
            key={chip.value}
            variant="outline"
            size="sm"
            className={`h-7 text-[11px] rounded-full gap-1 transition-all ${statusFilter === chip.value ? chip.activeColor : ""}`}
            onClick={() => onStatusChange(chip.value)}
          >
            <chip.icon className="h-3 w-3" />
            {chip.label}
          </Button>
        ))}
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 pt-1"
          >
            <Button
              variant="outline"
              size="sm"
              className={`h-7 text-[11px] rounded-full gap-1 ${hasEmailFilter === true ? "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30" : hasEmailFilter === false ? "bg-destructive/10 text-destructive" : ""}`}
              onClick={() => onHasEmailChange(hasEmailFilter === true ? null : hasEmailFilter === false ? true : true)}
            >
              <Mail className="h-3 w-3" />
              {hasEmailFilter === true ? "Has email" : hasEmailFilter === false ? "No email" : "Email filter"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-7 text-[11px] rounded-full gap-1 ${hasPhoneFilter === true ? "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30" : hasPhoneFilter === false ? "bg-destructive/10 text-destructive" : ""}`}
              onClick={() => onHasPhoneChange(hasPhoneFilter === true ? null : hasPhoneFilter === false ? true : true)}
            >
              <Phone className="h-3 w-3" />
              {hasPhoneFilter === true ? "Has phone" : hasPhoneFilter === false ? "No phone" : "Phone filter"}
            </Button>

            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-[11px] rounded-full text-muted-foreground" onClick={clearAll}>
                <X className="h-3 w-3 mr-1" /> Clear all
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filteredCount} of {totalCount} guests
        {activeFilters > 0 && <span className="ml-1">({activeFilters} filter{activeFilters > 1 ? "s" : ""} active)</span>}
      </p>
    </div>
  );
}
