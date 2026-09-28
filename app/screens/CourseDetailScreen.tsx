import { FC } from "react"
import { StyleSheet } from "react-native"

import { PrerequisiteTree } from "@/components/PrerequisiteTree"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { getCourse } from "@/services/courses"

type Props = AppStackScreenProps<"CourseDetail">

export const CourseDetailScreen: FC<Props> = ({ route, navigation }) => {
  const { courseId, termCode } = route.params
  const course = getCourse(courseId, termCode)

  if (!course) {
    return (
      <Screen preset="scroll" safeAreaEdges={["bottom"]} contentContainerStyle={styles.content}>
        <Text preset="heading" text="Course not found" />
        <Text text="This course is not available in the selected semester." />
      </Screen>
    )
  }

  const credits =
    course.min_credits === course.max_credits
      ? `${course.min_credits}`
      : `${course.min_credits}–${course.max_credits}`

  return (
    <Screen preset="scroll" safeAreaEdges={["bottom"]} contentContainerStyle={styles.content}>
      <Text preset="heading" text={`${course.prefix} ${course.number}`} />
      <Text preset="subheading" text={course.title} />
      <Text text={`${credits} credits · ${course.term_name}`} />
      <Text preset="subheading" text="Description" />
      <Text text={course.description} />
      <Text preset="subheading" text="Prerequisites" />
      <Text text={course.prerequisite.trim() || "No prerequisites listed."} />
      <PrerequisiteTree
        key={`${course.term_code}-${course.id}`}
        course={course}
        onOpenCourse={(prerequisite) =>
          navigation.push("CourseDetail", {
            courseId: prerequisite.id,
            termCode: prerequisite.term_code,
          })
        }
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { gap: 12, padding: 20 },
})
