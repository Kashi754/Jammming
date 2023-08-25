import React from 'react';
import Track from '../Track/Track';
import './Tracklist.css';

function Tracklist(props) {
    if(props.tracks.length !== 0) {
        return (
            <div className='TrackList'>
                {props.tracks.map((track) => {
                    console.log(track);
                    return(
                        <Track 
                        track={track}
                        onAdd={props.onAdd}
                        isRemoval={props.isRemoval}
                        onRemove={props.onRemove}
                        key={track.key}
                    />
                    );
                })}          
            </div>
        );
    } else {
        return;
    }
}

export default Tracklist;