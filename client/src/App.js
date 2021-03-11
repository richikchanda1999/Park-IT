import React, {Component} from 'react';
import "./App.css";
import styled, {ThemeProvider} from "styled-components";
import { AccountBox } from "./components/accountBox";
import { MyMap } from "./components/map/map"; import {
  Switch,
  Route,
} from "react-router-dom";
import {Booking} from "./components/booking/booking";
import {MyHistory} from "./components/history/history";
import {ToastProvider, useToasts} from 'react-toast-notifications'
import {Navabc} from "./components/nav/nav";
import { createContext } from "react";

export const AuthContext = createContext();

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

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {isSignedIn: false, authUpdate: this.authUpdate};
    }

    authUpdate = authState => {
        this.setState({isSignedIn: authState});
    };

    render() {
        return (
            <ToastProvider>
                <AuthContext.Provider value={this.state}>
                    <div style={{height: "100%", background: 'rgb(31, 138, 112)'}}>
                        {this.state.isSignedIn && <Navabc/>}
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
                    </div>
                </AuthContext.Provider>
            </ToastProvider>
        );
    }
}

export {App};
