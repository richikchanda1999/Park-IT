import React, { useState, useEffect, useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import mapStyles from "./mapStyles";
import { BookButton } from "./common";
import {navigate} from "hookrouter";
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
  } from 'react-places-autocomplete';
import Autocomplete from 'react-google-autocomplete';  
const { REACT_APP_GOOGLE_MAP_KEY_PAID, REACT_APP_API_BACKEND } = process.env;

function MyMap(props) {
    const [selectedPark, setSelectedPark] = useState(null);
    const [selectedParkCAP, setSelectedParkCAP] = useState(-1);
    const [selectedParkTPS, setSelectedParkTPS] = useState(-1);
    const [parkData, setParkData] = useState([]);
    const [map, setMap] = useState(null);
    const [center, setMapCenter] = useState({lat: 22.572645, lng: 88.363892});
    const [address,setAddress]= useState("");
    let lotsFetched = false;
    let statusFetched = false;
    let markersMap = new Map();

    const containerStyle = {
        width: '100vw',
        height: '100vh'
    };

    const onLoad = useCallback(function callback(map) {
        setMap(map);
        autoComplete();
        console.log(map.zoom);
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const getParkingLots = useCallback(async (latitude, longitude) => {
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
    }, []);

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
        let center = map.getCenter();
        setMapCenter({lat: center.lat(), lng: center.lng()});
        console.log(center.lat(), center.lng());
        await getParkingLots(center.lat(), center.lng());
    }

    async function booking_nav(){
        console.log(selectedPark);
        navigate('/booking', false, {selectedPark: selectedPark});
    }

    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setAddress(value);
        setMapCenter(latLng);
      }
   
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: REACT_APP_GOOGLE_MAP_KEY_PAID,
    })
    async function autoComplete()
    {
        // console.log("here");
        // return (
        //     <div>
        //       <PlacesAutocomplete
        //         value={address}
        //         onChange={setAddress}
        //         onSelect={handleSelect}
        //       >
        //         {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        //           <div>
        //             {/* <p>Latitude: {center.lat}</p>
        //             <p>Longitude: {center.lng}</p> */}
        
        //             <input {...getInputProps({ placeholder: "Type address" })} />
        
        //             <div>
        //               {loading ? <div>...loading</div> : null}
        
        //               {suggestions.map(suggestion => {
        //                 const style = {
        //                   backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
        //                 };
        
        //                 return (
        //                   <div {...getSuggestionItemProps(suggestion, { style })}>
        //                     {suggestion.description}
        //                   </div>
        //                 );
        //               })}
        //             </div>
        //           </div>
        //         )}
        //       </PlacesAutocomplete>
        //     </div>
        //   );

        var url=`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=1600+Amphitheatre&key=${REACT_APP_GOOGLE_MAP_KEY_PAID}&sessiontoken=1234567890`;

        let requestOption = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' ,"Access-Control-Allow-Origin": "*"},
        };
        console.log(requestOption);
        let res = await fetch(url, requestOption);
        // console.log(res);
        if (res.status === 200) {
            let val = await res.json();
            console.log(val);
        }
        

    }
    useEffect(() => {
        getParkingLots(22.572645, 88.363892);
    }, [getParkingLots]);

    return isLoaded ? (
        <React.Fragment>
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

                ///Autocomplete box would be present here
                
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
        </React.Fragment>       
    ) : <></>
}

export default memo(MyMap);