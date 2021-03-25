import React, {useState} from 'react';

const {REACT_APP_API_BACKEND} = process.env;


function ManagerHistory(){
    const email = "ashok@gmail.com";
    const [userStatus, setUserStatus] = useState([]);
    let parkingData = [];
    var statusFetched = false;
    const [startFetched, setstartFetched] = useState(false);

    async function getHistory(email) {
        if (!statusFetched) {
            statusFetched = true;
            let requestOption = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'email': email}),
            };
            console.log(requestOption);
            var res = await fetch(`${REACT_APP_API_BACKEND}/manager/parking/get_current_parking`, requestOption);
            console.log(res);
            var getn = await res.json();
            console.log(getn);
            for( let lot in getn)
                parkingData.push(getn[lot]);
            console.log(parkingData);
            setUserStatus(parkingData);
            console.log(userStatus);
            if (res.status === 200) {
                console.log("Failed");
            }  
        }
    }

    if(!startFetched){
        setstartFetched(true);
        getHistory(email);
        
    }
    

    return(
        <div>
            Hi
        </div>
    );


}

export default ManagerHistory;