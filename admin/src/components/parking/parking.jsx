import React, {useState, useCallback, useLayoutEffect} from 'react';
import MaterialTable from 'material-table';

const {REACT_APP_API_BACKEND} = process.env;



function MyParking(){

  const [parkingStatus, setParkingStatus] = useState([]); 

  const getParking  = useCallback(async () => {
    let requestOption = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
  };
  console.log(requestOption);
  let res = await fetch(`http://localhost:9000/admin/detail/get_parking`, requestOption);
  console.log(res);
    if (res.status === 200) {
        let val = await res.json();
        console.log(val);
        setParkingStatus(val);
    }
}, []);


useLayoutEffect(()=>{getParking()}, parkingStatus);

  
    const column = [
        { title: 'Name', field: 'name'},
        { title: 'Latitude', field: 'latitude' },
        { title: 'Longitude', field: 'longitude'},
        { title: 'Current', field: 'CAP'},
        { title: 'Total', field: 'TPS'},
        { title: 'Bike Rate', field: 'bike' },
        { title: 'Car Rate', field: 'car' },
        { title: 'Truck Rate', field: 'truck' }
    ]

    return(
        <div>
            <MaterialTable title = "Parking Lot Status"
            data = {parkingStatus}
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

export default MyParking;