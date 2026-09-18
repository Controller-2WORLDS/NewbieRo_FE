import { twMerge } from "tailwind-merge"

/** Joins class name fragments and resolves conflicting Tailwind utilities (later wins). */
export function cn(...classes: Array<string | undefined | false | null>): string {
    return twMerge(classes.filter(Boolean).join(" "))
}
