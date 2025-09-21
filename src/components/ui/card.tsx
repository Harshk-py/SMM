import * as React from "react";
import { cn } from "@/lib/utils"; // make sure you have this utility

// Main Card
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-white p-4 shadow-md", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

// CardContent subcomponent
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardContent };
