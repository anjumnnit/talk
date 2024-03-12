import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    // <div className="search-bar">
    //   <input
    //     type="text"
    //     placeholder="Search by username"
    //     value={searchText}
    //     onChange={(e) => setSearchText(e.target.value)}
    //   />
    //   <button onClick={handleSearch}>Search</button>
    // </div>
    <li><i className="large material-icons" style={{color:"black"}}>search</i></li>

  );
};

export default SearchBar;
