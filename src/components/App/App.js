import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import React, { useState, useEffect, useRef } from 'react';
import * as helperFunctions from '../../helperFunctions';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';




let currentPage = '';
let prevPage = '';
let nextPage = '';

function App() {

/*   let refreshToken = localStorage.getItem('refresh_token') || null;
  let expiresAt = localStorage.getItem('expires_at') || null; */

  const [playlistName, setPlaylistName] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresIn, setExpiresIn] = useState(null);
  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState();
  const [url, setUrl] = useState('');
  const [stop, setStop] = useState(0);
  const audio = document.getElementById('audio');
  
  let uriArray = useRef([]);
  const initialized = useRef(false);
  const playlistId = useRef('');
  let timer;

  //Functionality for playing track samples
  //------------------------------------
  useEffect(() => {
      if(url !== ''){
          audio.play();
      }
  },[url]);

  function playTrack(newUrl) {
      setStop(1);

      if(newUrl !== url) {
          setUrl(newUrl);
      }
      else {
          audio.play();
      }   
  };
  
  function pauseTrack() {
      audio.pause();
  };
  //----------------------------------

  //User log-in, log-out, and access token management
  //-----------------------------------
  function handleClose() {
    if(localStorage.getItem('access_token')) {
      logout();
    }
  }

  function updateCount() {
    if (expiresIn) {
      timer = !timer && setInterval(() => {
        setCount(prevCount => prevCount - 1);
      }, 60000);

      if(count === 0) {
        clearInterval(timer);
        logout();
      }
    }
  }

  useEffect(() => {
    updateCount();

    return () => {
      clearInterval(timer);
    };
  },[count]);
  
  useEffect(() => {
    const userAuthentication = async () => {

      try {
        const response = await helperFunctions.requestAccessToken();
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setExpiresIn(response.expiresIn);
        setCount(response.expiresIn);
        
        const id = await helperFunctions.getUserId(response.accessToken);
        setUserId(id);
      } catch (error) {
        console.error(error);
      }
    };

    if (!initialized.current && localStorage.getItem('login_request') == '1') {
      userAuthentication();
      initialized.current = true;
      localStorage.setItem('login_request', null);
    }

    window.addEventListener('beforeunload', handleClose);

    return () => {
      window.removeEventListener('beforeUnload', handleClose);
    };
  },[]);

  async function refresh() {
    const response = await helperFunctions.refreshAccessToken(refreshToken);
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setExpiresIn(response.expiresIn);
    setCount(response.expiresIn);
  }
  
  const login = () => {
    localStorage.setItem('login_request', 1);
    helperFunctions.authorize();
  };

  const logout = () => {
    setAccessToken('');
    initialized.current = false;
    localStorage.clear();
    clearInterval(timer);
  };
  //--------------------------------

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
    setLoading(true);
    helperFunctions.createPlaylist(userId, playlistName, uriArray.current, accessToken)
      .then(response => {
        setLoading(false);
        if(!response.ok) {
          alert(response.response);
        }
        else{
          setPlaylistTracks([]);
          uriArray.current = [];
          playlistId.current = '';
          setPlaylistName('');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  async function handleSubmit(e, search) {
    e.preventDefault();
    const uri = helperFunctions.urlBuilder(search)
    const results = await helperFunctions.getTracks(accessToken, uri);
    setPlaylistName('');
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

  const refreshScreen = (
    <div className='reset-request'>
      <h2>Time Remaining: {count} min</h2>
      <h3>Please refresh access token</h3>
      <button className='refresh' onClick={refresh}>Refresh</button>
    </div>
  );

  const loginPage = (
    <>
      <header>
        <h1>Ja<span className='mmm'>mmm</span>ing</h1>
      </header>

      <main>
        <div className="login-request">
          <div className='login-container'>
            <h2>Please Log-in to Spotify</h2>
            <button className = 'login' onClick={login}>Login</button>
          </div>
        </div> 
      </main>
    </>
  );

  const logoutPage = (
    <div className='App'>
      <header>
        <button className = 'logout logout-main' onClick={logout}>Logout</button>
        <button className='logout logout-alt' onClick={logout}>
          <FontAwesomeIcon className = 'icon' icon={faRightFromBracket} />
        </button>
        <h1>Ja<span className='mmm'>mmm</span>ing</h1>
        <div className='expire-container'>
          <h2 className='expiration'>Access expires in:</h2>
          <h3 className='count'>{count} minutes</h3>
        </div>
        <div className = 'expire-container-alt'>
          <h2 className='expiration'>Remaining: </h2>
          <h3 className='count'>{count} min</h3>
        </div>
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
            playTrack={playTrack}
            pauseTrack={pauseTrack}
            stop={stop}
          />
          <Playlist 
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
            loading={loading}
            playTrack={playTrack}
            pauseTrack={pauseTrack}
            stop={stop}
          />
        </div>
      </main>
    </div>
  );

  return !accessToken? (
    <div className='App'>
        {loginPage}
    </div>): (
    <div className='App'>
      {count <= 5? refreshScreen: null}
      <audio id='audio' src={url}></audio>
      {logoutPage}
    </div>)
  ;
}

export default App;
