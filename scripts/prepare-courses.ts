import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import type { Course } from "../app/types/course"

const root = resolve(__dirname, "..")
const source = readFileSync(resolve(root, "courses.json"), "utf8")
const records: unknown = JSON.parse(source)
if (!Array.isArray(records)) throw new Error("Expected an array of courses")

const fields = {
  id: "string",
  prefix: "string",
  number: "string",
  title: "string",
  description: "string",
  min_credits: "number",
  max_credits: "number",
  department_code: "string",
  term_code: "string",
  term_name: "string",
  prerequisite: "string",
} satisfies Record<keyof Course, "string" | "number">

const seen = new Set<string>()
const courses = records.map((record: unknown, index): Course => {
  if (!record || typeof record !== "object") throw new Error(`Invalid record ${index}`)
  const values = record as Record<string, unknown>
  for (const [field, type] of Object.entries(fields)) {
    if (typeof values[field] !== type) {
      throw new Error(`Invalid ${field} in record ${index}`)
    }
  }
  const key = `${values.term_code}-${values.id}`
  if (seen.has(key)) throw new Error(`Duplicate course: ${key}`)
  seen.add(key)
  return Object.fromEntries(Object.keys(fields).map((field) => [field, values[field]])) as Course
})

const output = `${JSON.stringify(courses)}\n`
mkdirSync(resolve(root, "app/data"), { recursive: true })
writeFileSync(resolve(root, "app/data/courses.json"), output)
console.log(
  `Prepared ${courses.length} courses: ${(Buffer.byteLength(source) / 1e6).toFixed(1)} MB → ${(Buffer.byteLength(output) / 1e6).toFixed(1)} MB`,
)
