import React, {useEffect, useState} from 'react';
import Track from '../Track/Track';
import './Tracklist.css';


function Tracklist(props) {
    const [url, setUrl] = useState('');
    const [stop, setStop] = useState(0);
    const audio = document.getElementById('audio');


    useEffect(() => {
        if(url !== ''){
            audio.play();
        }
    },[url]);

    function playTrack(newUrl, trackIndex) {
        setStop(1);
        const playButtons = document.getElementsByClassName('play');
        const pauseButtons = document.getElementsByClassName('pause');
        for(var i = 0; i < playButtons.length; i++) {
            if(i !== trackIndex) {
                console.log('i');
                pauseButtons[i].style.opacity = 0;
                playButtons[i].style.opacity = 1;
                break;
            }   
        }

        if(newUrl !== url) {
            setUrl(newUrl);
        }
        else {
            audio.play();
        }   
    };
    
    function pauseTrack() {
        audio.pause();
    };

    if(props.tracks.length !== 0) {
        return (
            <div className='TrackList'>
                <audio id='audio' src={url}></audio>
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
                        playTrack={playTrack}
                        pauseTrack={pauseTrack}
                        stop={stop}
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