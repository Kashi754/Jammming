import { saveAs } from 'file-saver';


const handleDownload = (text) => {
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(file, 'debug.txt');
};

export function urlBuilder(query) {
    const baseUrl = 'https://api.spotify.com/v1';
    const limit = '10';
    const market = 'US';
    const offset = 0;
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
            return {
                tracks: jsonResponse.tracks.items,
                prevURI: jsonResponse.tracks.previous,
                nextURI: jsonResponse.tracks.next
            };
        }
        throw new Error('Unable to fetch tracks from Spotify!');
    } catch(error) {
        console.log(error);
    }
}