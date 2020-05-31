import React from 'react';
import FieldsPayments from '../shared/FieldsPayments';


const ScreenParams = ({dispatch, payments}) => {
    return (
        <div id="form">
            <FieldsPayments mobile payments={payments} dispatch={dispatch}/>
`        </div>
    )
};

export default ScreenParams;