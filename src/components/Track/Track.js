import React, {useState, useCallback, useEffect} from 'react';
import './Track.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCirclePlus, faCircleMinus, faPlay, faPause, faCircle} from '@fortawesome/free-solid-svg-icons';

function Track(props) {
    const [state, setState] = useState('play');
    const addTrack = useCallback(
        (event) => {
            props.onAdd(props.track);
        }, 
        [props.onAdd, props.track]
    );

    const removeTrack = useCallback(
        (event) => {
            props.onRemove(props.track);
        }, [props.onRemove, props.track]
    );

    useEffect(() => {
        if(props.stop) {
            setState('play');
        }
    }, [props.stop]);


    function trackAction() {
        if(props.isRemoval) {
            return (
                <button className='Track-action' type='button' onClick={removeTrack}>
                    <FontAwesomeIcon className = 'icon' icon={faCircleMinus} />
                </button>
            );
        } else {
            return (
                <button className='Track-action' type='button' onClick={addTrack}>
                    <FontAwesomeIcon className = 'icon' icon={faCirclePlus} />
                </button>
            );
        }
    };

    function handlePlay(event) {
        const children = event.currentTarget.children;
        const element = state === 'play'? children[0] : children[1];
        const newElement = state === 'play'? children[1]: children[0];
        
        element.style.opacity = 0;
        setTimeout(() => {
            if(state === 'play') {
                props.playTrack(props.track.preview_url, props.index);
                setState('pause');
            } else {
                props.pauseTrack();
                setState('play');
            }
            newElement.style.opacity = 1;
        }, 500);
    }

    return (
        <div className='track'>      
            <div className = 'image-container'>
                <button className="play-button" onClick={handlePlay}>
                    <FontAwesomeIcon className='icon play' id='play' icon={faPlay} />
                    <FontAwesomeIcon className='icon pause' id='pause' icon={faPause} />
                    <FontAwesomeIcon className='icon' id='circle' icon={faCircle} />
                </button>     
                <img src={props.track.album.images[2]['url']} 
                    alt={`${props.track.name} by ${props.track.artists[0].name}`}
                />
            </div>
            <div className = 'track-text'>
                <div className='name-container'>
                    <h3>{props.track.name}</h3>
                </div>
                <div className='album-container'>
                    <h4>
                        {props.track.artists[0].name} | 
                    </h4>
                    <h4>
                        {props.track.album.name}
                    </h4>
                </div>
            </div>
            <div className = 'action-container'>
                {trackAction()}
            </div>
        </div>
    );
}

export default Track;