import React from 'react';
import Form from './Form';
import Table from '../Table';

const cx = (arr) => arr.filter(Boolean).join(' ');

export default class Mobile extends React.Component {
    state = {
        screen: "form"
    }

    onScreenChange = (ev) => {
        const screen = ev.currentTarget.dataset.screen;
        if (screen === "table")
            this.props.calculate();
        this.setState({screen});
    };

    render() {
        const Screen = this.state.screen === "table" ? Table : Form;

        return (
            <div id="mobile">
                <Screen {...this.props} onScreenChange={this.onScreenChange}/>
                <Navigation screen={this.state.screen} onScreenChange={this.onScreenChange}/>
            </div>
        );
    }
}

function Navigation({screen, onScreenChange}) {
    return (
        <div id="navigation" className="btn-group btn-group-block">
            <button type="button" className={cx(["btn btn-lg", screen === "form" && "active"])} data-screen="form" onClick={onScreenChange}>
                <i className="icon icon-edit"/> <b>КРЕДИТ</b>
            </button>

            <button type="button" className={cx(["btn btn-lg", screen === "table" && "active"])} data-screen="table" onClick={onScreenChange}>
                <i className="icon icon-menu"/> <b>ГРАФИК</b>
            </button>
        </div>
    );
}