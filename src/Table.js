import React from 'react';


function formatDate(d) {
    d = new Date(d);
    return (
        ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." + d.getFullYear()
    );
}


export default class Table extends React.Component {
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
                    {data.map((item, i) => item.error
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
                            <td className={!!item.reduce ? 'tooltip' : null} data-tooltip={item.reduce ? `↓ ${item.reduce}` : null}>
                                {item.total.toFixed(2)}
                            </td>
                            <td>
                                {item.balance.toFixed(2)}
                                {item.type === "regular" ? ` (${Math.round((totalLoan - item.balance)/totalLoan * 100)}%)` : null}
                            </td>
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