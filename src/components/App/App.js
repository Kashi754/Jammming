import logo from '../../logo.svg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import React, { useState, useEffect, useRef } from 'react';
import * as helperFunctions from '../../helperFunctions';
import * as Authentication from '../../Authentication';
import { saveAs } from 'file-saver';

const handleDownload = (text) => {
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(file, 'debug.txt');
};



const clientId = 'a80c55af62d544179f100356c2cad383';
const redirectUri = 'http://localhost:3000/';

let currentPage = '';
let prevPage = '';
let nextPage = '';

function App() {

  let refreshToken = localStorage.getItem('refresh_token') || null;
  let expiresAt = localStorage.getItem('expires_at') || null;

  const [playlistName, setPlaylistName] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  
  let uriArray = useRef([]);
  const initialized = useRef(false);
  const playlistId = useRef('');

  

  useEffect(() => {
    const userAuthentication = async () => {
      await Authentication.requestAccessToken()
        .then(token => {
          setAccessToken(token);
          return helperFunctions.getUserId(token);
        })
        .then(id => {
          console.log(id);
          setUserId(id);
        })
        .catch(error => console.log(error));
    };

    if (!initialized.current && localStorage.getItem('login_request') == '1') {
      userAuthentication();
      initialized.current = true;
      localStorage.getItem('login_request', 0);
    }
  },[]);

/*   useEffect(() => {
    setAccessToken(localStorage.getItem('access_token'));
  },[localStorage.getItem('accessToken')]); */

  
  const login = () => {
    localStorage.setItem('login_request', 1);
    Authentication.authorize();
  };

  const logout = () => {
    setAccessToken(null);
    initialized.current = false;
    localStorage.clear();
  };

 

  function updatePlaylistName(e) {
    setPlaylistName(e.target.value);
  };



  function addTrack(track) {
    if(playlistTracks.indexOf(track) === -1) {
      track.index = searchResults.indexOf(track);
      setPlaylistTracks((prev) => {
        return [track, ...prev];
      });

      uriArray.current.push(track.uri);

      setSearchResults(searchResults.filter(item => item !== track));
    }
  };
  
  function removeTrack(track) {

    if(track.currentURI === currentPage) {
      searchResults.splice(track.index, 0, track);
    };

    setPlaylistTracks((prev) => {
      return prev.filter(item => item !== track);
    });


    uriArray.current = uriArray.current.filter(item => item !== track.uri);
  };
  
  async function savePlaylist(playlistName) {
    helperFunctions.createPlaylist(userId, playlistName, uriArray.current, accessToken);
    setPlaylistTracks([]);
    uriArray.current = [];
    playlistId.current = '';
    setPlaylistName('');
  };

  async function handleSubmit(e, search) {
    e.preventDefault();
    const uri = helperFunctions.urlBuilder(search)
    const results = await helperFunctions.getTracks(accessToken, uri);
  
    setSearchResults(results[0]);
    currentPage = uri;
    nextPage = results[1];
  };

  async function changePage(page) {
    const results = await helperFunctions.getTracks(accessToken, page);
    const newResults = results[0].slice();
    for (let i = results[0].length - 1; i >= 0; i--) {
      for (let j = 0; j < playlistTracks.length; j++) {
        if(playlistTracks[j].id == results[0][i].id) {
          newResults.splice(i, 1)
        }
      }
    };
    setSearchResults(newResults);
    nextPage = results[1];
    currentPage = results[2];
    prevPage = results[3];
  }

  const loginPage = (
    <div className='App'>
      <header>
        <button onClick={login}>Login</button> : 
        <h1>Ja<span className='mmm'>mmm</span>ing</h1>
      </header>

      <main>
        <div className="App-playlist">
          <h2>Please Log-in to Spotify</h2>
        </div> 
      </main>
    </div>
  );

  const logoutPage = (
    <div className='App'>
      <header>
        <button onClick={logout}>Logout</button>
        <h1>Ja<span className='mmm'>mmm</span>ing</h1>
      </header>
      <main>
        <SearchBar handleSubmit={handleSubmit} />
        <div className="App-playlist">
          <SearchResults 
            searchResults={searchResults} 
            prevPage={prevPage}
            nextPage={nextPage}
            changePage={changePage}
            onAdd={addTrack} 
          />
          <Playlist 
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
          />
        </div>
      </main>
    </div>
  );

  return !accessToken? loginPage: logoutPage;
}

export default App;
