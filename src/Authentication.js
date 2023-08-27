import { handleDownload } from "./helperFunctions";

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
const redirectUri = 'http://localhost:3000/';

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
        /* localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('expires_at', data.expires_at); */
        return data.access_token;
      })
      .catch(error => {
        console.log(error);
      });

      return response;
}

export async function refreshToken() {
  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams({
      clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
      .then(response => {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('expires_at', data.expires_at);
    })
    .catch(error => {
      console.error('Error:', error);
    });    
}


