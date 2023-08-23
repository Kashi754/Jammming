import React, {useState} from 'react';
import Tracklist from '../TrackList/Tracklist';

function Playlist(props) {

    return (
        <div className='Playlist'>
            <h2>Playlist</h2>
            <Tracklist 
                tracks={props.playlistTracks}
                isRemoval={true}
                onRemove={props.onRemove}
            />
        </div>
    )

}

export default Playlist;