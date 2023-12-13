import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home.js'
import Movie from './components/Movie.js'
import Login from './components/Login.js'
import Auth from './components/IsAuth.js'

function App() {
  return (
    <>     
      <BrowserRouter>
      {/* <Auth></Auth> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:movieId" element={<Movie />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
