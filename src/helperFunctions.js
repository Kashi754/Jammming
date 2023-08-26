import { saveAs } from 'file-saver';
import Tracklist from './components/TrackList/Tracklist';


const handleDownload = (text) => {
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(file, 'debug.txt');
};

export function urlBuilder(query, offset = 0) {
    const baseUrl = 'https://api.spotify.com/v1';
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