import React, {useCallback, useState} from 'react';
import MaterialTable from 'material-table';

const {REACT_APP_API_BACKEND} = process.env;


function ManagerHistory(){
    const [data, setData] = useState([]);

    const getParkingStatus = useCallback(() => {}, []);

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
            data = {data}
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