import React, {useState, useEffect, useCallback, useContext} from "react";
import SideNav, {MenuIcon} from "react-simple-sidenav";
import Session from "react-session-api";
import {navigate} from "hookrouter";
import {toast} from "react-toastify";
import {AuthContext} from "../authContext";

function NavBar() {
    const [showNav, setNav] = useState(false);
    const [page, setPage] = useState("/");

    const {authUpdate} = useContext(AuthContext);

    useEffect(() => {
        console.log("Current page: ", page);
    }, [page]);

    const handleClick = state => {
        setNav(!showNav);
    }

    const gotoHome = useCallback(() => {                // Change to home page
        if (page !== "/start") {
            setPage("/start");
            navigate("/start");
        }
        setNav(false);
    }, []);

    const gotoStatus = useCallback(() => {                // Change to Currrent Parking Status
        if (page !== "/parked") {
            setPage("/parked");
            navigate("/parked");
        }
        setNav(false);
    }, []);

    const logout = useCallback(() => {                      // Logout Function
        Session.clear();
        setPage("/");
        navigate("/", true);
        authUpdate(false);
        toast.success("Logout successful!");
        setNav(false);
    }, []);

    return(
        <>
            <MenuIcon style={{marginLeft: '10px', backgroundColor: 'rgba(31, 138, 112, 1)'}} onClick={handleClick}/>
            <SideNav
                showNav        =  {showNav}
                onHideNav      =  {handleClick}
                title          =  "PARK-IT"
                items          =  {[
                    <a name="home" style={{textDecoration:'none', color :'black'}} onClick={gotoHome}>HOME</a>,
                    <a name="status" style={{textDecoration:'none', color :'black'}} onClick={gotoStatus}>STATUS</a>,
                    <a name="logout" style={{textDecoration:'none', color :'black'}} onClick={logout}>LOGOUT</a>,
                ]}
                titleStyle     =  {{backgroundColor: 'rgba(31, 138, 112, 1)'}}
                itemStyle      =  {{backgroundColor: '#fff', listStyleType:'none'}}
                itemHoverStyle =  {{backgroundColor: 'rgba(70, 64, 253, 1)',borderRadius: '60px 0px 0px 60px'}}
            />
        </>
    );
}

export default NavBar;