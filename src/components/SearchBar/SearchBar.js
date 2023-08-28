import React, {useState} from 'react';
import './SearchBar.css';

function SearchBar(props) {
    const [search, setSearch] = useState('');
    
    function clickHandler(e) {
        props.handleSubmit(e, search);
    }
    
    return (
        <form onSubmit={clickHandler} query={search}>
            <input 
                id='search'
                name='search'
                type='text'
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Search for a song'
                spellCheck='false'
            />
            <button className='search-button' type='submit'>SEARCH</button>
        </form>
    );
}

export default SearchBar;