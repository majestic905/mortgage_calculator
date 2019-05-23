import React from 'react';

import Form from './Form';
import Table from './Table';
import Credits from './Credits';

import './App.scss';


class App extends React.Component {
    render() {
        return (
            <div className="columns">
                <div className="column col-8">
                    <Form />
                </div>
                <div className="column col-4">
                    <Credits />
                </div>
                <div className="column col-12">
                    <Table />
                </div>
            </div>
        );
    }
}

export default App;
