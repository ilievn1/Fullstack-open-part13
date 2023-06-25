const Person = ({personObj}) => (
    <li>
      {personObj.name} {personObj.number}
    </li>
)
  
const Persons = ({searchQuery, persons}) => {
    const searchResults =
    searchQuery === ''
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <ul>
            {searchResults.map(p => <Person key={p.name} personObj={p}/>)}
        </ul>
    )
}

export default Persons