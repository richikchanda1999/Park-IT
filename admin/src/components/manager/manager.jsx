import React, {useState, useCallback, useEffect} from 'react';
import MaterialTable from 'material-table';

const {REACT_APP_API_BACKEND} = process.env;

function MyManager() {

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


    useEffect(() => {
        async function getInitialManagerData() {
            await getManagers();
        }
        getInitialManagerData();
    }, []);

    const column = [
        {title: 'First Name', field: 'firstName'},
        {title: 'Last Name', field: 'lastName'},
        {title: 'Email', field: 'email'},
        {title: 'Parking Lot', field: 'parking_id'}
    ]

    return (
        <div>
            <MaterialTable title="Current Parking Status"
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