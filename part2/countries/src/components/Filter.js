const Filter = ({searchQuery, handleChange}) => {
    return (
      <div>
        find country: <input value={searchQuery} onChange={handleChange}/>
      </div>
    )
}

export default Filter