import logo from '../../logo.svg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import React, { useState, useEffect, useRef } from 'react';
import * as helperFunctions from '../../helperFunctions'
import { saveAs } from 'file-saver';

const handleDownload = (text) => {
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(file, 'debug.txt');
};

let currentPage = '';
let prevPage = '';
let nextPage = '';

function App() {
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const clientId = 'a80c55af62d544179f100356c2cad383';
  const redirectUri = 'http://localhost:3000/';
  const responseType = 'token';

  const [playlistName, setPlaylistName] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [uriArray, setUriArray] = useState([]);
  const [token, setToken] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  

  const initialized = useRef(false);

  useEffect(() => {
    let timer;
    if(token) {
      timer = setTimeout(() => logout(), 3600000);
    }
    
    const hash = window.location.hash;
    let tokenString = window.localStorage.getItem('token');

    if (!initialized.current) {
      initialized.current = true;
  
      if(!tokenString && hash) {
        
        try {
          tokenString = hash.substring(1)
            .split('&')
            .find(elem => elem.startsWith('access_token'))
            .split('=')[1];
    
            window.location.hash = '';
            window.localStorage.setItem('token', tokenString);
        } catch (error) {
          console.log(error);
        }
      }
      setToken(tokenString);
    }
    return () => clearTimeout(timer);
  }, [token]);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
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

      setUriArray((prev) => {
        return [...prev, track.uri];
      });

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

    setUriArray((prev) => {
      return prev.filter(item => item !== track.uri);
    });
  };
  
  function savePlaylist() {
    //const playlist = function to create playlist
    //const playlistId = playlist.id
    //Add function to post playlist to Spotify
    setPlaylistTracks([]);
    setUriArray([]);
    setPlaylistName('');
  };

  async function handleSubmit(e, search) {
    e.preventDefault();
    const uri = helperFunctions.urlBuilder(search)
    const results = await helperFunctions.getTracks(token, uri);
  
    setSearchResults(results[0]);
    currentPage = uri;
    nextPage = results[1];
  };

  async function changePage(page) {
    const results = await helperFunctions.getTracks(token, page);
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

  return (
    <div className='App'>
      <header>
      {!token ?
        <button>
          <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}`}
          >Login to Spotify</a>
        </button> : 
        <button onClick={logout}>Logout</button>}
        <h1>Ja<span className='mmm'>mmm</span>ing</h1>
      </header>
      
      
        {!token ? 
        <main>
          <div className="App-playlist">
            <h2>Please Log-in to Spotify</h2>
          </div> 
        </main> :
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
        </main>}
        
      
    </div>
  );
}

export default App;
