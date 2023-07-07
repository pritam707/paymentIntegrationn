import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Success from './success';
import Unsuccess from './unsucess';



function CustomRoutes() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/success" element={<Success />} />
          <Route path="/unsuccess" element={<Unsuccess />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default CustomRoutes;
