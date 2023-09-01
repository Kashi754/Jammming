import { saveAs } from 'file-saver';


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
        })
        .catch(error => {
            console.error(error);
        });
    return response;
}

export async function createPlaylist(userId, playlistName, uriArray, token) {  
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
      .then(async data => {
          let playlistId = data.id;
          const response = await submitPlaylist(playlistId, uriArray, token);
          return {
            ok: true,
            response: response
          };
      })
      .catch(error => {
          console.error(error);
          return {
            ok: false,
            response: error
          };
      })  
    return response;
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
        console.error(error);
        return {
          ok: false,
          response: error
        };
    }
    return {ok: true}
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
        console.error(error);
    }
}


function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  
  async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
  
    return base64encode(digest);
  }
  
  const clientId = 'a80c55af62d544179f100356c2cad383';
  const redirectUri = 'https://Kashi754.github.io/Jammming'
  /* const redirectUri = 'http://localhost:3000/'; */
  
  let codeVerifier = generateRandomString(128);
  
  export function authorize() {
  generateCodeChallenge(codeVerifier).then(codeChallenge => {
    let state = generateRandomString(16);
    let scope = 'user-read-private user-read-email playlist-modify-public';
  
    localStorage.setItem('code_verifier', codeVerifier);
  
    let args = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });
  
    window.location = 'https://accounts.spotify.com/authorize?' + args;
  });
  }
  
  export async function requestAccessToken() {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
  
    let codeVerifier = localStorage.getItem('code_verifier');
  
    let body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
    });
  
  
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          return {
            accessToken: data.access_token, 
            refreshToken: data.refresh_token, 
            expiresIn: data.expires_in / 60
          };
        })
        .catch(error => {
          console.error(error);
        });
  
        return response;
  }

  export async function refreshAccessToken(refreshToken) {
  
    let body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    });
  
  
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          return {
            accessToken: data.access_token, 
            refreshToken: data.refresh_token, 
            expiresIn: data.expires_in / 60
          };
        })
        .catch(error => {
          console.error(error);
        });
  
        return response;
  }