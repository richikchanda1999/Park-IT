import React, { Component, useState } from "react";
import styled from "styled-components";
import { LoginForm } from "./loginForm";
import { motion } from "framer-motion";
import { AccountContext } from "./accountContext";
import { SignupForm } from "./signupForm";
import {OTPForm} from "./otp";


const BoxContainer = styled.div`
  width: 280px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: rgba(0,0,0,0.4);
  backdrop-filter: blur(8.0px);
  -webkit-backdrop-filter: blur(8.0px);
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1.8em;
  padding-bottom: 5em;
`;

const BackDrop = styled(motion.div)`
  width: 160%;
  height: 550px;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  transform: rotate(60deg);
  top: -290px;
  left: -70px;
  background: rgba(70, 64, 253, 0.6);
  background: linear-gradient(
    58deg,
    rgba(70, 64, 253, 1) 20%,
    rgba(70, 64, 250, 1) 100%
  );
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.h2`
  font-size: 30px;
  font-weight: 600;
  line-height: 1.24;
  color: #fff;
  z-index: 10;
  margin: 0;
`;

const SmallText = styled.h5`
  color: #fff;
  font-weight: 500;
  font-size: 11px;
  z-index: 10;
  margin: 0;
  margin-top: 7px;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1.8em;
`;

class AccountBox extends Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false, active: "signin", setActive: this.setActive };
    this.playExpandingAnimation = this.playExpandingAnimation.bind(this);
    this.switchToSignup = this.switchToSignup.bind(this);
    this.switchToSignin = this.switchToSignin.bind(this);
  }

  setActive = active => {
    if (active === "signup") this.switchToSignup();
    else if (active === "signin") this.switchToSignin();
    else if (active === "otp") this.switchToOTP();
  };

  backdropVariants = {
    expanded: {
      width: "233%",
      height: "1050px",
      borderRadius: "20%",
      transform: "rotate(60deg)",
    },
    collapsed: {
      width: "160%",
      height: "550px",
      borderRadius: "50%",
      transform: "rotate(60deg)",
    },
  };

  expandingTransition = {
    type: "spring",
    duration: 2.3,
    stiffness: 30,
  };

  playExpandingAnimation() {
    this.setState({ isExpanded: true });
    setTimeout(() => {
      this.setState({ isExpanded: false });
    }, this.expandingTransition.duration * 1000 - 1500);
  };

  switchToSignup() {
    this.playExpandingAnimation();
    setTimeout(() => {
      this.setState({ active: "signup" });
    }, 400);
  };

  switchToSignin() {
    this.playExpandingAnimation();
    setTimeout(() => {
      this.setState({ active: "signin" });
    }, 400);
  };

  switchToOTP() {
    this.playExpandingAnimation();
    setTimeout(() => {
      this.setState({ active: "otp" });
    }, 400);
  }

  render() {
    return (
      <AccountContext.Provider value={this.state}>
        <BoxContainer>
          <TopContainer>
            <BackDrop
              initial={false}
              animate={this.state.isExpanded ? "expanded" : "collapsed"}
              variants={this.backdropVariants}
              transition={this.expandingTransition}
            />
            {this.state.active === "signin" && (
              <HeaderContainer>
                <HeaderText>Welcome</HeaderText>
                <HeaderText>Back</HeaderText>
                <SmallText>Please sign-in to continue!</SmallText>
              </HeaderContainer>
            )}
            {this.state.active === "signup" && (
              <HeaderContainer>
                <HeaderText>Create</HeaderText>
                <HeaderText>Account</HeaderText>
                <SmallText>Please sign-up to continue!</SmallText>
              </HeaderContainer>
            )}
            {this.state.active === "otp" && (
                <HeaderContainer>
                  <HeaderText>Welcome</HeaderText>
                  <HeaderText>Back</HeaderText>
                  <SmallText>Enter your number to continue!</SmallText>
                </HeaderContainer>
            )}
          </TopContainer>
          <InnerContainer>
            {this.state.active === "signin" && <LoginForm />}
            {this.state.active === "signup" && <SignupForm />}
            {this.state.active === "otp" && <OTPForm />}
          </InnerContainer>
        </BoxContainer>
      </AccountContext.Provider>
    );
  }
}

export { AccountBox };
