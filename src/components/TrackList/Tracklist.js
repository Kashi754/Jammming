import React from 'react';
import Track from '../Track/Track';

function Tracklist(props) {
    return (
        <div className='TrackList'>
            {props.tracks.map((track) => {
                return(
                    <Track 
                    track={track}
                    onAdd={props.onAdd}
                />
                );
            })}          
        </div>
    );
}

export default Tracklist;