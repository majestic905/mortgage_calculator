import React from 'react';
import FieldsParams from '../shared/FieldsParams';


const ScreenParams = ({dispatch, credit}) => {
    return (
        <div id="form">
            <FieldsParams credit={credit} dispatch={dispatch} />
        </div>
    )
};

export default ScreenParams;