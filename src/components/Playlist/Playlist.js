import React, {useState} from 'react';
import Tracklist from '../TrackList/Tracklist';
import './Playlist.css';

function Playlist(props) {

    const [playlistName, setPlaylistName] = useState('');

    function handlePlaylistName(e) {
        setPlaylistName(e.target.value);
    };

    function handleSubmit(e) {
        e.preventDefault();
        alert(`You have submitted ${playlistName} to spotify!`)
    }

    return (
        <form className='Playlist' onSubmit={handleSubmit}>
            <input 
                id='playlistName' 
                type='text' value={playlistName} 
                onChange={handlePlaylistName} 
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