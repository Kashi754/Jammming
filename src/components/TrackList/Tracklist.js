import React from 'react';
import Track from '../Track/Track';
import './Tracklist.css';

function Tracklist(props) {
    if(props.tracks.length !== 0) {
        return (
            <div className='TrackList'>
                {props.tracks.map((track) => {
                    return(
                        <Track 
                        track={track}
                        onAdd={props.onAdd}
                        isRemoval={props.isRemoval}
                        onRemove={props.onRemove}
                        id={track.id}
                        key={track.id}
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