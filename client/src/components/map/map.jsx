import React, { Component } from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker, InfoWindow } from 'react-google-maps';
import mapStyles from "./mapStyles";
import SideNav, {MenuIcon} from 'react-simple-sidenav';
import { withRouter } from "react-router";
import { BookButton } from "./common";

const { REACT_APP_GOOGLE_MAP_KEY_PAID, REACT_APP_GOOGLE_MAP_KEY_FREE, REACT_APP_API_BACKEND } = process.env;

class _MyMap extends Component {
    constructor(props) {
        super(props);
        console.log(props.st);
        this.state = { selectedPark: null, selectedParkCAP: -1, selectedParkTPS: -1, parkData: [] };
        this.getParkingLots = this.getParkingLots.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.booking_nav = this.booking_nav.bind(this);

        this.lotsFetched = false;
        this.statusFetched = false;
        this.mapRef = null;
        this.markersMap = new Map();
    }

    async getParkingLots(latitude, longitude) {
        if (!this.lotsFetched) {
            this.lotsFetched = true;

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
                this.markersMap.clear();
                val.forEach((lot) => {
                    this.markersMap.set(lot['place_id'], lot);
                });
                let parkingData = [];
                for (let lot of this.markersMap.values()) parkingData.push(lot);
                this.setState((state, props) => ({ parkData: parkingData }));
            }
            this.lotsFetched = false;
        }
    }

    async getStatus(place_id) {
        if (!this.statusFetched) {
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
            this.statusFetched = false;
        }
    }

    async handleDrag() {
        let center = this.mapRef.getCenter();
        console.log(center);
        await this.getParkingLots(center.lat(), center.lng());
    }

    async booking_nav(){
        console.log(this.state.selectedPark)
        // var id=this.state.selectedPark['place_id'];
        this.props.history.push({pathname: "/booking", state: {selectedPark: this.state.selectedPark}});
        //"/booking",{selectedPark:this.state.selectedPark});
    }


    componentDidMount() {
        this.getParkingLots(22.572645, 88.363892);
    }

    render() {
        return (
            <GoogleMap
                ref={(mapRef) => this.mapRef = mapRef}
                defaultZoom={14}
                defaultCenter={{ lat: 22.572645, lng: 88.363892 }}
                defaultOptions={{ styles: mapStyles }}
                onClick={(e) => {
                    console.log(e);
                }}
                onDragEnd={this.handleDrag}
            >
                {this.state.parkData.map(park => (
                    <Marker
                        key={park['latitude'] + " " + park['longitude']}
                        position={{
                            lat: park['latitude'],
                            lng: park['longitude']
                        }}
                        onClick={async () => {
                            let ret = await this.getStatus(park['place_id']);
                            this.setState({ selectedPark: park, selectedParkCAP: ret['CAP'], selectedParkTPS: ret['TPS'] });
                        }}
                    />
                ))}

                {this.state.selectedPark && (
                    <InfoWindow
                        position={{
                            lat: this.state.selectedPark['latitude'],
                            lng: this.state.selectedPark['longitude']
                        }}
                        onCloseClick={() => {
                            this.setState({ selectedPark: null });
                        }}
                    >
                        <div>
                            <h4>{this.state.selectedPark['name']}</h4>
                            <p>Current status: {this.state.selectedParkCAP} / {this.state.selectedParkTPS}</p>
                            <BookButton type="submit" onClick={this.booking_nav}>BOOK</BookButton>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        );
    }
}

class _Map extends Component {
    constructor(props) {
        super(props);
        console.log(props.location.state);
    }

    render() {
        const WrappedMap = withScriptjs(withGoogleMap(_MyMap));
        return (
            <div style={{ width: "100vw", height: "100vh",background: 'rgb(31, 138, 112)' }}>
                <WrappedMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${REACT_APP_GOOGLE_MAP_KEY_PAID}`}
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={<div style={{ height: "100%" }} />}
                    mapElement={<div style={{ height: "100%" }} />}
                    st={this.props.location.state}
                    history={this.props.history}
                >
                </WrappedMap>
            </div>
        );
    }
}

const MyMap = withRouter(_Map)
export { MyMap };