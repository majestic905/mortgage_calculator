/* global chrome, process */

import React from 'react';
import Form from './Form';
import Table from './Table';
import Calculator from "./Calculator";
import './App.scss';


function generateEmptyCredit() {
    return {
        sum: "1000000",
        monthsNum: "60",
        startDate: "2019-01-10",
        percent: "12.5",
        paymentType: "annuity",
        paymentDay: "issue_day",
        payments: [],
        meta: {
            key: Math.random().toString(36).slice(2),
            name: "Новый расчет",
            date: new Date().toISOString()
        }
    };
}


class App extends React.Component {
    state = {
        credit: generateEmptyCredit(),
        calculation: {error: null, data: []},
        modified: false,
    };

    componentDidMount() {
        if (process.env.NODE_ENV === "production")
            chrome.storage.local.get('credit', data => this.setState({credit: data.credit}));
    }

    markSaved = () => this.setState({modified: false});

    saveCredit = () => {
        if (process.env.NODE_ENV === "production")
            chrome.storage.local.set({credit: this.state.credit}, this.markSaved);
        else
            this.markSaved();
    };

    calculate = () => {
        const calculation = {error: null, data: []};

        try {
            calculation.data = new Calculator().calculate(this.state.credit);
        } catch (error) {
            calculation.error = error;
        }

        this.setState({calculation});
    };

    onChange = (ev) => {
        const credit = {...this.state.credit, [ev.target.name]: ev.target.value};
        this.setState({credit, modified: true});
    };

    render() {
        const saveCredit = this.state.modified ? this.saveCredit : undefined;

        return (
            <div className="columns">
                <div className="column col-xl-12 col-6">
                    <Form credit={this.state.credit} onChange={this.onChange} calculate={this.calculate} saveCredit={saveCredit}/>
                </div>
                <div className="column col-xl-12 col-6">
                    <Table calculation={this.state.calculation}/>
                </div>
            </div>
        );
    }
}

export default App;
