import { FC, useEffect, useMemo, useRef, useState } from "react"
import { FlatList, Keyboard, Modal, Pressable, StyleSheet, View } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import {
  DEFAULT_TERM_CODE,
  getCoursesForSemester,
  getDepartments,
  getSemesters,
} from "@/services/courses"
import type { Course } from "@/types/course"

type Props = AppStackScreenProps<"CourseList">

export const CourseListScreen: FC<Props> = ({ navigation }) => {
  const [selectedTerm, setSelectedTerm] = useState(DEFAULT_TERM_CODE)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [isDepartmentPickerOpen, setIsDepartmentPickerOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const listRef = useRef<FlatList<Course>>(null)
  const departments = useMemo(() => getDepartments(selectedTerm), [selectedTerm])
  const courses = useMemo(() => {
    const semesterCourses = getCoursesForSemester(selectedTerm)
    const query = searchText.trim().toLowerCase().replace(/\s+/g, " ")
    const codeQuery = query.replace(/\s/g, "")
    return semesterCourses.filter((course) => {
      const matchesDepartment =
        selectedDepartment === null || course.department_code === selectedDepartment
      const matchesSearch =
        query === "" ||
        `${course.prefix}${course.number}`.toLowerCase().includes(codeQuery) ||
        course.title.toLowerCase().replace(/\s+/g, " ").includes(query)
      return matchesDepartment && matchesSearch
    })
  }, [selectedTerm, selectedDepartment, searchText])

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false })
  }, [selectedTerm, selectedDepartment, searchText])

  function selectDepartment(department: string | null) {
    setSelectedDepartment(department)
    setIsDepartmentPickerOpen(false)
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text preset="heading" text="Course List" />
        <Text text="Semester" />
        <View style={styles.semesters}>
          {getSemesters().map((semester) => (
            <Button
              key={semester.code}
              text={semester.name}
              preset={selectedTerm === semester.code ? "reversed" : "default"}
              accessibilityState={{ selected: selectedTerm === semester.code }}
              onPress={() => {
                if (semester.code !== selectedTerm) {
                  setSelectedTerm(semester.code)
                  setSelectedDepartment(null)
                }
              }}
            />
          ))}
        </View>
        <Text text="Department" />
        <Button
          text={selectedDepartment ?? "All departments"}
          accessibilityLabel={`Choose department: ${selectedDepartment ?? "All departments"}`}
          accessibilityState={{ expanded: isDepartmentPickerOpen }}
          onPress={() => {
            Keyboard.dismiss()
            setIsDepartmentPickerOpen(true)
          }}
        />
        <View style={styles.searchRow}>
          <TextField
            accessibilityLabel="Search courses by code or title"
            placeholder="Search by code or title"
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
            containerStyle={styles.searchField}
          />
          {searchText.length > 0 && (
            <Button
              text="Clear"
              accessibilityLabel="Clear course search"
              onPress={() => setSearchText("")}
            />
          )}
        </View>
        <Text text={`${courses.length} courses`} />
      </View>
      <FlatList
        ref={listRef}
        key={`${selectedTerm}-${selectedDepartment ?? "all"}`}
        data={courses}
        keyExtractor={(course) => `${course.term_code}-${course.id}`}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <Text text="No courses match your search and filters. Try another search or department." />
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View details for ${item.prefix} ${item.number}: ${item.title}`}
            onPress={() =>
              navigation.navigate("CourseDetail", {
                courseId: item.id,
                termCode: item.term_code,
              })
            }
            style={({ pressed }) => [styles.course, pressed && styles.pressed]}
          >
            <Text preset="subheading" text={`${item.prefix} ${item.number}`} />
            <Text text={item.title} />
            <Text
              text={`${item.min_credits === item.max_credits ? item.min_credits : `${item.min_credits}–${item.max_credits}`} credits · ${item.term_name}`}
            />
          </Pressable>
        )}
      />
      <Modal
        visible={isDepartmentPickerOpen}
        animationType="slide"
        onRequestClose={() => setIsDepartmentPickerOpen(false)}
      >
        <Screen
          preset="fixed"
          safeAreaEdges={["top", "bottom"]}
          contentContainerStyle={styles.screen}
        >
          <View style={styles.header}>
            <Text preset="heading" text="Choose department" />
            <Button text="Cancel" onPress={() => setIsDepartmentPickerOpen(false)} />
          </View>
          <FlatList
            data={departments}
            extraData={selectedDepartment}
            keyExtractor={(department) => department}
            contentContainerStyle={styles.departmentList}
            ListHeaderComponent={
              <Button
                text="All departments"
                preset={selectedDepartment === null ? "reversed" : "default"}
                accessibilityState={{ selected: selectedDepartment === null }}
                onPress={() => selectDepartment(null)}
              />
            }
            renderItem={({ item }) => (
              <Button
                text={item}
                preset={selectedDepartment === item ? "reversed" : "default"}
                accessibilityState={{ selected: selectedDepartment === item }}
                onPress={() => selectDepartment(item)}
              />
            )}
          />
        </Screen>
      </Modal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  course: { gap: 4, paddingVertical: 16 },
  departmentList: { gap: 8, padding: 20 },
  header: { gap: 8, padding: 20 },
  list: { padding: 20 },
  pressed: { opacity: 0.6 },
  screen: { flex: 1 },
  searchField: { flex: 1 },
  searchRow: { alignItems: "center", flexDirection: "row", gap: 8 },
  semesters: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
})
