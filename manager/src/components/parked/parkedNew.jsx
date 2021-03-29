import React, {useState, useCallback, useLayoutEffect, useEffect} from 'react';
import MaterialTable from 'material-table';

const {REACT_APP_API_BACKEND} = process.env;



function ManagerHistory(){

  let email = "apple@gmail.com";
  let statusFetched = false;
  const [userStatus, setUserStatus] = useState([]);

  const getHistory = useCallback(async () => {
    let requestOption = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'email': email}),
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


useLayoutEffect(()=>{getHistory()}, userStatus);

  
    const column = [
        { title: 'Vehicle No.', field: 'vehicle',
          cellStyle: {
            backgroundColor: '#039be5',
            color: '#FFF'
          },
        },
        { title: 'Parking Lot', field: 'parking_lot' },
        { title: 'Entry Time', field: 'entry_time'},
        { title: 'Status', field: 'status' }
    ]

    return(
        <div>
            <MaterialTable title = "Current Parking Status"
            data = {userStatus}
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
                    "&:hover":{
                        backgroundColor: '#01579b',
                    }
                }
              }}
            />
        </div>
    );


}

export default ManagerHistory;