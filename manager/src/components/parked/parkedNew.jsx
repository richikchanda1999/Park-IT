import React, {useState} from 'react';
import MaterialTable from 'material-table';

const {REACT_APP_API_BACKEND} = process.env;


function ManagerHistory(){
    
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

    const data = [
        { vehicle: 'PY01 8065', parking_lot: 'East Coast', entry_time: '03/26/2021 15:00' , status: 'Parked' },
        { vehicle: 'DL04 3154 ', parking_lot: 'East Coast', entry_time: '03/26/2021 12:30' , status: 'Booked' },
        { vehicle: 'GC43 1643', parking_lot: 'East Coast', entry_time: '03/26/2021 13:20' , status: 'Parked' },
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