import React, {useState, useEffect} from "react";
import SideNav, {MenuIcon} from "react-simple-sidenav";
import Session from "react-session-api";
import {navigate} from "hookrouter";

function NavBar() {
    const [showNav, setNav] = useState(false);
    const [page, setPage] = useState("/");

    useEffect(() => {
        console.log(Session.get("email"));
    }, []);

    const handleClick = state => {
        setNav(!showNav);
    }

    useEffect(() => {
        navigate(page);
        console.log("Current page: ", page);
    }, [page]);

    return(
        <>
            <MenuIcon style={{marginLeft: '10px', backgroundColor: 'rgba(31, 138, 112, 1)'}} onClick={handleClick}/>
            <SideNav
                showNav        =  {showNav}
                onHideNav      =  {handleClick}
                title          =  "PARK-IT"
                items          =  {[
                    <a name="home" style={{textDecoration:'none', color :'black'}} onClick={() => setPage("/map")}>Home</a>,
                    <a name="history" style={{textDecoration:'none', color :'black'}} onClick={() => setPage("/history")}>History</a>,
                    <a name="logout" style={{textDecoration:'none', color :'black'}} onClick={() => setPage("/")}>LOGOUT</a>

                ]}
                titleStyle     =  {{backgroundColor: 'rgba(31, 138, 112, 1)'}}
                itemStyle      =  {{backgroundColor: '#fff', listStyleType:'none'}}
                itemHoverStyle =  {{backgroundColor: 'rgba(70, 64, 253, 1)'}}
            />
        </>
    );
}

export default NavBar;