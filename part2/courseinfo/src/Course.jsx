const Course = ({course}) => {
    const total = course.parts.reduce(
      (exercises, part) => exercises + part.exercises, 0
    ) 
    return (
      <>
      <Header courseName={course.name} />
      {course.parts.map(part => <Part key={part.id} part={part} />)}
      <b>total of {total} exercises</b>
      </>
    )
  }
  
  const Header = ({courseName}) => {
    return (
      <>
        <h2>{courseName}</h2>
      </>
    )
  }
  
  const Part = ({part}) => {
    return (
      <>
        <p>{part.name} {part.exercises}</p>
      </>
    )
  }

  export default Course