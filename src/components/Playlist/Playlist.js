import React, {useState, useCallback} from 'react';
import Tracklist from '../TrackList/Tracklist';
import './Playlist.css';

function Playlist(props) {

    const onNameChange = useCallback(
        (event) => {
            props.onNameChange(event);
        }, 
        [props.onNameChange, props.playlistName]
    );

    function handleSubmit(e) {
        e.preventDefault();
        props.onSave(e);
    }

    return (
        <form className='Playlist' onSubmit={handleSubmit}>
            <input 
                id='playlistName' 
                type='text' 
                value={props.playlistName} 
                onChange={onNameChange}
                placeholder='Playlist Name'
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