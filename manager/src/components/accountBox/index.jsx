import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LoginForm from "./loginForm";
import { motion } from "framer-motion";
import { AccountContext } from "./accountContext";
import SignupForm from "./signupForm";
import OTPForm from "./otp";


const BoxContainer = styled.div`
  width: 280px;
  height: 75%;
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

function AccountBox() {
  const [isExpanded, setExpanded] = useState(false);
  const [active, setActive] = useState("signin");

  const backdropVariants = {
    expanded: {
      width: "233%",
      height: "180%",
      borderRadius: "20%",
      transform: "rotate(60deg)",
    },
    collapsed: {
      width: "160%",
      height: "95%",
      borderRadius: "50%",
      transform: "rotate(60deg)",
    },
  };

  const expandingTransition = {
    type: "spring",
    duration: 2.3,
    stiffness: 30,
  };

  function playExpandingAnimation() {                    // To Play Animation
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, expandingTransition.duration * 1000 - 1500);
  }

  function switchToSignup() {                    // Changes to SignUp screen
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signup");
    }, 400);
  }

  function switchToSignin() {                    // Changes to SignIn screen
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signin");
    }, 400);
  }

  function switchToOTP() {                    // Changes to OTP screen
    playExpandingAnimation();
    setTimeout(() => {
      setActive("otp");
    }, 400);
  }

  function setActiveScreen() {
    if (active === "signup") switchToSignup();
    else if (active === "signin") switchToSignin();
    else if (active === "otp") switchToOTP();
  }

  useEffect(setActiveScreen, [active]);

  const contextValue = {switchToSignin, switchToSignup, switchToOTP};

  return (
      <AccountContext.Provider value={contextValue}>
        <BoxContainer>
          <TopContainer>
            <BackDrop
                initial={false}
                animate={isExpanded ? "expanded" : "collapsed"}
                variants={backdropVariants}
                transition={expandingTransition}
            />
            {active === "signin" && (
                <HeaderContainer>
                  <HeaderText>Welcome</HeaderText>
                  <HeaderText>Back</HeaderText>
                  <SmallText>Please sign-in to continue!</SmallText>
                </HeaderContainer>
            )}
            {active === "signup" && (
                <HeaderContainer>
                  <HeaderText>Create</HeaderText>
                  <HeaderText>Account</HeaderText>
                  <SmallText>Please sign-up to continue!</SmallText>
                </HeaderContainer>
            )}
            {active === "otp" && (
                <HeaderContainer>
                  <HeaderText>Welcome</HeaderText>
                  <HeaderText>Back</HeaderText>
                  <SmallText>Enter your number to continue!</SmallText>
                </HeaderContainer>
            )}
          </TopContainer>
          <InnerContainer>
            {active === "signin" && <LoginForm />}
            {active === "signup" && <SignupForm />}
            {active === "otp" && <OTPForm />}
          </InnerContainer>
        </BoxContainer>
      </AccountContext.Provider>
  );
}

export default AccountBox;
