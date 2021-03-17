import React, {useState, useEffect} from 'react';
import "./App.css";
import styled from "styled-components";
import AccountBox from "./components/accountBox";
import MyMap from "./components/map/map";
import Booking from "./components/booking/booking";
import {MyHistory} from "./components/history/history";
import {useRoutes} from 'hookrouter';
import NavBar from "./components/nav/nav";
import {AuthContext} from "./authContext";

const routes = {
    '/': () => <AppContainer><AccountBox /></AppContainer>,
    '/map': () => <MyMap />,
    '/history': () => <MyHistory />,
    '/booking': () => <Booking />
};

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url("/images/4.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  align-items: center;
  justify-content: center;
`;

function App() {
    const [isSignedIn, setSignIn] = useState(false);

    function authUpdate(val) {
        setSignIn(val);
    }

    useEffect(() => {
        console.log("Sign In State: ", isSignedIn);
    }, [isSignedIn]);

    const contextValue = {authUpdate};
    return <AuthContext.Provider value={contextValue}>
                <div style={{ width: "100vw", height: "100vh", background: 'rgb(31, 138, 112)'}}>
                    {isSignedIn && <NavBar />}
                    {useRoutes(routes)}
                </div>
            </AuthContext.Provider>
    // return useRoutes(routes);
}

export default App;