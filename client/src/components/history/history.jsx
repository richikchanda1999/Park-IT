import React, { Component } from 'react';
import {
    Customer,
    Td1,
    Tr1,
    Th1,
    RatingButton,
} from "./common";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import BeautyStars from "beauty-stars";
import Session from "react-session-api";

const { REACT_APP_API_BACKEND } = process.env;

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center",
    align: "center",
};

class UserHistory extends Component{
    constructor(props) {
        super(props);
        this.state = { userStatus: null}
        this.state = { open: false}
        this.state =  {value: 0};
        this.statusFetched = false;
        this.getHistory = this.getHistory.bind(this);
        this.getabc = this.getabc.bind(this);
        this.getabc(Session.get("email"));
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false, value: 0 });
    };

    async getHistory(email) {
        if (!this.statusFetched) {
            console.log(Session.get("email"), Session.get("user_id"), Session.get("name"));
            let requestOption = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'email': email}),
            };
            console.log(requestOption);
            let res = await fetch(`${REACT_APP_API_BACKEND}/users/get_user_history`, requestOption);
            console.log(res);
            if (res.status === 200) {
                let val = await res.json();
                console.log(val);
                return val;
            }
            this.statusFetched = false;
        }
    }

    async getabc(email){
        let ret = await this.getHistory(email);
        this.setState({ userStatus: ret})
        console.log(this.state.userStatus)
    }

    renderButton(){
        const { open } = this.state;
        return(
            <div style={styles}>
                <RatingButton type="submit" onClick={this.onOpenModal}>Rate</RatingButton>
                <Modal open={open} onClose={this.onCloseModal}>
                    <h2 style={{padding: "8px"}}>How Was Your Experience?</h2>
                    <BeautyStars value={this.state.value} onChange={value=>this.setState({value})} size="20px"/>
                    <RatingButton type="submit" style={{marginTop: "14px"}}>Submit</RatingButton>
                </Modal>
            </div>
        )
    }

    renderTableData() {
        if(this.state.userStatus != null){
            return this.state.userStatus.map((history, index) => {
                const { vehicle, parking_lot, entry_time, exit_time, cost, rating} = history //destructuring
                return (
                    <Tr1 >
                        <Td1 style={{color: 'white'}}>{Session.get("email")}</Td1>
                        <Td1 style={{color: 'white'}}>{vehicle}</Td1>
                        <Td1 style={{color: 'white'}}>{parking_lot}</Td1>
                        <Td1 style={{color: 'white'}}>{entry_time}</Td1>
                        <Td1 style={{color: 'white'}}>{exit_time}</Td1>
                        <Td1 style={{color: 'white'}}>{cost}</Td1>
                        <Td1 style={{color: 'white'}}>{rating?<BeautyStars value={rating} size="12px"/>:this.renderButton()}</Td1>
                    </Tr1>
                )
            })
        }
    }

    render(){
        return(
            <Customer >
                <Tr1>
                    <Th1 style={{color: 'white'}}>Email</Th1>
                    <Th1 style={{color: 'white'}}>Vehicle No.</Th1>
                    <Th1 style={{color: 'white'}}>Parking Lot</Th1>
                    <Th1 style={{color: 'white'}}>Entry Time</Th1>
                    <Th1 style={{color: 'white'}}>Exit Time</Th1>
                    <Th1 style={{color: 'white'}}>Cost</Th1>
                    <Th1 style={{color: 'white'}}>Rating</Th1>
                </Tr1>
                <tbody>
                {this.renderTableData()}
                </tbody>
            </Customer>
        );
    }
}

class MyHistory extends Component {
    constructor(props) {
        super(props);
        console.log(Session.get("email"));
    }

    render() {
        return (
            <div style={{ width: "100vw", height: "100vh", background: 'rgb(31, 138, 112)'}}>
                <h3 style={{textAlign: "center"}}>USER PARKING HISTORY</h3>
                <UserHistory />
            </div>
        );
    }
}

export { MyHistory };