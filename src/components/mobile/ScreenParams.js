import React from 'react';
import FieldsParams from '../shared/FieldsParams';
import Button from "../shared/Button";


const ScreenParams = ({dispatch, credit, calculate}) => {
    return (
        <div id="form">
            <FieldsParams credit={credit} dispatch={dispatch} />
            <Button block primary onClick={calculate} content="Рассчитать" />
        </div>
    )
};

export default ScreenParams;