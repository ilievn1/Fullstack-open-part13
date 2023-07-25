import { CoursePart } from "../types"

const Total = ({ courses }: { courses: Array<CoursePart> }): JSX.Element => {
  return(
        <p>
          Number of exercises{" "}
          {courses.reduce((carry, part) => carry + part.exerciseCount, 0)}
        </p>
    )
}

export default Total