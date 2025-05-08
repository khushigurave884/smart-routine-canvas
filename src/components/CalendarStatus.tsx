
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarStatusProps {
  synced: boolean;
  syncing: boolean;
  onSync: () => void;
  content: any;
}

const CalendarStatus: React.FC<CalendarStatusProps> = ({
  synced,
  syncing,
  onSync,
  content,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "flex items-center gap-2",
        synced && "bg-green-50 text-green-600 border-green-200",
        syncing && "animate-pulse"
      )}
      onClick={onSync}
      disabled={synced || syncing}
    >
      {synced ? (
        <>
          <Check className="h-4 w-4" />
          <span>{content.synced}</span>
        </>
      ) : (
        <>
          <Calendar className="h-4 w-4" />
          <span>{syncing ? "Syncing..." : content.syncWithCalendar}</span>
        </>
      )}
    </Button>
  );
};

export default CalendarStatus;
