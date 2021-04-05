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
import {AccountContext} from "./accountContext";
import {toast} from "react-toastify";

const { REACT_APP_API_BACKEND } = process.env;

function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitEnable, setEnabled] = useState(false);
  const { switchToSignin } = useContext(AccountContext);

  function onLastNameChange(ln) {
    let val = ln.target.value;
    setLastName(val);
    setEnabled(password.length > 0 && firstName.length > 0 && email.length > 0 && confirmPassword.length > 0 && val.length > 0);
  }

  function onFirstNameChange(fn) {
    let val = fn.target.value;
    setFirstName(val);
    setEnabled(password.length > 0 && lastName.length > 0 && email.length > 0 && confirmPassword.length > 0 && val.length > 0);
  }

  function onEmailChange(e) {
    let val = e.target.value;
    setEmail(val);
    setEnabled(password.length > 0 && firstName.length > 0 && lastName.length > 0 && confirmPassword.length > 0 && val.length > 0);
  }

  function onPasswordChange(p) {
    let val = p.target.value;
    setPassword(val);
    setEnabled(firstName.length > 0 && lastName.length > 0 && email.length > 0 && confirmPassword.length > 0 && val.length > 0);
  }

  function onConfirmPasswordChange(p) {
    let val = p.target.value;
    setConfirmPassword(val);
    setEnabled(password.length > 0 && firstName.length > 0 && lastName.length > 0 && email.length > 0 && val.length > 0);
  }

  async function onSignUp() {
    if (!submitEnable) return;
    console.log(`FirstName: ${firstName},LastName: ${lastName}, Email: ${email}, Password: ${password}`);
    let requestOption = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'firstName': firstName, 'lastName': lastName, 'email': email, 'password': password, 'confirmPassword': confirmPassword }),
    };
    let res = await fetch(`${REACT_APP_API_BACKEND}/auth/sign_up`, requestOption);
    console.log(res.status);
    console.log(res.body);
    if (res.status === 200) {
      toast.success("Successfuly created Account!");
      toast.success("Please Log In Now!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
    if(res.status === 499)
    {
      toast.error("Password and Confirm Password not same!");
    }
    if(res.status === 498)
    {
      toast.error("User Already present!");
      toast.error("Please Sign In!");
    }
  }

  return (
      <BoxContainer>
        <FormContainer>
          <Input value={firstName} type="text" placeholder="First Name" onChange={onFirstNameChange} />
          <Input value={lastName} type="text" placeholder="Last Name" onChange={onLastNameChange} />
          <Input value={email} type="email" placeholder="Email" onChange={onEmailChange} />
          <Input value={password} type="password" placeholder="Password" onChange={onPasswordChange} />
          <Input value={confirmPassword} type="password" placeholder="Confirm Password" onChange={onConfirmPasswordChange} />
        </FormContainer>
        <Marginer direction="vertical" margin={10} />
        <SubmitButton enabled={submitEnable} type="submit" onClick={onSignUp}>Sign up</SubmitButton>
        <Marginer direction="vertical" margin="1em" />
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
