const Header = ({courseName}) => {
    return (
      <div>
        <h1>{courseName}</h1>
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <div>
        <p>{props.partName} {props.exercises}</p>
      </div>
    )
  }
  
  const Content = ({courseParts}) => {
    const partsArr = courseParts;
    return (
      <div>
        {partsArr.map(p => <Part key={p.id} partName={p.name} exercises={p.exercises}/>)}
      </div>
    )
  }
  
  const Total = ({courseParts}) => {
    let totalExerciseCount = courseParts.reduce((acc, part)=> acc+part.exercises,0);
    return (
      <div>
        <h4>total of {totalExerciseCount} exercises</h4>
      </div>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header courseName={course.name}/>
        <Content courseParts={course.parts} />
        <Total courseParts={course.parts} />
      </div>
    )
  }

  export default Course