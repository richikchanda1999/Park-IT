import React, {Component} from 'react';
import "react-responsive-modal/styles.css";
import {Modal} from "react-responsive-modal";
import {
    Customer,
    Td1,
    Tr1,
    Th1,
    RatingButton,
} from "./common";

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center",
    align: "center",
};

class UserHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {userStatus: null}
        this.state = {open: false}
        this.statusFetched = false;
        this.getHistory = this.getHistory.bind(this);
        this.getabc = this.getabc.bind(this);
        this.getabc();
    }

    onOpenModal = () => {
        this.setState({open: true});
    };

    onCloseModal = () => {
        this.setState({open: false});
    };

    async getHistory() {
        if (!this.statusFetched) {
            let requestOption = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
            };
            console.log(requestOption);
            let res = await fetch(`http://localhost:9000/admin/detail/get_manager`, requestOption);
            console.log(res);
            if (res.status === 200) {
                let val = await res.json();
                console.log(val);
                return val;
            }
            this.statusFetched = false;
        }
    }

    async getabc() {
        let ret = await this.getHistory();
        this.setState({userStatus: ret});
        console.log(this.state.userStatus);
    }

    renderButton(email) {
        const {open} = this.state;
        return (
            <div style={styles}>
                <RatingButton type="submit" onClick={this.onOpenModal}>Approve</RatingButton>
                <Modal open={open} onClose={this.onCloseModal}>
                    <h2 style={{padding: "8px"}}>Approve This Manager</h2>
                    <RatingButton type="submit" onClick={() => this.onClick(email)}
                                  style={{marginTop: "14px"}}>Approve</RatingButton>
                </Modal>
            </div>
        )
    }

    renderTableData() {
        if (this.state.userStatus != null) {
            return this.state.userStatus.map((history, index) => {
                const {firstName, lastName, email, parking_id, is_approved} = history //destructuring
                return (
                    <Tr1>
                        <Td1 style={{color: 'white'}}>{firstName}</Td1>
                        <Td1 style={{color: 'white'}}>{lastName}</Td1>
                        <Td1 style={{color: 'white'}}>{email}</Td1>
                        <Td1 style={{color: 'white'}}>{parking_id}</Td1>
                        <Td1
                            style={{color: 'white'}}>{is_approved === true ? "APPROVED" : this.renderButton(email)}</Td1>
                    </Tr1>
                )
            })
        }
    }

    async onClick(email) {
        let requestOption = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'email': email}),
        };
        console.log(requestOption);
        let res = await fetch(`http://localhost:9000/admin/detail/get_approved`, requestOption);
        console.log(res);
        this.setState({open: false});
        if (res.status === 200) {
            let val = await res.json();
            console.log(val);
            await this.getabc();
            return val;
        }
    }

    render() {
        return (
            <Customer>
                <Tr1>
                    <Th1 style={{color: 'white'}}>First Name</Th1>
                    <Th1 style={{color: 'white'}}>Last name</Th1>
                    <Th1 style={{color: 'white'}}>Email</Th1>
                    <Th1 style={{color: 'white'}}>Parking Lot</Th1>
                    <Th1 style={{color: 'white'}}>Approved</Th1>
                </Tr1>
                <tbody>
                {this.renderTableData()}
                </tbody>
            </Customer>
        );
    }
}

class MyManager extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{width: "100%", background: 'rgb(31, 138, 112)'}}>
                <h3 style={{textAlign: "center"}}>USER PARKING HISTORY</h3>
                <UserHistory/>
            </div>
        );
    }
}

export default MyManager;