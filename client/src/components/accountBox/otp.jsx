import React, { Component } from "react";
import {
    BoldLink,
    BoxContainer,
    FormContainer,
    Input,
    MutedLink,
    SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { withRouter } from "react-router";
const { REACT_APP_API_BACKEND } = process.env;

class _OTPForm extends Component {

    constructor(props) {
        super(props);
        this.state = { country: "", number: "", submitEnable: false, screen: "send", code: "" };
        this.onCountryChange = this.onCountryChange.bind(this);
        this.onNumberChange = this.onNumberChange.bind(this);
        this.onSendOTP = this.onSendOTP.bind(this);
        this.onCodeChanged = this.onCodeChanged.bind(this);
        this.onVerifyOTP = this.onVerifyOTP.bind(this);
    }

    onCountryChange(c) {
        let val = c.target.value;
        console.log('Country code changed: ${val}');
        this.setState((state, props) => ({ country: val, submitEnable: state.number.length > 0}));
    }

    onNumberChange(n) {
        let val = n.target.value;
        this.setState((state, props) => ({ number: val, submitEnable: val.length > 0 }));
    }

    onCodeChanged(c) {
        let val = c.target.value;
        console.log(val);
        this.setState({code: val});
    }

    async onSendOTP() {
        if (!this.state.submitEnable) return;
        let c = this.state.country;
        let n = this.state.number;
        console.log(`Country Code: ${c}, Number: ${n}`);
        let requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'countryCode': c, 'number': n}),
        };
        let res = await fetch(`${REACT_APP_API_BACKEND}/auth/otp/send`, requestOptions);
        console.log(res.status);
        if (res.status === 200) {
            this.setState({ country: "", number: "", screen: "verify" });
        }
    }

    async onVerifyOTP() {
        let c = this.state.code;
        console.log(`Code: ${c}`);
        let requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'code': c}),
        };
        let res = await fetch(`${REACT_APP_API_BACKEND}/auth/otp/verify`, requestOptions);
        console.log(res.status);
        if (res.status === 200) {
            this.setState({ code: "" });
            this.props.history.push("/map");
        }
    }

    render() {
        return (
            <BoxContainer>
                {this.state.screen === "send" && (
                    <FormContainer>
                        <Input value={this.state.country} type="country" placeholder="Country Code" onChange={this.onCountryChange} />
                        <Input value={this.state.password} type="number" placeholder="Number" onChange={this.onNumberChange} />
                    </FormContainer>
                )}
                {this.state.screen === "verify" && (
                    <FormContainer>
                        <Input value={this.state.code} type="code" placeholder="OTP Received" onChange={this.onCodeChanged} />
                    </FormContainer>
                )}
                <Marginer direction="vertical" margin={10} />
                <MutedLink href="#">Forgot your password?</MutedLink>
                <Marginer direction="vertical" margin="1.6em" />
                {this.state.screen === "send" && (<SubmitButton enabled={this.state.submitEnable} type="sendOTP" onClick={this.onSendOTP}>Send OTP</SubmitButton>)}
                {this.state.screen === "verify" && (<SubmitButton enabled={true} type="verifyOTP" onClick={this.onVerifyOTP}>Verify OTP</SubmitButton>)}
                <Marginer direction="vertical" margin="1em" />
                <MutedLink href="#">
                    Return{" "}
                    <AccountContext.Consumer>
                        {({ setActive }) => (
                            <BoldLink href="#" onClick={() => setActive("signin")}>
                                Back
                            </BoldLink>
                        )}
                    </AccountContext.Consumer>
                </MutedLink>
                <MutedLink href="#">
                    Don't have an account?{" "}
                    <AccountContext.Consumer>
                        {({ setActive }) => (
                            <BoldLink href="#" onClick={() => setActive("signup")}>
                                Signup
                            </BoldLink>
                        )}
                    </AccountContext.Consumer>
                </MutedLink>
            </BoxContainer>
        );
    }
}

const OTPForm = withRouter(_OTPForm);
export { OTPForm };