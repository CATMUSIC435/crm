import * as React from "react"
import { cn } from "@/lib/utils"

export interface TimelineItemProps {
  title: string
  description?: string
  time?: string
  status?: "completed" | "current" | "pending"
  icon?: React.ReactNode
}

export function Timeline({ items }: { items: TimelineItemProps[] }) {
  return (
    <div className="relative border-l border-muted-foreground/20 ml-4 space-y-8 py-2">
      {items.map((item, index) => {
        const isCompleted = item.status === "completed"
        const isCurrent = item.status === "current"
        
        return (
          <div key={index} className="relative pl-8 md:pl-10">
            {/* Icon / Bullet */}
            <div 
              className={cn(
                "absolute -left-[17px] top-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background overflow-hidden",
                isCompleted ? "border-primary text-primary" : 
                isCurrent ? "border-blue-500 text-blue-500 ring-4 ring-blue-500/20" : 
                "border-muted text-muted-foreground"
              )}
            >
              {item.icon ? (
                <div className="flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4">{item.icon}</div>
              ) : (
                <div className={cn("h-2 w-2 rounded-full", isCompleted ? "bg-primary" : isCurrent ? "bg-blue-500" : "bg-muted")} />
              )}
            </div>
            
            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pt-1">
              <h3 className={cn("font-semibold text-base", !isCompleted && !isCurrent && "text-muted-foreground")}>
                {item.title}
              </h3>
              {item.time && (
                <time className="text-xs font-medium text-muted-foreground sm:ml-4 whitespace-nowrap">
                  {item.time}
                </time>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1.5">
                {item.description}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
