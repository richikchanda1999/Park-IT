import React, {Component} from 'react';
import {Customer, Td1, Th1, Tr1,} from "./common";

const {REACT_APP_API_BACKEND} = process.env;

class ManagerHistory extends Component{
    constructor(props) {
        super(props);
        this.state = { userStatus: null}
        this.email = "ashok@gmail.com";
        this.statusFetched = false;
        this.getHistory = this.getHistory.bind(this);
        this.getabc = this.getabc.bind(this);
        this.getabc("ashok@gmail.com");
    }

    async getHistory(email) {
        if (!this.statusFetched) {
            let requestOption = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'email': email}),
            };
            console.log(requestOption);
            let res = await fetch(`${REACT_APP_API_BACKEND}/manager/parking/get_current_parking`, requestOption);
            console.log(res);
            if (res.status === 200) {
                return await res.json();
            }
            this.statusFetched = false;
        }
    }

    async getabc(email){
        let ret = await this.getHistory(email);
        this.setState({ userStatus: ret})
        console.log(this.state.userStatus)
    }

    renderTableData() {
        if(this.state.userStatus != null){
            return this.state.userStatus.map((history, index) => {
                const { vehicle, parking_lot, entry_time, status} = history //destructuring
                return (
                    <Tr1 >
                        <Td1 style={{color: 'white'}}>{vehicle}</Td1>
                        <Td1 style={{color: 'white'}}>{parking_lot}</Td1>
                        <Td1 style={{color: 'white'}}>{entry_time}</Td1>
                        <Td1 style={{color: 'white'}}>{status}</Td1>
                    </Tr1>
                )
            })
        }
    }

    render(){
        return(
            <Customer >
                <Tr1>
                    <Th1 style={{color: 'white'}}>Vehicle No.</Th1>
                    <Th1 style={{color: 'white'}}>Parking Lot</Th1>
                    <Th1 style={{color: 'white'}}>Entry Time</Th1>
                    <Th1 style={{color: 'white'}}>Status</Th1>
                </Tr1>
                <tbody>
                {this.renderTableData()}
                </tbody>
            </Customer>
        );
    }
}

export default ManagerHistory;