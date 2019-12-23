import React from 'react';
import propTypes from 'prop-types';

const formatOptions = {
    style: 'decimal',
    minimumIntegerDigits: 2,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

function formatNumber(n) {
    return n.toLocaleString('en-US', formatOptions);
}

function Stats({totalLoan, totalInterest, total}) {
    return (
        <table id="stats" className="mb-2">
            <tbody>
                <tr>
                    <td>Сумма кредита:</td>
                    <td className="text-bold">{formatNumber(totalLoan)}</td>
                </tr>
                <tr>
                    <td>Сумма процентов:</td>
                    <td className="text-bold">{formatNumber(totalInterest)}</td>
                </tr>
                <tr>
                    <td>Выплачено всего:</td>
                    <td className="text-bold">{formatNumber(total)}</td>
                </tr>
            </tbody>
        </table>
    )
}


function Header() {
    return (
        <thead>
            <tr>
                <th>№</th>
                <th>Дата</th>
                <th>Платеж по долгу</th>
                <th>Платеж по процентам</th>
                <th>Сумма платежа</th>
                <th>Остаток долга</th>
            </tr>
        </thead>
    )
}

function Footer({totalLoan, totalInterest, total}) {
    return (
        <tfoot>
            <tr>
                <td/>
                <td/>
                <td>
                    <span className="text-bold">{formatNumber(totalLoan)}</span>
                    <br/>
                    <span className="text-gray">(Сумма кредита)</span>
                </td>
                <td>
                    <span className="text-bold">{formatNumber(totalInterest)}</span>
                    <br/>
                    <span className="text-gray">(Сумма процентов)</span>
                </td>
                <td>
                    <span className="text-bold">{formatNumber(total)}</span>
                    <br/>
                    <span className="text-gray">(Выплачено всего)</span>
                </td>
                <td/>
            </tr>
        </tfoot>
    )
}

export default class Table extends React.PureComponent {
    static propTypes = {
        calculation: propTypes.shape({
            data: propTypes.array,
            error: propTypes.instanceOf(Error),
        })
    }

    renderRow(item, i) {
        if (item.error)
            return (
                <tr key={i} className='text-error'>
                    <td>{item.index}</td>
                    <td>{item.date}</td>
                    <td colSpan={4}>{item.error}</td>
                </tr>
            )

        return (
            <tr key={i} className={!item.index ? 'text-success' : null}>
                <td>{item.index}</td>
                <td>{item.date}</td>
                <td>{formatNumber(item.loan)}</td>
                <td>{formatNumber(item.interest)}</td>
                {item.reduce
                    ? <td className="tooltip" data-tooltip={`↓ ${formatNumber(item.reduce)}`}>↓ {formatNumber(item.total)}</td>
                    : <td>{formatNumber(item.total)}</td>
                }
                <td>{formatNumber(item.balance)} ({formatNumber(item.progress)}%)</td>
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

        const totalLoan = data.reduce((acc, val) => acc + (val.loan || 0), 0);
        const totalInterest = data.reduce((acc, val) => acc + (val.interest || 0), 0);
        const total = data.reduce((acc, val) => acc + (val.total || 0), 0);

        for (const item of data)
            item.progress = (totalLoan - item.balance)/totalLoan * 100;

        return (
            <div id="calculation">
                <Stats totalLoan={totalLoan} totalInterest={totalInterest} total={total}/>

                <table id="table" className="table">
                    <Header/>
                    <tbody>
                        {data.map(this.renderRow)}
                    </tbody>
                    <Footer totalLoan={totalLoan} totalInterest={totalInterest} total={total}/>
                </table>
            </div>
        )
    }
}