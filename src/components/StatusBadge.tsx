import React from "react";
import { Badge } from "./ui/Badge";
import { Clock, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

export function StatusBadge({
  status,
  isOverdue = false,
  className,
}: {
  status: string;
  isOverdue?: boolean;
  className?: string;
}) {
  if (isOverdue && status !== "RESOLVED") {
    return (
      <Badge variant="overdue" className={className}>
        <AlertTriangle className="w-3 h-3 text-red-600 animate-bounce" />
        OVERDUE
      </Badge>
    );
  }

  switch (status) {
    case "OPEN":
      return (
        <Badge variant="open" className={className}>
          <AlertCircle className="w-3 h-3 text-amber-700" />
          Open
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge variant="in_progress" className={className}>
          <Clock className="w-3 h-3 text-indigo-700" />
          In Progress
        </Badge>
      );
    case "RESOLVED":
      return (
        <Badge variant="resolved" className={className}>
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          Resolved
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" className={className}>
          {status}
        </Badge>
      );
  }
}
