import React, {useState, useContext, useEffect} from "react";
import './App.css';
import styled from "styled-components";
import {usePath, useRoutes} from "hookrouter";
import NavBar from "./nav/nav";
import MyParking from "./components/parking/parking";
import MyUser from "./components/user/user";
import MyManager from "./components/manager/manager";
import 'react-toastify/dist/ReactToastify.css';


const routes = {
  '/': () => <MyManager/>,
  '/parking': () => <MyParking/>,
  '/user': () => <MyUser/>
};


function App() {
  const path = usePath();

  useEffect(() => {
    console.log("Path changed to: ", path)
  }, [path])

  return <div style={{ width: "100vw", height: "100vh", background: 'rgb(31, 138, 112)'}}>
      {<NavBar />}
      {useRoutes(routes)}
    </div>
  
}

export default App;
