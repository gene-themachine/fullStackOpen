const Persons = ({ personsToShow , toggleDelete}) => (
    <ul>
      {personsToShow.map(person => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick = {() => toggleDelete(person.id, person.name)}>delete</button>
        </li>
      ))}
    </ul>
  );
  
  export default Persons;
  