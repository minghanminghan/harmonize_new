import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App';
import Login from './Login';
import Redirect from './Redirect';
import Error from './Error';


const backend = process.env.REACT_APP_BACKEND;
const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
//const client_secret = process.env.SPOTIFY_client_secret;
const redirect_uri = process.env.REACT_APP_BACKEND;
const scope = 'user-read-private user-read-email';

const params = new URLSearchParams({
  response_type: 'code',
  client_id: client_id,
  scope: scope,
  redirect_uri: redirect_uri+'/signup',
  state: String(Date.now()).toString('base64') // not random but unique
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/callback' element={<Redirect />} />
      <Route path="/home" element={<App />} />
      <Route path="/error" element={<Error />} />
    </Routes>
  </BrowserRouter>
);