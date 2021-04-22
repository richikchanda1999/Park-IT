import React, {useState, useCallback, useEffect} from 'react';
import MaterialTable from 'material-table';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import ToggleButton from '@material-ui/lab/ToggleButton';
import {green, red} from "@material-ui/core/colors";

const {REACT_APP_API_BACKEND} = process.env;

function MyManager() {                                  // To get Manager Details
    const [managerStatus, setManagerStatus] = useState([]);

    const getManagers = useCallback(async () => {
        let requestOption = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
        };
        console.log(requestOption);
        let res = await fetch(`${REACT_APP_API_BACKEND}/admin/detail/get_manager`, requestOption);
        console.log(res);
        if (res.status === 200) {
            let val = await res.json();
            console.log(val);
            setManagerStatus(val);
        }
    }, []);


    useEffect(() => {                           // Single render of getManagers function
        async function getInitialManagerData() {
            await getManagers();
        }
        getInitialManagerData();
    }, []);

    const onClick = useCallback(async (email, value) => {       // Updating the approval status of Manager
        let requestOption = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'email': email, 'value': value}),
        };
        console.log("From click: ", email);
        let res = await fetch(`${REACT_APP_API_BACKEND}/admin/detail/set_approved`, requestOption);
        console.log(res);
        if (res.status === 200) {
            let val = await res.json();
            console.log(val);
            await getManagers();
            return val;
        }
    }, []);

    const column = [
        {title: 'Name', field: 'Name',
            cellStyle: {
                backgroundColor: '#039be5',
                color: '#FFF'
            },
        },
        {title: 'Number', field: 'Number'},
        {title: 'Email', field: 'email'},
        {title: 'Parking Lot', field: 'parking_id'},
        {title: 'Approved', field: 'is_approved', render: rowData => <ToggleButton
                value="check"
                selected={rowData['is_approved']}
                onChange={() => {
                    onClick(rowData['email'], !rowData['is_approved']);
                }}
            >
                {rowData['is_approved'] ? <CancelIcon style={{ color: red[500] }}/> : <CheckIcon style={{ color: green[500] }}/>}
            </ToggleButton> },
    ]

    return (
        <div>
            <MaterialTable title="Manager Status"
                           data={managerStatus}
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

export default MyManager;