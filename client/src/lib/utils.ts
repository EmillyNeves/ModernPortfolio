import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Calculate XP percentage for progress bar
export function calculateXpPercentage(current: number, max: number): number {
  if (max <= 0) return 0;
  const percentage = (current / max) * 100;
  return Math.min(Math.max(percentage, 0), 100);
}

// Format attendance status (present, absent, not scheduled)
export function formatAttendanceStatus(status: string | null): {
  text: string;
  className: string;
} {
  switch (status) {
    case "present":
      return {
        text: "Present",
        className: "text-primary",
      };
    case "absent":
      return {
        text: "Absent",
        className: "text-destructive",
      };
    default:
      return {
        text: "--",
        className: "text-muted-foreground",
      };
  }
}

// Add typing animation effect
export function typeWriter(
  element: HTMLElement,
  text: string,
  i: number = 0,
  speed: number = 25
): void {
  if (i < text.length) {
    element.innerHTML += text.charAt(i);
    i++;
    setTimeout(() => typeWriter(element, text, i, speed), speed);
  }
}

// Get color for stats based on value
export function getStatColor(value: number): string {
  if (value >= 80) return "bg-primary";
  if (value >= 60) return "bg-accent";
  if (value >= 40) return "bg-yellow-400";
  return "bg-destructive";
}
