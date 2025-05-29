import {BrowserRouter, Routes, Route, useParams, Outlet} from 'react-router-dom';
import './App.css'

import Signup from "./Signup/page";
import Login from "./Login/page";
import Home from "./Home/page";

function UserPage() {
  const { username } = useParams();
  return (
  <div>
    <Outlet />
  </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/:username" element={<UserPage />}>
          <Route path="home" element={<Home/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;