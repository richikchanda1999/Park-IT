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
import {navigate} from 'hookrouter';
import Session from "react-session-api";
import {AuthContext} from "../../authContext";
import {toast} from "react-toastify";

const {REACT_APP_API_BACKEND} = process.env;

function LoginForm(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitEnable, setEnabled] = useState(false);
    const {switchToSignup, switchToOTP} = useContext(AccountContext);
    const {authUpdate} = useContext(AuthContext);

    function onEmailChange(e) {
        let val = e.target.value;
        setEmail(val);
        setEnabled(password.length > 0 && val.length > 0);
    }

    function onPasswordChange(p) {
        let val = p.target.value;
        setPassword(val);
        setEnabled(email.length > 0 && val.length > 0);
    }

    const success = () => toast.success("Login Successful !");
    const emailNotPresent = () => toast.error("Email ID not present! Please sign up");
    const passwordIncorrect = () => toast.error("Password Incorrect!");

    async function onLogin(authUpdate) {
        if (!submitEnable) return;
        console.log(`Email: ${email}, Password: ${password}`);
        let requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'email': email, 'password': password}),
        };
        let res = await fetch(`${REACT_APP_API_BACKEND}/manager/auth/sign_in`, requestOptions);
        console.log(res.status);
        if (res.status === 200) {
            console.log(1);
            success();
            console.log(2);
            const data = await res.json();
            console.log(3);
            console.log(data);
            Session.set("email", data.email);
            console.log(4);

            Session.set("user_id", data._id);
            console.log(5);

            Session.set("name", data.firstName + " " + data.lastName);
            console.log(6);

            setEmail("");
            console.log(7);

            setPassword("");
            console.log(8);

            authUpdate(true);
            console.log(9);

            navigate('/start', true);
            console.log(10);

            return true;
        } else if (res.status === 598) {
            emailNotPresent();
        } else if (res.status === 599) {
            passwordIncorrect();
        }
        authUpdate(false);
        return false;
    }

    return <BoxContainer>
        <FormContainer>
            <Input value={email} type="email" placeholder="Email" onChange={onEmailChange}/>
            <Input value={password} type="password" placeholder="Password" onChange={onPasswordChange}/>
        </FormContainer>
        <Marginer direction="vertical" margin={10}/>
        <MutedLink href="#">Forget your password?</MutedLink>
        <Marginer direction="vertical" margin="1.6em"/>
        <SubmitButton enabled={submitEnable} type="submit" onClick={() => onLogin(authUpdate)}>Sign In</SubmitButton>
        <Marginer direction="vertical" margin="1em"/>
        <MutedLink href="#">
            Login using {" "}
            <BoldLink href="#" onClick={switchToOTP}>
                OTP
            </BoldLink>
        </MutedLink>
        <MutedLink href="#">
            Don't have an account?{" "}
            <BoldLink href="#" onClick={switchToSignup}>
                Signup
            </BoldLink>
        </MutedLink>
    </BoxContainer>
}

export default LoginForm;