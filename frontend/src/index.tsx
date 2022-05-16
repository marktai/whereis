import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import CloverService from './api';
import 'bootstrap/dist/css/bootstrap.css'
import Button from 'react-bootstrap/Button';
import List from './pages/list';
import Clues from './pages/clues';
import Guess from './pages/guess';

const account = async () => {
  console.log(await CloverService.getGame(1))
  console.log(await CloverService.submitClues(1, ['a', 'b', 'c', 'd'], 5))
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
      crossOrigin="anonymous"
    />
    <BrowserRouter>
      <Routes>
        <Route index element={<List />} />
        <Route path="/games/:id/clues" element={<Clues />} />
        <Route path="/games/:id/guess" element={<Guess />} />
        <Route path="/button" element={<Button onClick={account} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
