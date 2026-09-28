import preparedCourses from "@/data/courses.json"
import type { Course } from "@/types/course"
import { normalizeCourseCode } from "@/utils/prerequisites"

export const DEFAULT_TERM_CODE = "2610"

const courses: Course[] = preparedCourses
const coursesByTerm = new Map<string, Course[]>()
const coursesByIdAndTerm = new Map<string, Course>()
const coursesByCodeAndTerm = new Map<string, Course>()
const termNames = new Map<string, string>()
const departmentsByTerm = new Map<string, Set<string>>()

// Build indexes once when this module loads, rather than on each screen render.
for (const course of courses) {
  const termCourses = coursesByTerm.get(course.term_code) ?? []
  termCourses.push(course)
  coursesByTerm.set(course.term_code, termCourses)
  coursesByIdAndTerm.set(`${course.term_code}-${course.id}`, course)
  coursesByCodeAndTerm.set(
    `${course.term_code}-${normalizeCourseCode(course.prefix + course.number)}`,
    course,
  )
  termNames.set(course.term_code, course.term_name)
  const departments = departmentsByTerm.get(course.term_code) ?? new Set<string>()
  departments.add(course.department_code)
  departmentsByTerm.set(course.term_code, departments)
}

for (const termCourses of coursesByTerm.values()) {
  termCourses.sort((a, b) => `${a.prefix} ${a.number}`.localeCompare(`${b.prefix} ${b.number}`))
}

const semesters = Array.from(termNames, ([code, name]) => ({ code, name })).sort((a, b) =>
  b.code.localeCompare(a.code),
)
const departments = Array.from(new Set(courses.map((course) => course.department_code))).sort()
const emptyCourses: Course[] = []

export function getCoursesForSemester(termCode: string): readonly Course[] {
  return coursesByTerm.get(termCode) ?? emptyCourses
}

export function getCourse(courseId: string, termCode: string): Course | undefined {
  return coursesByIdAndTerm.get(`${termCode}-${courseId}`)
}

export function getSemesters(): ReadonlyArray<{ code: string; name: string }> {
  return semesters
}

export function getDepartments(termCode?: string): readonly string[] {
  return termCode === undefined
    ? departments
    : Array.from(departmentsByTerm.get(termCode) ?? []).sort()
}

/** Resolve within the selected semester; never silently substitute another semester. */
export function getCourseByCode(code: string, termCode: string): Course | undefined {
  return coursesByCodeAndTerm.get(`${termCode}-${normalizeCourseCode(code)}`)
}
