import React, {useState, useCallback} from 'react';
import Tracklist from '../TrackList/Tracklist';
import './Playlist.css';
import { func } from 'prop-types';

function Playlist(props) {

    function handleSubmit(e) {
        e.preventDefault();
        props.onSave(props.playlistName);
    }

    return (
        <form className='Playlist' onSubmit={handleSubmit}>
            <input 
                id='playlistName' 
                type='text' 
                value={props.playlistName} 
                onChange={props.onNameChange}
                placeholder='Playlist Name'
                spellCheck='false'
            />
            <Tracklist 
                tracks={props.playlistTracks}
                isRemoval={true}
                onRemove={props.onRemove}
            />
            <button className='save-button' type='submit'>SAVE TO SPOTIFY</button>
        </form>
    )

}

export default Playlist;