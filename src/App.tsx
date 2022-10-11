import React from 'react';
import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/routes/Layout';
import Home from './components/routes/Home';
import Calc from './components/routes/Calc';
import AutoGrad from './components/routes/AutoGrad';
import CityInfo from './components/routes/CityInfo';


function App() {
  return (
    <div className="App bp4-dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="calc" element={<Calc/>}/>
            <Route path="autograd" element={<AutoGrad/>}/>
            <Route path="cityinfo" element={<CityInfo/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
