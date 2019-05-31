import React from 'react';
import {connect} from 'react-redux';
import {selectors} from "./reducer";
import {formatDate} from './misc';

class Table extends React.Component {
    render() {
        const calculation = this.props.calculation;

        if (calculation.error)
            return (
                <div id="error" className="toast toast-error">
                    {calculation.error.toString()}
                </div>
            );

        if (calculation.data.length === 0)
            return null;

        const totalLoan = calculation.data.reduce((acc, val) => acc + val.loan || 0, 0).toFixed(2);
        const totalInterest = calculation.data.reduce((acc, val) => acc + val.interest || 0, 0).toFixed(2);
        const total = calculation.data.reduce((acc, val) => acc + val.total || 0, 0).toFixed(2);

        let counter = 0;

        return (
            <div id="table-wrapper">
                <table className="table">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Дата</th>
                        <th>Платеж по основному долгу</th>
                        <th>Платеж по процентам</th>
                        <th>Сумма платежа</th>
                        <th>Остаток основного долга</th>
                    </tr>
                    </thead>
                    <tbody>
                    {calculation.data.map((item, i) => item.error
                        ? <tr key={i} className='text-error'>
                            <td>{item.type === 'regular' ? ++counter : null}</td>
                            <td>{formatDate(item.date)}</td>
                            <td colSpan={4}>{item.error}</td>
                        </tr>
                        : <tr key={i} className={item.type === 'extra' ? 'text-success' : null}>
                            <td>{item.type === 'regular' ? ++counter : null}</td>
                            <td>{formatDate(item.date)}</td>
                            <td>{item.loan.toFixed(2)}</td>
                            <td>{item.interest.toFixed(2)}</td>
                            <td>{item.total.toFixed(2)}</td>
                            <td>{item.balance.toFixed(2)}</td>
                        </tr>
                    )}
                    <tr>
                        <td/>
                        <td/>
                        <td>
                            <span className="text-bold">{totalLoan}</span>
                            <br/>
                            <span className="text-gray">(Сумма выплаченного долга)</span>
                        </td>
                        <td>
                            <span className="text-bold">{totalInterest}</span>
                            <br/>
                            <span className="text-gray">(Сумма выплаченных процентов)</span>
                        </td>
                        <td>
                            <span className="text-bold">{total}</span>
                            <br/>
                            <span className="text-gray">(Выплачено всего)</span>
                        </td>
                        <td/>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    calculation: selectors.getCalculation(store)
});

export default connect(mapStateToProps, null)(Table);