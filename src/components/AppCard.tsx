"use client";

import { type ReactNode } from "react";

interface AppCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AppCard({ children, className = "", style }: AppCardProps) {
  return (
    <div className={`card card-app ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
