import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  let baseClass =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none active:scale-[0.98] hover:scale-[1.01] "; // --radius-lg = 12px for buttons

  // Size styling
  if (size === "sm") {
    baseClass += "px-4 py-2 text-[12px] h-9 ";
  } else if (size === "lg") {
    baseClass += "px-7 py-3.5 text-[15px] h-12 ";
  } else {
    baseClass += "px-5 py-2.5 text-[14px] h-10 ";
  }

  // Variant styling
  if (variant === "secondary") {
    // Accent Orange (secondary-container)
    baseClass += "bg-secondary-container text-white hover:bg-secondary-container/90 shadow-md shadow-secondary-container/10 ";
  } else if (variant === "outline") {
    baseClass += "bg-transparent border border-surface-variant text-primary hover:bg-surface-container-low ";
  } else if (variant === "ghost") {
    baseClass += "bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-primary ";
  } else if (variant === "glass") {
    baseClass += "glass-panel text-primary hover:bg-white/90 ";
  } else {
    // Primary - Solid Black
    baseClass += "bg-primary text-on-primary hover:bg-primary/90 shadow-md shadow-primary/5 ";
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
