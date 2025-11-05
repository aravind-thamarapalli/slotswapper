import { format } from 'date-fns'

export function formatDateTime(date) {
  return format(date, "EEE, MMM d, yyyy 'at' h:mm a")
}

export function formatDate(date) {
  return format(date, 'EEE, MMM d, yyyy')
}

export function formatTime(date) {
  return format(date, 'h:mm a')
}
