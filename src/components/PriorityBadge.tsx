import React from "react";
import { Badge } from "./ui/Badge";
import { ArrowDown, ArrowUp, Flame } from "lucide-react";

export function PriorityBadge({
  priority,
  className,
}: {
  priority: string;
  className?: string;
}) {
  switch (priority) {
    case "HIGH":
      return (
        <Badge variant="high" className={className}>
          <Flame className="w-3 h-3 text-red-600" />
          High
        </Badge>
      );
    case "MEDIUM":
      return (
        <Badge variant="medium" className={className}>
          <ArrowUp className="w-3 h-3 text-amber-600" />
          Medium
        </Badge>
      );
    case "LOW":
    default:
      return (
        <Badge variant="low" className={className}>
          <ArrowDown className="w-3 h-3 text-stone-500" />
          Low
        </Badge>
      );
  }
}
