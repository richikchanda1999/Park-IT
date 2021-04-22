import React, {useState, useContext} from "react";
import {
    BoldLink,
    BoxContainer,
    FormContainer,
    Input,
    MutedLink,
    SubmitButton,
} from "./common";
import Marginer from "../marginer";
import {AccountContext} from "./accountContext";
import {toast} from 'react-toastify';

const {REACT_APP_API_BACKEND} = process.env;

function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitEnable, setEnabled] = useState(false);
    const [number, setNumber] = useState("");
    const [parkingLotID, setparkingLotID] = useState("");
    const {switchToSignin} = useContext(AccountContext);

    function onNameChange(fn) {                 // Changes name as it is typed
        let val = fn.target.value;
        setName(val);
        setEnabled(password.length > 0 && email.length > 0 && confirmPassword.length > 0 && parkingLotID > 0 && val.length > 0 && number.length > 0);
    }

    function onEmailChange(e) {                 // Changes Email as it is typed
        let val = e.target.value;
        setEmail(val);
        setEnabled(password.length > 0 && name.length > 0 && confirmPassword.length > 0 && parkingLotID > 0 && val.length > 0 && number.length > 0);
    }

    function onPasswordChange(p) {                 // Changes password as it is typed
        let val = p.target.value;
        setPassword(val);
        setEnabled(name.length > 0 && email.length > 0 && confirmPassword.length > 0 && parkingLotID > 0 && val.length > 0 && number.length > 0);
    }

    function onConfirmPasswordChange(p) {                 // Changes comfirm Password as it is typed
        let val = p.target.value;
        setConfirmPassword(val);
        setEnabled(password.length > 0 && name.length > 0 && email.length > 0 && parkingLotID > 0 && val.length > 0 && number.length > 0);
    }

    function onNumberChange(p) {                 // Changes Phone Number as it is typed
        let val = p.target.value;
        setNumber(val);
        setEnabled(password.length > 0 && name.length > 0 && email.length > 0 && parkingLotID > 0 && val.length > 0 && confirmPassword.length > 0);
    }

    function onParkingLotIDChange(id) {                 // Changes Parking Lot ID as it is typed
        let val = id.target.value;
        setparkingLotID(val);
        setEnabled(password.length > 0 && name.length > 0 && email.length > 0 && number.length > 0 && val.length > 0 && confirmPassword.length > 0);
    }

    async function onSignUp() {                 // Updating Details in the Data-Base
        if (!submitEnable) return;
        console.log(`Name: ${name},Number:${number} Email: ${email}, Password: ${password}`);
        let requestOption = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'name': name,
                'number': number,
                'email': email,
                'password': password,
                'confirmPassword': confirmPassword,
                'parkingLot': parkingLotID
            }),
        };
        let res = await fetch(`${REACT_APP_API_BACKEND}/manager/auth/sign_up`, requestOption);
        console.log(res.status);
        console.log(res.body);
        if (res.status === 200) {
            toast.success("Successfuly created Account!");
            toast.success("Please Log In Now!");
            setName("");
            setEmail("");
            setNumber("");
            setPassword("");
            setConfirmPassword("");
        }
        if (res.status === 499) {
            toast.error("Password and Confirm Password not same!");
        }
        if (res.status === 498) {
            toast.error("User Already present!");
            toast.error("Please Sign In!");
        } else if (res.status === 420) {
            toast.error("Enter a valid Email Id");
        }
    }

    return (
        <BoxContainer>
            <FormContainer>
                <Input value={name} type="text" placeholder="Name" onChange={onNameChange}/>
                <Input value={number} type="text" placeholder="Mobile No." onChange={onNumberChange}/>
                <Input value={email} type="email" placeholder="Email" onChange={onEmailChange}/>
                <Input value={password} type="password" placeholder="Password" onChange={onPasswordChange}/>
                <Input value={confirmPassword} type="password" placeholder="Confirm Password"
                       onChange={onConfirmPasswordChange}/>
                <Input value={parkingLotID} type="text" placeholder="Parking Lot ID"
                       onChange={onParkingLotIDChange}/>
            </FormContainer>
            <Marginer direction="vertical" margin={10}/>
            <SubmitButton enabled={submitEnable} type="submit" onClick={onSignUp}>Sign up</SubmitButton>
            <Marginer direction="vertical" margin="1em"/>
            <MutedLink href="#">
                Already have an account?
                <BoldLink href="#" onClick={switchToSignin}>
                    Signin
                </BoldLink>
            </MutedLink>
        </BoxContainer>
    );
}

export default SignUpForm;
