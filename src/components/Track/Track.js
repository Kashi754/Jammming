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
            <div className = 'track-information'>
                <h3>{props.track.name}</h3>
                <p>
                    {props.track.artists[0].name} | {props.track.album.name}
                </p>
            </div>
            {trackAction()}
        </div>
    );
}

export default Track;