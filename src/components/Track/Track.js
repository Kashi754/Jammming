import React, {useCallback} from 'react';
import './Track.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCirclePlus, faCircleMinus} from '@fortawesome/free-solid-svg-icons';

function Track(props) {
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

    return (
        <div className='track'>
            
            <div className = 'image-container'>
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