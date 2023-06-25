import Course from './components/Course.js'


const App = () => {
  const courses = [
  {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  },
  {
    name: 'Node.js',
    id: 2,
    parts: [
      {
        name: 'Routing',
        exercises: 3,
        id: 1
      },
      {
        name: 'Middlewares',
        exercises: 7,
        id: 2
      }
    ]
  },
  {
    name: 'Flutter',
    id: 3,
    parts: [
      {
        name: 'Flutter vs Native',
        exercises: 16,
        id: 1
      },
      {
        name: 'Misc',
        exercises: 74,
        id: 2
      }
    ]
  }
]

  return (
    <>
      {courses.map(crs => 
          <Course key={crs.id} course={crs} />
      )}
    </>
  )
}

export default App