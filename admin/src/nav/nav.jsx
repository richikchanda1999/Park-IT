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

    const gotoManager = useCallback(() => {
        if (page !== "/") {
            setPage("/");
            navigate("/");
        }
        setNav(false);
    }, []);

    const gotoUser = useCallback(() => {
        if (page !== "/user") {
            setPage("/user");
            navigate("/user");
        }
        setNav(false);
    }, []);

    const gotoParking = useCallback(() => {
        if (page !== "/parking") {
            setPage("/parking");
            navigate("/parking");
        }
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
                    <a name="manager" style={{textDecoration:'none', color :'black'}} onClick={gotoManager}>Manager</a>,
                    <a name="user" style={{textDecoration:'none', color :'black'}} onClick={gotoUser}>User</a>,
                    <a name="parking" style={{textDecoration:'none', color :'black'}} onClick={gotoParking}>Parking</a>,
                ]}
                titleStyle     =  {{backgroundColor: 'rgba(31, 138, 112, 1)'}}
                itemStyle      =  {{backgroundColor: '#fff', listStyleType:'none'}}
                itemHoverStyle =  {{backgroundColor: 'rgba(70, 64, 253, 1)'}}
            />
        </>
    );
}

export default NavBar;