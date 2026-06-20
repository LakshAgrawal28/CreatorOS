import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "glass" | "bordered";
}

export function Card({ children, variant = "default", className = "", ...props }: CardProps) {
  let baseClass = "rounded-xl transition-all duration-300 "; // --radius-xl = 20px

  if (variant === "glass") {
    baseClass += "glass-panel ";
  } else if (variant === "bordered") {
    baseClass += "bg-surface-container-lowest border border-surface-variant ";
  } else {
    // default premium card shadow & borders
    baseClass += "bg-surface-container-lowest border border-surface-variant/70 shadow-sm shadow-black/5 hover:shadow-md hover:shadow-black/5 ";
  }

  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
