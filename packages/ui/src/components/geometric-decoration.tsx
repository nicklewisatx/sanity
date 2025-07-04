import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

interface GeometricDecorationProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "circles" | "triangles" | "mixed";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  colors?: string[];
}

export const GeometricDecoration = React.forwardRef<HTMLDivElement, GeometricDecorationProps>(
  ({ className, variant = "mixed", position = "top-right", colors, ...props }, ref) => {
    // Default modern art colors if none provided
    const defaultColors = [
      "hsl(var(--primary))",
      "hsl(var(--secondary))",
      "hsl(var(--accent))",
    ];
    
    const usedColors = colors || defaultColors;
    
    const positionClasses = {
      "top-left": "top-0 left-0",
      "top-right": "top-0 right-0",
      "bottom-left": "bottom-0 left-0",
      "bottom-right": "bottom-0 right-0",
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "absolute pointer-events-none",
          positionClasses[position],
          className
        )}
        {...props}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="opacity-10"
        >
          {variant === "circles" && (
            <>
              <circle cx="50" cy="50" r="40" fill={usedColors[0]} />
              <circle cx="120" cy="80" r="30" fill={usedColors[1]} />
              <circle cx="80" cy="120" r="25" fill={usedColors[2]} />
            </>
          )}
          {variant === "triangles" && (
            <>
              <polygon points="50,20 90,80 10,80" fill={usedColors[0]} />
              <polygon points="120,40 160,100 80,100" fill={usedColors[1]} />
              <polygon points="70,100 110,160 30,160" fill={usedColors[2]} />
            </>
          )}
          {variant === "mixed" && (
            <>
              <circle cx="60" cy="60" r="35" fill={usedColors[0]} />
              <rect x="100" y="40" width="60" height="60" fill={usedColors[1]} transform="rotate(45 130 70)" />
              <polygon points="50,120 90,180 10,180" fill={usedColors[2]} />
            </>
          )}
        </svg>
      </div>
    );
  }
);

GeometricDecoration.displayName = "GeometricDecoration";