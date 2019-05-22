import React from 'react';

import Form from './Form';
import Table from './Table';
import Credits from './Credits';

import './App.scss';


class App extends React.Component {
    render() {
        return (
            <div className="columns">
                <div className="column col-7">
                    <Form />
                    {/*<Table />*/}
                </div>
                <div className="column col-5">
                    <Credits />
                </div>
            </div>
        );
    }
}

export default App;
