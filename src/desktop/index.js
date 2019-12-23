import React from 'react';
import Form from './Form';
import Table from '../Table';


export default class Desktop extends React.Component {
    render() {
        return (
            <div id="desktop" className="columns">
                <div className="column col-xl-12 col-6">
                    <Form credit={this.props.credit} onChange={this.props.onChange} calculate={this.props.calculate}/>
                </div>
                <div className="column col-xl-12 col-6">
                    <Table calculation={this.props.calculation}/>
                </div>
            </div>
        );
    }
}