import React from 'react';
import "./App.css";
import styled from "styled-components";
import { AccountBox } from "./components/accountBox";
import { MyMap } from "./components/map/map"; import {
  Switch,
  Route,
} from "react-router-dom";
import {Booking} from "./components/booking/booking";
import {MyHistory} from "./components/history/history";

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
  return (
    <Switch>
      {/* <Redirect from="/" to="/map"></Redirect> */}
      <Route path="/map">
          <MyMap />
      </Route>
      <Route path="/booking">
          <Booking />
      </Route>
      <Route path="/history">
          <MyHistory />
      </Route>
      <Route path="/">
          <AppContainer><AccountBox /></AppContainer>
      </Route>
    </Switch>

  );
}

export default App;
