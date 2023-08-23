import React, {useState} from 'react';
import './SearchBar.css';

function SearchBar(props) {
    const [search, setSearch] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        alert(`You have searched for ${search}`);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                id='search'
                name='search'
                type='text'
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Search for a song'
            />
            <button className='search-button' type='submit'>SEARCH</button>
        </form>
    );
}

export default SearchBar;