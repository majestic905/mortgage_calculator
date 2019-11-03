import React from 'react';


export default class Table extends React.Component {
    renderFooterRow({totalLoan, totalInterest, total}) {
        return (
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
        )
    }

    renderErrorRow(item, i) {
        return (
            <tr key={i} className='text-error'>
                <td>{item.index}</td>
                <td>{item.date}</td>
                <td colSpan={4}>{item.error}</td>
            </tr>
        )
    }

    renderRow(item, i) {
        if (item.error)
            return this.renderErrorRow(item, i);

        return (
            <tr key={i} className={!item.index ? 'text-success' : null}>
                <td>{item.index}</td>
                <td>{item.date}</td>
                <td>{item.loan.toFixed(2)}</td>
                <td>{item.interest.toFixed(2)}</td>
                <td className={item.reduce ? 'tooltip' : null} data-tooltip={item.reduce ? `↓ ${item.reduce.toFixed(2)}` : null}>
                    {item.total.toFixed(2)}
                </td>
                <td>
                    {item.balance.toFixed(2)}
                    {item.progress && ` (${item.progress.toFixed(2)}%)`}
                </td>
            </tr>
        )
    }

    render() {
        const {error, data} = this.props.calculation;

        if (error)
            return (
                <div id="error" className="toast toast-error">
                    {error.toString()}
                </div>
            );

        if (data.length === 0)
            return null;

        const totalLoan = data.reduce((acc, val) => acc + val.loan || 0, 0).toFixed(2);
        const totalInterest = data.reduce((acc, val) => acc + val.interest || 0, 0).toFixed(2);
        const total = data.reduce((acc, val) => acc + val.total || 0, 0).toFixed(2);

        for (const item of data)
            if (item.index)
                item.progress = (totalLoan - item.balance)/totalLoan * 100;

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
                    {data.map(this.renderRow)}
                    {this.renderFooterRow({totalLoan, totalInterest, total})}
                    </tbody>
                </table>
            </div>
        )
    }
}