import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App.js';
import Login from './Login.js';
import Redirect from './components/Redirect.js';
import Error from './components/Error.js';
import Extend from './Extend.js';
import { AuthProvider } from './utils/AuthContext.js';
import TokenProvider from './utils/TokenProvider.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <AuthProvider>
  <TokenProvider>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/callback' element={<Redirect />} />
      <Route path="/home" element={<App />} />
      <Route path="/error" element={<Error />} />
      <Route path="/extend" element={<Extend />} />
    </Routes>
  </BrowserRouter>
  </TokenProvider>
  </AuthProvider>
);