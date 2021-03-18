import React, {useState, useEffect, useCallback, useContext} from "react";
import SideNav, {MenuIcon} from "react-simple-sidenav";
import Session from "react-session-api";
import {navigate} from "hookrouter";
import {toast} from "react-toastify";
import {AuthContext} from "../../authContext";

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

    const gotoHome = useCallback(() => {
        if (page !== "/map") {
            setPage("/map");
            navigate("/map");
        }
        setNav(false);
    }, []);

    const gotoHistory = useCallback(() => {
        if (page !== "/history") {
            setPage("/history");
            navigate("/history");
        }
        setNav(false);
    }, []);

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
                itemHoverStyle =  {{backgroundColor: 'rgba(70, 64, 253, 1)'}}
            />
        </>
    );
}

export default NavBar;