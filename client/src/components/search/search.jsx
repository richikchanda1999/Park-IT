import React,{useState} from "react";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";

function Search()
{
    const [address,setAddress] = useState("");
    const [coordinate,setCoordinates]=useState()
}