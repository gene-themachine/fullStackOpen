
const Course = ({course}) => (

    <div>
        <Header header = {course.name} />
        <Content parts = {course.parts}/>
    
    </div>
    )
    const Header = ({header}) => (
    
    <div>
        <h1>{header}</h1>
    </div>
    )
    
    const Content = ({parts}) => {
    let sum = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        
    
    <div>
        {parts.map((part) => (
            <Part key={part.id} name={part.name} exercises={part.exercises} />
        ))}
        
        
        
        <p><strong>Total of {sum} exercises</strong></p>
    
    </div>
    )
    
    
    }
    
    
    const Part = ({name, exercises}) => (
    <p>{name} {exercises}</p>
    )
    
export default Course 