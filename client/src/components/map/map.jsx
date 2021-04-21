import React, {useState, useEffect, useCallback, memo} from 'react';
import {GoogleMap, useJsApiLoader, Marker, InfoWindow} from '@react-google-maps/api';
import mapStyles from "./mapStyles";
import {BookButton} from "./common";
import {navigate} from "hookrouter";
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
} from 'react-places-autocomplete';
import "./autocompleteStyle.css";
import { classnames } from './helpers';
import Autocomplete from 'react-google-autocomplete';
import FloatingComponent from "react-floating-component";
import {toast} from "react-toastify";

const {REACT_APP_GOOGLE_MAP_KEY_PAID, REACT_APP_API_BACKEND} = process.env;
const libraries = ["places"];

function MyMap(props) {
    //rendering the state variables to be used in the maps
    const [selectedPark, setSelectedPark] = useState(null);
    const [selectedParkCAP, setSelectedParkCAP] = useState(-1);
    const [selectedParkTPS, setSelectedParkTPS] = useState(-1);
    const [parkData, setParkData] = useState([]);
    const [map, setMap] = useState(null);
    const [center, setMapCenter] = useState({lat: 22.572645, lng: 88.363892});
    const [address, setAddress] = useState("");
    const [radius, setRadius] = useState(2.0);
    let lotsFetched = false;
    let statusFetched = false;
    let markersMap = new Map();

    const containerStyle = {
        width: '100vw',
        height: '100vh'
    };

    // this function helps to bring the current location of the map and render the map arround that coordinate
    const onLoad = useCallback(function callback(map) {
        setMap(map);
        console.log(map.zoom);
    }, [])

    //this is a lifecycle method of the react which will unmount the map 
    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, []);

    //this function is used to render the map initially when map renders
    useEffect(() => {
        console.log("Map center changed to: ", center);
        getParkingLots();
    }, [center]);

    useEffect(() => {}, []);

    //this function helps to get the parking lots nearby the coordinates selected by the user in 2 km radius
    async function getParkingLots() {
        if (!lotsFetched) {
            lotsFetched = true;

            let requestOption = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'latitude': center['lat'], 'longitude': center['lng'], 'radius': radius}),
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

    // this function gets the current status of the parking lot i.e occupied parking lots/total parking lots
    async function getStatus(place_id) {
        if (!statusFetched) {
            let requestOption = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'place_id': place_id}),
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

    //this will change the map's center point coordinate and would thus render the new sets of parking lot according to it
    async function handleDrag() {
        let center = map.getCenter();
        setMapCenter({lat: center.lat(), lng: center.lng()});
        console.log(center.lat(), center.lng());
    }
    
    //this function is used to navigate the website to the booking webpage and would carry forward the detail of the parking id which the user want to book it
    async function booking_nav() {
        console.log(selectedPark);
        if (selectedParkCAP > 0) {
            navigate('/booking', false, {selectedPark: selectedPark});
        }
        else {
            toast.error("Oops!!! No space available in this parking lot!");
        }
    }

    //this is the function which changes the data according to the change in the location in location finder
    // it will change the geocode Address according to the location selected
    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        // console.log(latLng);
        setAddress(value);
        setMapCenter(latLng);
        await getParkingLots();
    }

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: REACT_APP_GOOGLE_MAP_KEY_PAID,
        libraries: libraries
    })

    //this function is use to do a autoComplete location finder which would find a specific location based on the the words entered it would recommend users about the location
    function autoComplete() {
        console.log("HERE!");
        return (
            <PlacesAutocomplete
                onChange={setAddress}
                value={address}
                onSelect={handleSelect}
                shouldFetchSuggestions={address.length > 2}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                    return (
                        <div className="Demo__search-bar-container">
                            <div className="Demo__search-input-container">
                                <input
                                    {...getInputProps({
                                        placeholder: 'Type Address...',
                                        className: 'Demo__search-input',
                                    })}
                                />
                            </div>
                            {suggestions.length > 0 && (
                                <div className="Demo__autocomplete-container">
                                    {suggestions.map(suggestion => {
                                        const className = classnames('Demo__suggestion-item', {
                                            'Demo__suggestion-item--active': suggestion.active,
                                        });

                                        return (
                                            /* eslint-disable react/jsx-key */
                                            <div
                                                {...getSuggestionItemProps(suggestion, { className })}
                                            >
                                                <strong>
                                                    {suggestion.formattedSuggestion.mainText}
                                                </strong>{' '}
                                                <small>
                                                    {suggestion.formattedSuggestion.secondaryText}
                                                </small>
                                            </div>
                                        );
                                        /* eslint-enable react/jsx-key */
                                    })}
                                    <div className="Demo__dropdown-footer">
                                        <div>
                                            <img
                                                src={require('./powered_by_google_default.png')}
                                                className="Demo__dropdown-footer-image"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }}
            </PlacesAutocomplete>
        );
    }

    // loading the map
    return isLoaded ? (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{styles: mapStyles}}
                onDragEnd={handleDrag}
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
                            <p>Current status: {Math.max(selectedParkTPS - selectedParkCAP, 0)} / {selectedParkTPS}</p>
                            <BookButton type="submit" onClick={booking_nav}>BOOK</BookButton>
                        </div>
                    </InfoWindow>
                )}
                <FloatingComponent>{autoComplete()}</FloatingComponent>
            </GoogleMap>
        </div>
    ) : <></>
}

export default memo(MyMap);