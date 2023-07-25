import { CoursePart } from "../types";
import Part from "./Part";

const Content = ({ courses }: { courses: Array<CoursePart> }): JSX.Element => {
  const courseList = courses.map(c => <Part key={c.name} coursePart={c}/>)
  return (
    <>
      {courseList}
    </>
  );
}

export default Content