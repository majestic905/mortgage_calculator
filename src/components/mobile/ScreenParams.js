import React from 'react';
import FieldsParams from '../shared/FieldsParams';
import CalculateButton from "../shared/CalculateButton";


const ScreenParams = ({dispatch, credit}) => {
    return (
        <div id="form">
            <FieldsParams credit={credit} dispatch={dispatch} />
            <CalculateButton block primary dispatch={dispatch} />
        </div>
    )
};

export default ScreenParams;