import React, {useState, useLayoutEffect, useCallback} from "react";
import {
    Td,
    Th,
    Tr,
    Table,
} from "./common";
import Session from "react-session-api";
import {navigate, useQueryParams} from "hookrouter";
import {toast} from "react-toastify";
import FormHelperText from '@material-ui/core/FormHelperText';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

const {REACT_APP_API_BACKEND} = process.env;
function Booking(props) {
    const [queryParams] = useQueryParams();

    const [booked, setBooking] = useState(false);
    const [vehicleType, setVehicleType] = useState("");
    const [current, setCurrent] = useState(0);
    const [tot, setTot] = useState(0);
    const [vehicleNum, setVehicleNum] = useState("");
    const [amount, setAmount] = useState(0);
    const [value, setValue] = useState(null);

    let selectedPark = queryParams.selectedPark;//doubt here
    let place_id = selectedPark['place_id'];
    let name = selectedPark['name'];
    let rateChart = selectedPark['rate_per_hour'];
    const useStyles = makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
      }));
    let statusFetched = false;
    const getStatus = useCallback(async () => {
        if (!statusFetched) {
            let requestOption = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'place_id': place_id}),
            };
            console.log(requestOption);
            let res = await fetch(`${REACT_APP_API_BACKEND}/map/get_live_status`, requestOption);
            console.log("status");
            console.log(res);
            if (res.status === 200) {
                let val = await res.json();
                console.log(val);
                setCurrent(val['CAP']);
                setTot(val['TPS']);
            }
            statusFetched = false;
        }
    }, []);

    useLayoutEffect(() => {
        getStatus()
    }, []);

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    // async function bookAndPay() {
    //     let res
    // }

    async function displayRazorpay() {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }
        const tran = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'amount': amount})
        }
        const result = await fetch(`${REACT_APP_API_BACKEND}/payment/order`, tran);
        //console.log(result);
        // const { amount, id: order_id, currency } = result.data;
        const data = await result.json();
        console.log(data);


        const options = {
            key: "rzp_test_qKd2HzzsfeAWn4", // Enter the Key ID generated from the Dashboard
            amount: data.amount,//.toString(),
            currency: data.currency,
            name: "Park It",
            description: "Test Transaction",
            order_id: data.id,
            handler: async function (response) {
                console.log(response);
                const _data = {
                    orderCreationId: data.id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };
                let requestOption = {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(_data),
                };
                const result = await fetch(`${REACT_APP_API_BACKEND}/payment/success`, requestOption);
                const ar = await result.json();
                console.log("here:", ar.msg);
                if (ar.msg === "success") {
                    toast.success('Payment successful!');
                    let today = new Date();
                    let time = today.getHours() + ":" + today.getMinutes();
                    let date =  (today.getMonth() + 1) +'/' +today.getDate() + '/' + today.getFullYear();
                    let requestOption = {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            'email': Session.get("email"),
                            'parking_lot': selectedPark['place_id'],
                            'entry_time': date+" "+time,
                            'vehicle': vehicleNum,
                            'cost': amount,
                            'status': 'booked',
                        })
                    }
                    console.log(requestOption);
                    const booked = await fetch(`${REACT_APP_API_BACKEND}/payment/booked`, requestOption);
                    if (booked.status === 200) {
                        toast.success('Booking successful!');
                        setVehicleNum("");
                        setVehicleType("");
                    }
                    else toast.error('Could not book!');
                } else {
                    toast.error('Payment incomplete!');
                }
            },
            prefill: {
                name: Session.get("name"),//this.name
                email: Session.get("email"),//this.email.id
            },
            notes: {
                address: "Park It",
            },
            theme: {
                color: "#61dafb",
            },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }
    function checkValidity()
    {
            var vehicleformat = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;
            console.log(vehicleNum);
            console.log(vehicleType);
            if(vehicleNum.match(vehicleformat)){
                console.log("matched!");
                if(vehicleType.match("truck") || vehicleType.match("car") || vehicleType.match("bike") )
                {
                    displayRazorpay();
                }
                else
                {
                    toast.error('Please Select Your Vehicle Type!');
                }
            }
            else
            {
                toast.error('Please Enter a valid Vehicle Number!');
            }
    }
    function handleChange(event) {
        console.log("called!");
        const target = event.target;
        const value = event.target.value;
        const name = event.target.name;

        if (name === "vehicleType") {
            setVehicleType(value);
        } else if (name === "vehicleNum") {
            setVehicleNum(value);
        }
        console.log("event: \n", event.target);
        if (name === "vehicleType") {
            if (value === "bike")
                setAmount(rateChart['bike']);
            if (value === "car")
                setAmount(rateChart['car']);
            if (value === "truck")
                setAmount(rateChart['truck']);

        }

    }

    const myStyle = {
        margin: "auto",
        width: "30%",
        padding: "10px",
        justifyContent: "center",
        alignItems: "center",
    }
    const boxStyle={
        width: "70%",
        height: "auto",
        display: "flex",
        align: "center",
        justifyContent: "flex-start",
        // background:"rgb(102, 153, 102)",
        margin: "100px auto",
        padding: "20px",
        flexDirection:"row",
        borderRadius: "19px",
        position: "relative",
        overflow: "hidden",       
    }
    const boxStyle2={
        width: "50%",
        height: "auto",
        display: "flex",
        align: "center",
        margin: "auto",
        padding: "20px",
        flexDirection: "column",
        borderRadius: "19px",
        position: "relative",
        overflow: "hidden",
    }
    //background: "rgb(31, 138, 112)
    const classes = useStyles();
    return (
        <body style={{background:"rgb(240, 240, 240)",fontFamily:"'Nunito', sans-serif"}}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <h1 style={{textAlign:"center"}}>The Rate chart of {name} :</h1>
        <Box
        boxShadow={6}
        bgcolor="rgb(102, 153, 102)"
          m={1}
          p={1}
         style={boxStyle}>
        <Box
        boxShadow={0}
        bgcolor="rgb(102, 153, 102)"
          m={1}
          p={1}
         style={boxStyle2}>
            <div >
                <h2>Rate Chart:</h2>
                <Table>
                    <Tr>
                        <Th>Vehicle Type </Th>
                        <Th>Rate Per Hour</Th>
                    </Tr>
                    <tbody>
                    {Object.entries(rateChart).map(([key, value]) => {
                        console.log(key, value);
                        return (
                            <Tr key={key}>
                                <Td>{key}</Td>
                                <Td>Rs {value} per hour</Td>
                            </Tr>
                        );
                    })}
                    </tbody>
                </Table>
                <h1>Current Status: {Math.max(tot - current, 0)}/{tot}</h1>
            </div>
            </Box>
            <Box
            boxShadow={0}
            bgcolor="rgb(102, 153, 102)"
            m={1}
            p={1}
            style={boxStyle2}>
            <div styles={myStyle}>
                <form>
                    <label>
                        <h3>Please Enter Your vehicle Number:</h3>
                        <div style={{backgroundColor:"rgb(240, 240, 240)",width:"50%"}}>
                        <TextField
                        required
                         id="standard-required"
                         label="Required"
                         name="vehicleNum"
                         placeholder="eg:AH 17 FT 2387"
                         defaultValue=""
                         variant="filled"
                         onChange={handleChange}
                        />
                        </div>
                        {/* <input type="text" placeholder="Vehicle Number"name="vehicleNum" value={value} onChange={handleChange}/> */}
                    </label>
                    <br/>
                    <label>
                        <h3>Please Choose your vehicle type:</h3>
                        <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-helper-label">Vehicle Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={vehicleType}
                            name="vehicleType"
                            onChange={handleChange}
                            >
                            <MenuItem value={"car"}>Car</MenuItem>
                            <MenuItem value={"bike"}>Bike</MenuItem>
                            <MenuItem value={"truck"}>Truck</MenuItem>
                        </Select>
                        </FormControl>
                        {/* <select
                            value={vehicleType}
                            name="vehicleType"
                            onChange={handleChange}
                        >
                            <option value="">-- Please Choose your vehicle type--</option>
                            <option value="car">car</option>
                            <option value="bike">bike</option>
                            <option value="truck">truck</option>
                        </select> */}
                    </label>
                    <br/><br/>
                        {amount>0&&<h2>You Need To pay Rs.{amount} for first hour of booking</h2>}
                </form>
                <Button onClick={checkValidity} variant="contained" color="primary" >Proceed to Payment</Button>

            </div>
            </Box>
            </Box>
        {/* </div> */}
        </body>
    );

}

export default Booking;
