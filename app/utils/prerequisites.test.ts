import { extractPrerequisiteCodes, isPrerequisiteCycle } from "./prerequisites"

describe("prerequisite references", () => {
  it("extracts alternatives, suffixes, and codes without spaces, deduplicating repeats", () => {
    expect(extractPrerequisiteCodes("(comp1021 OR COMP 1022P) AND MATH 2111; COMP 1021")).toEqual([
      "COMP 1021",
      "COMP 1022P",
      "MATH 2111",
    ])
  })

  it("does not invent references for empty or free-form eligibility text", () => {
    expect(extractPrerequisiteCodes("")).toEqual([])
    expect(extractPrerequisiteCodes("Year 2 standing and instructor approval")).toEqual([])
  })

  it("stops self-cycles and longer cycles regardless of code formatting", () => {
    expect(isPrerequisiteCycle("COMP 1021", ["comp1021"])).toBe(true)
    expect(isPrerequisiteCycle("COMP 2011", ["COMP 2011", "COMP 1021"])).toBe(true)
  })

  it("allows a repeated course in a different branch without that ancestor", () => {
    expect(isPrerequisiteCycle("COMP 1021", ["COMP 4211", "COMP 2011"])).toBe(false)
  })
})
