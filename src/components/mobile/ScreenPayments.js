import React from 'react';
import FieldsPayments from '../shared/FieldsPayments';
import CalculateButton from "../shared/CalculateButton";


const ScreenParams = ({dispatch, payments}) => {
    return (
        <div id="form">
            <FieldsPayments mobile payments={payments} dispatch={dispatch}/>
            <CalculateButton block primary dispatch={dispatch} />
`        </div>
    )
};

export default ScreenParams;