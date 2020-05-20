import React, {memo} from 'react';
import propTypes from 'prop-types';

const formatOptions = {
    style: 'decimal',
    minimumIntegerDigits: 2,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

const formatNumber = (n) => n.toLocaleString('en-US', formatOptions);

const Stats = ({totalValues}) => {
    return (
        <table id="stats" className="mb-2">
            <tbody>
                <tr>
                    <td>Сумма кредита:</td>
                    <td className="text-bold">{totalValues.loan}</td>
                </tr>
                <tr>
                    <td>Сумма процентов:</td>
                    <td className="text-bold">{totalValues.interest}</td>
                </tr>
                <tr>
                    <td>Выплачено всего:</td>
                    <td className="text-bold">{totalValues.loanWithInterest}</td>
                </tr>
            </tbody>
        </table>
    )
};

const TableHeader = () => {
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
};

const TableFooter = ({totalValues}) => {
    return (
        <tfoot>
            <tr>
                <td />
                <td />
                <td>
                    <span className="text-bold">{totalValues.loan}</span>
                    <br />
                    <span className="text-gray">(Сумма кредита)</span>
                </td>
                <td>
                    <span className="text-bold">{totalValues.interest}</span>
                    <br />
                    <span className="text-gray">(Сумма процентов)</span>
                </td>
                <td>
                    <span className="text-bold">{totalValues.loanWithInterest}</span>
                    <br />
                    <span className="text-gray">(Выплачено всего)</span>
                </td>
                <td />
            </tr>
        </tfoot>
    )
};

const TableBody = ({data}) => {
    return (
        <tbody>
            {data.map((item, i) => {
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
            })}
        </tbody>
    )
}

const Table = ({data, totalValues}) => {
    return (
        <table id="table" className="table">
            <TableHeader/>
            <TableBody data={data}/>
            <TableFooter totalValues={totalValues}/>
        </table>
    )
};

const Calculation = memo(({calculation: {error, data}}) => {
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

    for (const item of data)
        item.progress = (totalLoan - item.balance) / totalLoan * 100;

    const totalValues = {
        loan: formatNumber(totalLoan),
        interest: formatNumber(totalInterest),
        loanWithInterest: formatNumber(totalLoan + totalInterest),
    }

    return (
        <div id="calculation">
            <Stats totalValues={totalValues} />
            <Table data={data} totalValues={totalValues} />
        </div>
    )
});

Calculation.propTypes = {
    calculation: propTypes.shape({
        data: propTypes.array,
        error: propTypes.instanceOf(Error),
    })
}

export default Calculation;