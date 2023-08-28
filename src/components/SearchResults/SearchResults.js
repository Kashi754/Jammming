import React from 'react';
import Tracklist from '../TrackList/Tracklist';
import './SearchResults.css';
import { urlBuilder } from '../../helperFunctions';

function renderPreviousButton(props) {
    
    if(props.prevPage) {
        const offset = props.prevPage.split('?')[1].split('&')[4].split('=')[1];
        const query = props.prevPage.split('?')[1].split('&')[0].split('=')[1];
        const url = urlBuilder(query, offset);
        return (
            <button 
                className='pageButton' 
                onClick={() => {
                    props.changePage(url)
                }
            }>Prev</button>);
    }
}

function renderNextButton(props) {
    
    if(props.nextPage) {
        const offset = props.nextPage.split('?')[1].split('&')[4].split('=')[1];
        const query = props.nextPage.split('?')[1].split('&')[0].split('=')[1];
        const url = urlBuilder(query, offset);
        return (
            <button 
                className='pageButton'
                onClick={() => {
                    props.changePage(url)
                }
            }>Next</button>);
    }
}

function SearchResults(props) {
    

    return (
        <div className='SearchResults'>
            <h2>Results</h2>
            <Tracklist tracks={props.searchResults} onAdd={props.onAdd} />
            <div className='page-buttons'>
                {renderPreviousButton(props)}
                {renderNextButton(props)}   
            </div>
        </div>
    );
    
}

export default SearchResults;