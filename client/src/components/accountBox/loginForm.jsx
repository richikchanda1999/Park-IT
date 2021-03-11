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
import {AuthContext} from "../../App";
const { REACT_APP_API_BACKEND } = process.env;

class _LoginForm extends Component {
  static contextType = AccountContext;

  constructor(props) {
    super(props);
    this.state = { email: "", password: "", submitEnable: false };
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onEmailChange(e) {
    let val = e.target.value;
    this.setState((state, props) => ({ email: val, submitEnable: state.password.length > 0 && val.length > 0 }));
  }

  onPasswordChange(p) {
    let val = p.target.value;
    this.setState((state, props) => ({ password: val, submitEnable: state.email.length > 0 && val.length > 0 }));
  }

  async onLogin() {
    if (!this.state.submitEnable) return;
    let e = this.state.email;
    let p = this.state.password;
    console.log(`Email: ${e}, Password: ${p}`);
    let requestOptions = {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'email': e, 'password': p}),
    };
    let res = await fetch(`${REACT_APP_API_BACKEND}/auth/sign_in`, requestOptions);
    console.log(res.status);
    if (res.status === 200) {
      this.setState({ email: "", password: "" });
      this.props.history.push({
        pathname: "/map",
        state: {
          test: 'test'
        }
      });
      return true;
    }
    return false;
  }

  render() {
    return (
      <BoxContainer>
        <FormContainer>
          <Input value={this.state.email} type="email" placeholder="Email" onChange={this.onEmailChange} />
          <Input value={this.state.password} type="password" placeholder="Password" onChange={this.onPasswordChange} />
        </FormContainer>
        <Marginer direction="vertical" margin={10} />
        <MutedLink href="#">Forget your password?</MutedLink>
        <Marginer direction="vertical" margin="1.6em" />
        <AuthContext.Consumer>
          {({ authUpdate }) => (
              <SubmitButton enabled={this.state.submitEnable} type="submit" onClick={() => authUpdate(this.onLogin())}>Sign In</SubmitButton>
          )}
        </AuthContext.Consumer>
        <Marginer direction="vertical" margin="1em" />
        <MutedLink href="#">
          Login using {" "}
          <AccountContext.Consumer>
            {({ setActive }) => (
                <BoldLink href="#" onClick={() => setActive("otp")}>
                  OTP
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

const LoginForm = withRouter(_LoginForm);
export { LoginForm };