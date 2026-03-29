/** Parse swim time strings like "52.34" or "1:12.45" into seconds. */
export function parseTimeToSeconds(time: string): number {
  const t = time.trim()
  if (!t) return 0
  if (t.includes(":")) {
    const parts = t.split(":")
    const last = parseFloat(parts[parts.length - 1]) || 0
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10) || 0
      return mins * 60 + last
    }
    return last
  }
  return parseFloat(t) || 0
}
