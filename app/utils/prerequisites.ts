/** Extract explicit course references, without interpreting AND/OR or eligibility rules. */
export function extractPrerequisiteCodes(text: string): string[] {
  const codes = Array.from(
    text.toUpperCase().matchAll(/\b([A-Z]{4})\s*(\d{4}[A-Z]*)\b/g),
    (match) => `${match[1]} ${match[2]}`,
  )
  return Array.from(new Set(codes))
}

export function normalizeCourseCode(code: string): string {
  return code.replace(/\s+/g, "").toUpperCase()
}

export function isPrerequisiteCycle(code: string, path: readonly string[]): boolean {
  return path.some((ancestor) => normalizeCourseCode(ancestor) === normalizeCourseCode(code))
}
