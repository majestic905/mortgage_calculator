import React from 'react';
import FieldsPayments from '../shared/FieldsPayments';
import Button from "../shared/Button";


const ScreenParams = ({dispatch, payments, calculate}) => {
    return (
        <div id="form">
            <FieldsPayments mobile payments={payments} dispatch={dispatch}/>
            <Button block primary onClick={calculate} content="Рассчитать" />
        </div>
    )
};

export default ScreenParams;