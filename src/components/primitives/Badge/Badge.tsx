// Badge visual para tipos, origen y estados compactos.
import type { ReactNode } from "react";
import { cx } from "@/utils/cx";
import styles from "./Badge.module.css";

export type BadgeTone = "primary" | "secondary" | "accent" | "success" | "danger" | "muted";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ children, tone = "muted", className }: BadgeProps) {
  return <span className={cx(styles.badge, styles[tone], className)}>{children}</span>;
}
