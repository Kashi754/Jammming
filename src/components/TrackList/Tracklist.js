import React, {useEffect, useState} from 'react';
import Track from '../Track/Track';
import './Tracklist.css';


function Tracklist(props) {


    if(props.tracks.length !== 0) {
        return (
            <div className='TrackList'>
                {props.tracks.map((track, index) => {
                    return(
                        <Track 
                        track={track}
                        onAdd={props.onAdd}
                        isRemoval={props.isRemoval}
                        onRemove={props.onRemove}
                        id={track.id}
                        key={index}
                        index={index}
                        playTrack={props.playTrack}
                        pauseTrack={props.pauseTrack}
                        stop={props.stop}
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