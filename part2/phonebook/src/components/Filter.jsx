const Filter = ({ searchTerm, handleSearchChange }) => (
    <div>
      filter shown with <input value={searchTerm} onChange={handleSearchChange} />
    </div>
  );
  
  export default Filter;
  