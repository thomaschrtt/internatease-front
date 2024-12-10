import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | null) {
  if (!date) return ""
  const actual_month = date.getMonth() + 1
  const actual_day = date.getDate()
  const month = actual_month > 9 ? actual_month : "0".concat(actual_month.toString())
  const day = actual_day > 9 ? actual_day : "0".concat(actual_day.toString())
  return date.getFullYear() + "-" + month + "-" + day
}
