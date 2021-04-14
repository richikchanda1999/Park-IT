import React, {useState, useCallback, useLayoutEffect} from 'react';
import MaterialTable from 'material-table';
import Session from "react-session-api";

const {REACT_APP_API_BACKEND} = process.env;

function ManagerHistory() {
    let email = Session.get('email');
    const [userStatus, setUserStatus] = useState([]);
    let parkingName = "Current Parking Status ["+Session.get('parking_name')+"]";

    const getHistory = useCallback(async () => {
        let requestOption = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'email': email}),
        };
        console.log(requestOption);
        let res = await fetch(`${REACT_APP_API_BACKEND}/manager/parking/get_current_parking`, requestOption);
        console.log(res);
        if (res.status === 200) {
            let val = await res.json();
            console.log(val);
            setUserStatus(val);
        }
    }, []);


    useLayoutEffect(() => {
        getHistory()
    }, userStatus);

    const [data, setData] = useState([]);

    const getParkingStatus = useCallback(() => {
    }, []);
    const column = [
        {
            title: 'Vehicle No.', field: 'vehicle',
            cellStyle: {
                backgroundColor: '#039be5',
                color: '#FFF'
            },
        },
        {title: 'Parking Lot', field: 'parking_lot'},
        {title: 'Entry Time', field: 'entry_time'},
        {title: 'Status', field: 'status'}
    ]

    return (
        <div>
            <MaterialTable title={parkingName}
                           data={userStatus}
                           columns={column}
                           options={{
                               pageSize: 10,
                               exportButton: true,
                               sorting: true,
                               headerStyle: {
                                   zIndex: 2,
                                   backgroundColor: '#01579b',
                                   color: '#FFF'
                               },
                               rowStyle: {
                                   "&:hover": {
                                       backgroundColor: '#01579b',
                                   }
                               }
                           }}
            />
        </div>
    );


}

export default ManagerHistory;