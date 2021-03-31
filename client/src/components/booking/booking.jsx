import React, {useState, useLayoutEffect, useCallback} from "react";
import {
    Td,
    Th,
    Tr,
    Table,
} from "./common";
import Session from "react-session-api";
import {navigate, useQueryParams} from "hookrouter";


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

    useLayoutEffect(()=>{getStatus()}, []);

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
        const result = await fetch('http://localhost:9000/payment/order', tran);
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
                    var today = new Date();
                    var time = today.getHours() + ":" + today.getMinutes();
                    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                    let requestOption = {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            'email': Session.get("email"),
                            'parking_lot': selectedPark['place_id'],
                            'entry_time': time + " " + date,
                            'vehicle': vehicleNum,
                            'cost': amount,
                            'status': 'booked',
                        })
                    }
                    console.log(requestOption);
                    const booked = await fetch('http://localhost:9000/payment/booked', requestOption);
                    if (booked.status === 200) {
                            //navigate('/navigateToLoc',false,{coordinate:coordinates});
                    }

                }
            },
            prefill: {
                name: Session.get("name"),//this.name
                email: Session.get("email"),//this.email.id
                contact: "9831665180",//this.contact
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

    function handleChange(event) {
        console.log("called!");
        const target = event.target;
        const value = event.target.value;
        const name = event.target.name;

        // setVehicleType(name);
        // setVehicleNum(value);
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

    return (
        <body style={{background: "rgb(31, 138, 112)"}}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <div style={myStyle}>
            <div>
                <h1>The Rate chart of {name} is:</h1>
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
                <h1>Current Status:{current}/{tot}</h1>
            </div>
            <div>
                <form>
                    <label>
                        <h3>Please Enter Your vehicle Number:</h3>
                        <input type="text" name="vehicleNum" value={value} onChange={handleChange}/>
                    </label>
                    <br/>
                    <label>
                        <h3>Please Choose your vehicle type:</h3>
                        <select
                            value={vehicleType}
                            name="vehicleType"
                            onChange={handleChange}
                        >
                            <option value="">-- Please Choose your vehicle type--</option>
                            <option value="car">car</option>
                            <option value="bike">bike</option>
                            <option value="truck">truck</option>
                        </select>
                    </label>
                    <br/><br/>
                    <h1>You Need To pay {amount} for first hour of booking</h1>
                </form>
                <button onClick={displayRazorpay}>Proceed to Payment</button>

            </div>
        </div>
        </body>
    );

}

export default Booking;
