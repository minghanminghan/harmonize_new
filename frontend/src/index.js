import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App';
import Login from './Login';
import Redirect from './components/Redirect';
import Error from './components/Error';
import User from './User';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/callback' element={<Redirect />} />
      <Route path="/home" element={<App />} />
      <Route path="/error" element={<Error />} />
      <Route path="/users/:username" element={<User />} />
    </Routes>
  </BrowserRouter>
);