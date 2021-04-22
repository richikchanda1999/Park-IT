import React, {useState, useEffect, useCallback, useContext} from "react";
import SideNav, {MenuIcon} from "react-simple-sidenav";
//import Session from "react-session-api";
import {navigate} from "hookrouter";

function NavBar() {
    const [showNav, setNav] = useState(false);
    const [page, setPage] = useState("/");

    useEffect(() => {
        console.log("Current page: ", page);
    }, [page]);

    const handleClick = state => {
        setNav(!showNav);
    }

    const gotoManager = useCallback(() => {                     // Change to Details of Manager
        console.log("Called, Current page now: ", page);
        // if (page !== "/") {
        //     console.log("1");
        //     setPage("/");
        //     console.log("2");
        //     navigate("/");
        // }
        console.log("3");
        navigate("/");
        setNav(false);
        console.log("4");
    }, []);

    const gotoUser = useCallback(() => {                        // Change to Details of users
        console.log("Called, Current page now: ", page);
        // if (page !== "/user") {
        //     console.log("5");
        //     setPage("/user");
        //     console.log("6");
        //     navigate("/user");
        //     console.log("7");
        // }
        console.log("8");
        navigate("/user");
        setNav(false);
        console.log("9");
    }, []);

    const gotoParking = useCallback(() => {                      // Change to all parking lot status
        console.log("Called, Current page now: ", page);
        // if (page !== "/parking") {
        //     console.log("10");
        //     setPage("/parking");
        //     console.log("11");
        //     navigate("/parking");
        //     console.log("12");
        // }
        console.log("13");
        navigate("/parking");
        setNav(false);
        console.log("14");
    }, []);


    return(
        <>
            <MenuIcon style={{marginLeft: '10px', backgroundColor: 'rgba(31, 138, 112, 1)'}} onClick={handleClick}/>
            <SideNav
                showNav        =  {showNav}
                onHideNav      =  {handleClick}
                title          =  "PARK-IT"
                items          =  {[
                    <a name="manager" style={{textDecoration:'none', color :'black'}} onClick={gotoManager}>Manager</a>,
                    <a name="user" style={{textDecoration:'none', color :'black'}} onClick={gotoUser}>User</a>,
                    <a name="parking" style={{textDecoration:'none', color :'black'}} onClick={gotoParking}>Parking</a>,
                ]}
                titleStyle     =  {{backgroundColor: 'rgba(31, 138, 112, 1)'}}
                itemStyle      =  {{backgroundColor: '#fff', listStyleType:'none'}}
                itemHoverStyle =  {{backgroundColor: 'rgba(70, 64, 253, 1)',borderRadius: '60px 0px 0px 60px'}}
            />
        </>
    );
}

export default NavBar;