import React, { Component } from 'react';
import {
    withRouter
} from "react-router";

class _Booking extends Component
{
    constructor(props)
    {
        super(props);
        //console.log(props);//null
        this.state={booked:false, vehicleType:""};
        console.log(this.props.location.state);
        this.selectedPark = this.props.location.state.selectedPark;
        this.place_id= this.selectedPark['place_id'];
        this.name= this.selectedPark['name'];
        this.rateChart= this.selectedPark['rate_per_hour'];

        console.log(this.selectedPark);

        this.renderTableData=this.renderTableData.bind(this);
    }
    renderTableData() {
        return Object.entries(this.rateChart).forEach(function(vehicle,rate) {
            console.log(vehicle[0]);
            console.log(vehicle[1]);
            return (
                <tr>
                    <td>{vehicle[0]}</td>
                    <td>Rs.{vehicle[1]} per hour</td>
                </tr>
            )
        });
    }
    render(){
        return(
            <div>
                <div>
                    <h1>The Rate chart of {this.name} is</h1>
                    <table>
                        <tbody>
                        {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
                <div>
                    <form>
                        <select
                            value={this.vehicalType}
                            name="vehicle_type"
                        >
                            <option value="">-- Please Choose your vehicle type--</option>
                            <option value="two-wheeler">car</option>
                            <option value="bike">bike</option>
                            <option value="truck">truck</option>
                        </select>
                        <button>Submit</button>
                    </form>
                </div>
            </div>

        )
    }

}

const Booking = withRouter(_Booking);
export {Booking};