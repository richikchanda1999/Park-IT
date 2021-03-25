import React, {useState, useContext, useEffect} from "react";
import './App.css';
import AccountBox from "./components/accountBox";
import styled from "styled-components";
import {AuthContext} from "./authContext";
import {usePath, useRoutes} from "hookrouter";
import NavBar from "./nav/nav";
import {ToastContainer} from "react-toastify";
import ManagerHistory from "./components/parked/parked";
import MyStart from "./components/start/start";

import {AppBar} from "@material-ui/core";

const routes = {
  '/': () => <AppContainer><AccountBox /></AppContainer>,
  '/parked': () => <ManagerHistory/>,
  '/start': () => <StartContainer><MyStart/></StartContainer>
};

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url("/images/bg.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  align-items: center;
  justify-content: center;
`;

const StartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-size: cover;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [isSignedIn, setSignIn] = useState(false);
  const path = usePath();

  function authUpdate(val) {
    setSignIn(val);
  }

  useEffect(() => {
    console.log("Sign In State: ", isSignedIn);
  }, [isSignedIn]);

  useEffect(() => {
    console.log("Path changed to: ", path)
  }, [path])

  const contextValue = {authUpdate};
  return <AuthContext.Provider value={contextValue}>
    <div style={{ width: "100vw", height: "100vh", background: 'rgb(31, 138, 112)'}}>
      {isSignedIn && <NavBar />}
      {useRoutes(routes)}
      <ToastContainer />
    </div>
  </AuthContext.Provider>
}

export default App;
