import React from 'react';
import Desktop from './desktop';
import Mobile from './mobile';
import calculate from "./calculate";
import './App.scss';


function generateEmptyCredit() {
    return {
        sum: "1000000",
        monthsNum: "60",
        startDate: "2019-01-10",
        percent: "12.5",
        paymentType: "annuity",
        paymentDay: "issue_day",
        payments: []
    };
}


class App extends React.Component {
    state = {
        credit: generateEmptyCredit(),
        calculation: {error: null, data: []},
    };

    componentDidMount() {
        try {
            const json = localStorage.getItem('credit');
            if (json) {
                this.setState({credit: JSON.parse(json)});
                setTimeout(this._calculate, 100);
            }
        } catch (error) {
            console.error(error);
        }
    }

    _calculate = () => {
        const calculation = {error: null, data: []};

        try {
            calculation.data = calculate(this.state.credit);
        } catch (error) {
            calculation.error = error;
        }

        this.setState({calculation});
    };

    saveCredit = () => {
        try {
            localStorage.setItem('credit', JSON.stringify(this.state.credit));
        } catch (error) {
            console.error(error);
        }
    };

    calculate = () => {
        this._calculate();
        if (!this.state.calculation.error)
            this.saveCredit();
    };

    onChange = (ev) => {
        const credit = {...this.state.credit, [ev.target.name]: ev.target.value};
        this.setState({credit});
    };

    render() {
        console.log(this.state.credit, this.state.calculation);
        const Component = document.location.pathname === "/mobile" ? Mobile : Desktop;
        return <Component {...this.state} onChange={this.onChange} calculate={this.calculate}/>;
    }
}

export default App;
