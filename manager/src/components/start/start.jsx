import React,  { useState }  from 'react';
import styled from "styled-components";
import Tabs, {Tab} from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import {Form1} from './common';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import {toast} from "react-toastify";
import BeautyStars from "beauty-stars";
import Session from "react-session-api";

const {REACT_APP_API_BACKEND} = process.env;

const BoxContainer = styled.div`
  width: 350px;
  height: 400px;
  display: flex;
  margin: 20px;
  padding: 20px;
  flex-direction: column;
  border-radius: 19px;
  box-shadow: 0 0 2px rgb(15, 15, 15);
  position: relative;
  overflow: hidden;
`;


const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  align: "center",
};

function Content1(){

  const [vehicle, setVehicle] = useState("");
  const [vehicleType, setVehicleType] = useState("bike");
  const parking_lot = Session.get('parking_id');

  const vehicleEnter = () => toast.success("Successfully Parked "+ vehicle, {position: "top-center",autoClose: false, draggable: true});
  const vehicleNotPresent = () => toast.info("Vehicle No. not present! Please Enter", {position: "top-center",autoClose: false, draggable: true});
  const noSpace = () => toast.error("No Space In Parking Lot", {position: "top-center",autoClose: false, draggable: true});
  const alreadyEntered = () => toast.info("Vehicle is Already in the Parking Lot", {position: "top-center",autoClose: false, draggable: true});


  async function onClick(){
    console.log(vehicle, vehicleType);
    if(vehicle != ""){
      if(vehicleType == "")
        setVehicleType("bike")
      var today = new Date();
      var time = today.getHours() + ":" + today.getMinutes();
      var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
      var entry_time = date + " " + time;
      console.log(entry_time);
      let requestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'parking_lot': parking_lot, 'vehicle': vehicle, 'vehicleType': vehicleType, 'entry_time': entry_time}),
      };
      let res = await fetch(`${REACT_APP_API_BACKEND}/manager/parking/vehicle_enter`, requestOption);
      console.log(res);
      
      if (res.status === 200) {
          let val = await res.json();
          console.log(val);
          if(val == '-1')
            noSpace();
          else if(val == '-2')
            alreadyEntered();
          else
            vehicleEnter();
          setVehicleType(null);
          setVehicle("");
      }
    }
    else{
      vehicleNotPresent();
    }
  }

  function onChange(e){
    let val = e.target.value;
    console.log(val);
    setVehicleType(val);
  }

  function vehicleChange(fn){
    let val = fn.target.value;
    console.log(val);
    setVehicle(val);
  }

  return(
    <>
    <Form1>
    <div>
    Vehicle No : <input value={vehicle} type="text" onChange={vehicleChange} style={{textAlign: "center"}}></input><br/><br/>
    </div>
    <RadioGroup aria-label="Vehicle Type" style={{alignContent: "center"}}>
    <FormControlLabel value="bike" control={<Radio color="primary" />} label="Bike" onChange={onChange} />
    <FormControlLabel value="car" control={<Radio color="primary" />} label="Car" onChange={onChange} />
    <FormControlLabel value="truck" control={<Radio color="primary" />} label="Truck" onChange={onChange} />
    </RadioGroup>
    <div style={{marginTop: "10px" ,  marginLeft: '25%'}}>
    <AwesomeButton type="primary" onPress={onClick}>ENTER</AwesomeButton>
    </div>
    </Form1>
    </>
  );
}

function Content2(){

  const [vehicle, setVehicle] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const parking_lot = Session.get('parking_id');
  let cost1 = 0;

  const parkCost = () => toast.info("Total Cost is Rs."+ cost1, {position: "top-center",autoClose: false, draggable: true});
  const noVehicle = () => toast.error("Vehicle Number Not Present!!!", {position: "top-center",autoClose: false, draggable: true});

  function vehicleChange(fn){
    let val = fn.target.value;
    console.log(val);
    setVehicle(val);
  }

  const onOpenModal = () => {
      setOpen(true);
  };

  const onCloseModal = () => {
      setOpen(false);
      setValue(0);
  };

  async function onClick(){
    console.log(vehicle);
    if(vehicle != ""){
      console.log(value);
      var today = new Date();
      var time = today.getHours() + ":" + today.getMinutes();
      var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
      var exit_time = date + " " + time;
      console.log(exit_time);
      let requestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'parking_lot': parking_lot, 'vehicle': vehicle, 'exit_time': exit_time, 'ratingManager': value}),
      };
      let res = await fetch(`${REACT_APP_API_BACKEND}/manager/parking/vehicle_exit`, requestOption);
      console.log(res);
      if (res.status === 200) {
          setOpen(false);
          setValue(0);
          let val = await res.json();
          console.log(val);
          if(val == '-1')
            noVehicle();
          else{
            cost1 = val;
            parkCost();
          }
        setVehicle("");
      } 
    }
  }


  return(
    <Form1>
      <div>
        Vehicle No : <input value={vehicle} type="text" onChange={vehicleChange} style={{textAlign: "center"}}></input><br/><br/>
      </div>
      <AwesomeButton  style={{ marginLeft: '30%'}}  type="primary" onPress={onOpenModal}>EXIT</AwesomeButton>
      <Modal open={open} onClose={onCloseModal}>
          <h2 style={{padding: "8px"}}>Rate the Custumer?</h2>
          <div style={{marginLeft:'15%', width:'50%'}}>
          <BeautyStars value={value} style={{padding: "20%"}} onChange={value=>setValue(value)} size="20px"/>
          </div>
          <AwesomeButton  style={{ marginTop: "20px", marginLeft: "35%"}}  type="primary" onPress={onClick}>SUBMIT</AwesomeButton>
      </Modal>
    </Form1>
  );
}

const StartContainer = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  background-size: cover;
  align-items: center;
  justify-content: center;
  background-colour: white;
`;



function MyStart() {
  return (
    <StartContainer style={{backgroundColor: 'white'}}>
      <h2>{Session.get('parking_name')}</h2>
    <BoxContainer >
      <Tabs activeTab="1" className="" ulClassName="" activityClassName="bg-success" onClick={(event, tab) => console.log(event, tab)}>
            <Tab title=" ENTRY " className="mr-3" >
                <div className="mt-3">
                    <Content1/>
                </div>
            </Tab>
            <Tab title=" EXIT " className="mr-3">
                <div className="mt-3">
                    <Content2/>
                </div>
            </Tab>
        </Tabs>   
    </BoxContainer>
    </StartContainer>
  );
}

export default MyStart;