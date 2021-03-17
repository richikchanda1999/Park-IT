import React, { Component, useState, useEffect, useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import mapStyles from "./mapStyles";
import SideNav, {MenuIcon} from 'react-simple-sidenav';
import { BookButton } from "./common";
import {navigate} from "hookrouter";

const { REACT_APP_GOOGLE_MAP_KEY_PAID, REACT_APP_GOOGLE_MAP_KEY_FREE, REACT_APP_API_BACKEND } = process.env;

function MyMap(props) {
    const [selectedPark, setSelectedPark] = useState(null);
    const [selectedParkCAP, setSelectedParkCAP] = useState(-1);
    const [selectedParkTPS, setSelectedParkTPS] = useState(-1);
    const [parkData, setParkData] = useState([]);
    const [show, setShow] = useState(false);
    const [map, setMap] = React.useState(null)

    let lotsFetched = false;
    let statusFetched = false;
    let mapRef = null;
    let markersMap = new Map();

    const containerStyle = {
        width: '100vw',
        height: '100vh'
    };

    const center = {
        lat: 22.572645,
        lng: 88.363892
    };

    const onLoad = useCallback(function callback(map) {
        setMap(map);
        console.log(map.zoom);
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    useEffect(() => {
        getParkingLots(22.572645, 88.363892);
    }, []);

    async function getParkingLots(latitude, longitude) {
        if (!lotsFetched) {
            lotsFetched = true;

            let requestOption = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'latitude': latitude, 'longitude': longitude }),
            };
            console.log(requestOption);
            let res = await fetch(`${REACT_APP_API_BACKEND}/map/nearby_coordinates`, requestOption);
            // console.log(res);
            if (res.status === 200) {
                let val = (await res.json())['parking_lots'];
                console.log(val);
                markersMap.clear();
                val.forEach((lot) => {
                    markersMap.set(lot['place_id'], lot);
                });
                let parkingData = [];
                for (let lot of markersMap.values()) parkingData.push(lot);
                setParkData(parkingData);
            }
            lotsFetched = false;
        }
    }

    async function getStatus(place_id) {
        if (!statusFetched) {
            let requestOption = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'place_id': place_id }),
            };
            console.log(requestOption);
            let res = await fetch(`${REACT_APP_API_BACKEND}/map/get_live_status`, requestOption);
            // console.log(res);
            if (res.status === 200) {
                let val = await res.json();
                console.log(val);
                return val;
            }
            statusFetched = false;
        }
    }

    async function handleDrag() {
        let center = mapRef.getCenter();
        console.log(center);
        await getParkingLots(center.lat(), center.lng());
    }

    async function booking_nav(){
        console.log(selectedPark)
        // var id=state.selectedPark['place_id'];
        navigate('/booking', false, {selectedPark: selectedPark});
        // props.history.push({pathname: "/booking", state: {selectedPark: selectedPark}});
        //"/booking",{selectedPark:state.selectedPark});
    }

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: REACT_APP_GOOGLE_MAP_KEY_PAID
    })

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{styles: mapStyles}}
        >

            {parkData.map(park => (
                <Marker
                    key={park['latitude'] + " " + park['longitude']}
                    position={{
                        lat: park['latitude'],
                        lng: park['longitude']
                    }}
                    onClick={async () => {
                        let ret = await getStatus(park['place_id']);
                        setSelectedPark(park);
                        setSelectedParkCAP(ret['CAP']);
                        setSelectedParkTPS(ret['TPS']);
                    }}
                />
            ))}

            {selectedPark && (
                <InfoWindow
                    position={{
                        lat: selectedPark['latitude'],
                        lng: selectedPark['longitude']
                    }}
                    onCloseClick={() => {
                        setSelectedPark(null);
                    }}
                >
                    <div>
                        <h4>{selectedPark['name']}</h4>
                        <p>Current status: {selectedParkCAP} / {selectedParkTPS}</p>
                        <BookButton type="submit" onClick={booking_nav}>BOOK</BookButton>
                    </div>


                </InfoWindow>
            )}
            { /* Child components, such as markers, info windows, etc. */ }
            <></>
        </GoogleMap>
    ) : <></>
}

class Navabc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNav: false
        }
    }

    handleClick = state => {
        this.setState({
            showNav: !this.state.showNav
        });
    }
    render(){
        return(
            <div>
                <MenuIcon style={{marginLeft: '10px'}} onClick={this.handleClick}/>
                <SideNav
                    showNav        =  {this.state.showNav}
                    onHideNav      =  {this.handleClick}
                    title          =  "PARK-IT"
                    items          =  {[
                        <a style={{textDecoration:'none', color :'black'}} href=''>Home</a>,
                        <a style={{textDecoration:'none', color :'black'}} href=''>History</a>,
                        <a style={{textDecoration:'none', color :'black'}} href=''>LOGOUT</a>
                    ]}
                    titleStyle     =  {{backgroundColor: 'rgba(31, 138, 112, 1)'}}
                    itemStyle      =  {{backgroundColor: '#fff', listStyleType:'none'}}
                    itemHoverStyle =  {{backgroundColor: 'rgba(70, 64, 253, 1)'}}
                />
            </div>
        );
    }
}

export default memo(MyMap);