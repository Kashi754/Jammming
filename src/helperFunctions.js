import { saveAs } from 'file-saver';
import Tracklist from './components/TrackList/Tracklist';


const baseUrl = 'https://api.spotify.com/v1';

export function handleDownload(text) {
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(file, 'debug.txt');
}

export async function getUserId(token) {

    const response = await fetch(baseUrl + '/me', {
        method: 'GET',
        headers: {Authorization: 'Bearer ' +  token},
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to fetch User ID!');
            }
            return response.json();
        })
        .then(data => {
            return data.id;
            /* localStorage.setItem('user_id', userId); */
        })
        .catch(error => {
            console.log(error);
        });
    return response;
}

export function createPlaylist(userId, playlistName, uriArray, token) {  
    const response = fetch(baseUrl + `/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': playlistName,
            'public': 'true'
        })

    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to Create Playlist!');
            }
            return response.json();
        })
        .then(data => {
            let playlistId = data.id;
            submitPlaylist(playlistId, uriArray, token);
        })
        .catch(error => {
            console.log(error);
        })    
}

async function submitPlaylist(playlistId, uriArray, token) {

    try {
        const response = await fetch(baseUrl + `/playlists/${playlistId}/tracks/`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'uris': uriArray
            })
        });

        if(response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        }
        throw new Error('Unable to Submit Items to Playlist!');
    } catch (error) {
        console.log(error);
    }
}

export function urlBuilder(query, offset = 0) {
    const limit = '10';
    const market = 'US';
    const type = `album%2Cartist%2Ctrack%2Cplaylist`
    const requestParams = `q=${query}&type=${type}&market=${market}&limit=${limit}&offset=${offset}`;
    return `${baseUrl}/search?${requestParams}`;
};

export async function getTracks(token, uri) {
    try {
        const response = await fetch(uri, {
            method: 'GET',
            headers: {Authorization: 'Bearer ' +  token},
        });

        if(response.ok) {
            const jsonResponse = await response.json();
            let trackList = jsonResponse.tracks.items;
            for(const track of trackList) {
                track.prevURI = jsonResponse.tracks.previous;
                track.currentURI = uri;
                track.nextURI = jsonResponse.tracks.next;
            };
            return [trackList, jsonResponse.tracks.next, uri, jsonResponse.tracks.previous];
            
        }
        throw new Error('Unable to fetch tracks from Spotify!');
    } catch(error) {
        console.log(error);
    }
}

