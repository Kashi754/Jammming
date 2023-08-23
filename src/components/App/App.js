import logo from '../../logo.svg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

const searchResults = [
  {name: 'Cemetery Bloom', artist: 'Parkway Drive', album: "Reverence"},
  {name: 'Chronos', artist: 'Parkway Drive', album: "Reverence"},
  {name: 'The Void', artist: 'Parkway Drive', album: "Reverence"},
  {name: 'Prey', artist: 'Parkway Drive', album: "Reverence"},
  {name: 'I Hope You Rot', artist: 'Parkway Drive', album: "Reverence"},
  {name: 'The Colour of Leaving', artist: 'Parkway Drive', album: "Reverence"},
  {name: 'Absolute Power', artist: 'Parkway Drive', album: "Reverence"},
  {name: 'Shadow Boxing', artist: 'Parkway Drive', album: "Reverence"},
  {name: 'Wishing Wells', artist: 'Parkway Drive', album: "Reverence"},
  {name: 'In Blood', artist: 'Parkway Drive', album: "Reverence"},
];

const playlistName = 'Test Playlist';



function App() {
  function addTrack() {
    return;
  };
  
  function updatePlaylistName() {
    return;
  };
  
  function removeTrack() {
    return;
  };
  
  function savePlaylist() {
    return;
  }

  return (
    <div className='App'>
      <header>
        <h1>Ja<span class='mmm'>mmm</span>ing</h1>
      </header>
      
      <SearchBar />
      <div className="App-playlist">
        <SearchResults searchResults={searchResults} onAdd={addTrack} />
        <Playlist 
          playlistName={playlistName}
          playlistTracks={searchResults.slice(0, 3)}
          onNameChange={updatePlaylistName}
          onRemove={removeTrack}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;
