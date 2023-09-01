import React from 'react';
import Tracklist from '../TrackList/Tracklist';
import './Playlist.css';

function Playlist(props) {

    function handleSubmit(e) {
        e.preventDefault();
        props.onSave(props.playlistName);
    }

    const loadingScreen = () => {
        return (
            <div className="center">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
        );
    };

    return (
        <form className='Playlist' onSubmit={handleSubmit}>
            {props.loading && loadingScreen()}
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
                playTrack={props.playTrack}
                pauseTrack={props.pauseTrack}
                stop={props.stop}
            />
            <button className='save-button' type='submit'>SAVE TO SPOTIFY</button>
        </form>
    )

}

export default Playlist;