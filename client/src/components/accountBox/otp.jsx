import React, { useState, useContext } from "react";
import {
    BoldLink,
    BoxContainer,
    FormContainer,
    Input,
    MutedLink,
    SubmitButton,
} from "./common";
import Marginer from "../marginer";
import { AccountContext } from "./accountContext";
import {navigate} from 'hookrouter';
import {AuthContext} from "../../authContext";
import {toast} from "react-toastify";

const { REACT_APP_API_BACKEND } = process.env;

function OTPForm() {
    //state variables declared for otp generation
    const [country, setCountry] = useState("");
    const [number, setNumber] = useState("");
    const [submitEnable, setEnabled] = useState(false);
    const [screen, setScreen] = useState("send");
    const [code, setCode] = useState("");

    const {authUpdate} = useContext(AuthContext);

    const success = () => toast.success("Login Successful !");

    //this function is called when user updates the 
    function onCountryChange(c) {
        let val = c.target.value;
        console.log('Country code changed: ${val}');
        setCountry(val);
        setEnabled(val.length > 0 && number.length > 0);
    }
    //when user enters the number this function is called
    function onNumberChange(n) {
        let val = n.target.value;
        setNumber(val);
        setEnabled(val.length > 0 && country.length > 0);
    }
    //when the country code changes this function is called
    function onCodeChanged(c) {
        let val = c.target.value;
        console.log(val);
        setCode(val);
        setEnabled(val.length > 0);
    }

    //this function is used to send OTP to the users who has requested to
    async function onSendOTP() {
        if (!submitEnable) return;
        console.log(`Country Code: ${country}, Number: ${number}`);
        let requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'countryCode': country, 'number': number}),
        };
        console.log(`${REACT_APP_API_BACKEND}/auth/otp/send`);
        let res = await fetch(`${REACT_APP_API_BACKEND}/auth/otp/send`, requestOptions);
        console.log(res.status);
        if (res.status === 200) {
            setCountry("");
            setNumber("");
            setScreen("verify");
        }
    }
    //this function will verify the otp entered by the user
    async function onVerifyOTP() {
        console.log(`Code: ${code}`);
        let requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'code': code}),
        };
        let res = await fetch(`${REACT_APP_API_BACKEND}/auth/otp/verify`, requestOptions);
        console.log(res.status);
        if (res.status === 200) {
            success();
            setCode("");
            authUpdate(true);
            navigate("/map", true);
        }
    }

    const {switchToSignin, switchToSignUp} = useContext(AccountContext);
    //method to render the otp box
    return (
        <BoxContainer>
            {screen === "send" && (
                <FormContainer>
                    <Input value={country} type="country" placeholder="Country Code" onChange={onCountryChange} />
                    <Input value={number} type="number" placeholder="Number" onChange={onNumberChange} />
                </FormContainer>
            )}
            {screen === "verify" && (
                <FormContainer>
                    <Input value={code} type="code" placeholder="OTP Received" onChange={onCodeChanged} />
                </FormContainer>
            )}
            <Marginer direction="vertical" margin={10} />
            <MutedLink href="#">Forgot your password?</MutedLink>
            <Marginer direction="vertical" margin="1.6em" />
            {screen === "send" && (<SubmitButton enabled={submitEnable} type="sendOTP" onClick={onSendOTP}>Send OTP</SubmitButton>)}
            {screen === "verify" && (<SubmitButton enabled={true} type="verifyOTP" onClick={onVerifyOTP}>Verify OTP</SubmitButton>)}
            <Marginer direction="vertical" margin="1em" />
            <MutedLink href="#">
                Return{" "}
                <BoldLink href="#" onClick={switchToSignin}>
                    Signin
                </BoldLink>
            </MutedLink>
            <MutedLink href="#">
                Don't have an account?{" "}
                <BoldLink href="#" onClick={switchToSignUp}>
                    Sign up
                </BoldLink>
            </MutedLink>
        </BoxContainer>
    );
}

export default OTPForm;