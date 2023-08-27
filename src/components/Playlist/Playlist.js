import React, {useState, useCallback} from 'react';
import Tracklist from '../TrackList/Tracklist';
import './Playlist.css';
import { func } from 'prop-types';

function Playlist(props) {
    const [playlistName, setPlaylistName] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        props.onSave(playlistName);
    }

    return (
        <form className='Playlist' onSubmit={handleSubmit}>
            <input 
                id='playlistName' 
                type='text' 
                value={playlistName} 
                onChange={e => setPlaylistName(e.target.value)}
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