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
const { REACT_APP_API_BACKEND } = process.env;

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = { Firstname: "", LastName: "", email: "", password: "", confirmPassword: "", submitEnable: false };
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  onLastNameChange(ln) {
    let val = ln.target.value;
    this.setState((state, props) => ({
      LastName: val,
      submitEnable: state.password.length > 0 && state.Firstname.length > 0 && state.email.length > 0 && state.confirmPassword.length > 0 && val.length > 0
    }));
  }
  onFirstNameChange(fn) {
    let val = fn.target.value;

    this.setState((state, props) => ({
      Firstname: val,
      submitEnable: state.password.length > 0 && state.LastName.length > 0 && state.email.length > 0 && state.confirmPassword.length > 0 && val.length > 0
    }));
  }
  onEmailChange(e) {
    let val = e.target.value;
    this.setState((state, props) => ({
      email: val,
      submitEnable: state.password.length > 0 && state.Firstname.length > 0 && state.LastName.length > 0 && state.confirmPassword.length > 0 && val.length > 0
    }));
  }

  onPasswordChange(p) {
    let val = p.target.value;
    this.setState((state, props) => ({
      password: val,
      submitEnable: state.Firstname.length > 0 && state.LastName.length > 0 && state.email.length > 0 && state.password.length > 0 && state.confirmPassword.length > 0 && val.length > 0
    }));
  }

  onConfirmPasswordChange(p) {
    let val = p.target.value;
    this.setState((state, props) => ({
      confirmPassword: val,
      submitEnable: state.Firstname.length > 0 && state.LastName.length > 0 && state.email.length > 0 && state.password.length > 0 && val.length > 0 && state.password == val
    }));
  }

  async onSignUp() {
    if (!this.state.submitEnable) return;
    let fn = this.state.Firstname;
    let ln = this.state.LastName;
    let e = this.state.email;
    let p = this.state.password;
    console.log(`FirstName: ${fn},LastName: ${ln}, Email: ${e}, Password: ${p}`);
    let requestOption = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'FirstName': fn, 'LastName': ln, 'Email': e, 'Password': p, 'ConfirmPassword': p }),
    };
    let res = await fetch(`${REACT_APP_API_BACKEND}/auth/sign_up`, requestOption);
    console.log(res.status);
    console.log(res.body);
    if (res.status === 200) this.setState({ Firstname: "", LastName: "", email: "", password: "", confirmPassword: "" });
  }

  render() {
    return (
      <BoxContainer>
        <FormContainer>
          <Input value={this.state.Firstname} type="text" placeholder="First Name" onChange={this.onFirstNameChange} />
          <Input value={this.state.LastName} type="text" placeholder="Last Name" onChange={this.onLastNameChange} />
          <Input value={this.state.email} type="email" placeholder="Email" onChange={this.onEmailChange} />
          <Input value={this.state.password} type="password" placeholder="Password" onChange={this.onPasswordChange} />
          <Input value={this.state.confirmPassword} type="password" placeholder="Confirm Password" onChange={this.onConfirmPasswordChange} />
        </FormContainer>
        <Marginer direction="vertical" margin={10} />
        <SubmitButton enabled={this.state.submitEnable} type="submit" onClick={this.onSignUp}>Sign up</SubmitButton>
        <Marginer direction="vertical" margin="1em" />
        <MutedLink href="#">
          Already have an account?
          <AccountContext.Consumer>
            {({ setActive }) => (
              <BoldLink href="#" onClick={() => setActive("signin")}>
                Signin
              </BoldLink>
            )}
          </AccountContext.Consumer>
        </MutedLink>
      </BoxContainer>
    );
  }
}

export { SignupForm };
