import React, {useState, useEffect, useCallback, useContext} from "react";
import SideNav, {MenuIcon} from "react-simple-sidenav";
import Session from "react-session-api";
import {navigate} from "hookrouter";
import {toast} from "react-toastify";
import {AuthContext} from "../../authContext";

//navBar is used to show the contents where user can go to 

function NavBar() {
    //state variables declares for the Nav bar
    const [showNav, setNav] = useState(false);
    const [page, setPage] = useState("/");

    const {authUpdate} = useContext(AuthContext);

    useEffect(() => {
        console.log("Current page: ", page);
    }, [page]);

    const handleClick = state => {
        setNav(!showNav);
    }

    // this callback function will set the navigation page to home when gotoHome is called
    const gotoHome = useCallback(() => {
        if (page !== "/map") {
            setPage("/map");
            navigate("/map");
        }
        setNav(false);
    }, []);

    //this callback function will set the navigation page to history when the history button is pressed
    const gotoHistory = useCallback(() => {
        if (page !== "/history") {
            setPage("/history");
            navigate("/history");
        }
        setNav(false);
    }, []);

    //this callback function will set the navigation page to sign in page and user's session will be lushed out
    const logout = useCallback(() => {
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
                    <a name="home" style={{textDecoration:'none', color :'black'}} onClick={gotoHome}>Home</a>,
                    <a name="history" style={{textDecoration:'none', color :'black'}} onClick={gotoHistory}>History</a>,
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