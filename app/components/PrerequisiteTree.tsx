import { useState } from "react"
import { StyleSheet, View } from "react-native"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { getCourseByCode } from "@/services/courses"
import type { Course } from "@/types/course"
import { extractPrerequisiteCodes, isPrerequisiteCycle } from "@/utils/prerequisites"

interface Props {
  course: Course
  onOpenCourse: (course: Course) => void
}

export function PrerequisiteTree({ course, onOpenCourse }: Props) {
  const codes = extractPrerequisiteCodes(course.prerequisite)
  if (codes.length === 0) {
    return course.prerequisite.trim() ? (
      <Text text="No explicit course codes found. See the prerequisite conditions above." />
    ) : null
  }

  return (
    <View style={styles.group}>
      <Text text="Referenced courses may be alternatives. Read the original conditions above; this list does not mean every course is required." />
      {codes.map((code) => (
        <PrerequisiteNode
          key={code}
          code={code}
          termCode={course.term_code}
          path={[`${course.prefix} ${course.number}`]}
          onOpenCourse={onOpenCourse}
        />
      ))}
    </View>
  )
}

interface NodeProps {
  code: string
  termCode: string
  path: readonly string[]
  onOpenCourse: Props["onOpenCourse"]
}

function PrerequisiteNode({ code, termCode, path, onOpenCourse }: NodeProps) {
  const [expanded, setExpanded] = useState(false)
  const course = getCourseByCode(code, termCode)
  const cycle = isPrerequisiteCycle(code, path)
  const children = course ? extractPrerequisiteCodes(course.prerequisite) : []

  return (
    <View style={styles.node}>
      {course ? (
        <Button
          text={`${code} — ${course.title}`}
          accessibilityLabel={`Open ${code}: ${course.title}`}
          onPress={() => onOpenCourse(course)}
        />
      ) : (
        <Text text={`${code} — Not available in this semester's dataset.`} />
      )}
      {cycle ? (
        <Text text="Already in this prerequisite path. Expansion stops here to avoid a cycle." />
      ) : course ? (
        <>
          <Text text={course.prerequisite.trim() || "No prerequisites listed."} />
          {children.length > 0 ? (
            <>
              <Button
                text={expanded ? "Hide prerequisites" : "Show prerequisites"}
                accessibilityLabel={`${expanded ? "Hide" : "Show"} prerequisites for ${code}`}
                accessibilityState={{ expanded }}
                onPress={() => setExpanded(!expanded)}
              />
              {expanded && (
                <View style={styles.group}>
                  {children.map((child) => (
                    <PrerequisiteNode
                      key={child}
                      code={child}
                      termCode={termCode}
                      path={[...path, code]}
                      onOpenCourse={onOpenCourse}
                    />
                  ))}
                </View>
              )}
            </>
          ) : course.prerequisite.trim() ? (
            <Text text="No explicit course codes found in these conditions." />
          ) : null}
        </>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  group: { gap: 12 },
  node: { borderLeftWidth: 1, gap: 8, paddingLeft: 8, paddingVertical: 8 },
})
