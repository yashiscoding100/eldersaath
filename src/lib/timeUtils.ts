
import { format, parse } from "date-fns"

export function convertTo12Hour(time24: string): string {
  if (!time24) return ""
  try {
    const parsed = parse(time24, "HH:mm", new Date())
    return format(parsed, "hh:mm a")
  } catch (e) {
    return time24
  }
}

export function convertTo24Hour(time12: string): string {
  if (!time12) return ""
  try {
    const parsed = parse(time12, "hh:mm a", new Date())
    return format(parsed, "HH:mm")
  } catch (e) {
    return time12
  }
}
