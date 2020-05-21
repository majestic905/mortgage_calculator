import React from 'react';
import propTypes from 'prop-types';

const formatOptions = {
    style: 'decimal',
    minimumIntegerDigits: 2,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

const formatNumber = (n) => n.toLocaleString('en-US', formatOptions);

const Totals = ({totals}) => {
    return (
        <table id="totals" className="mb-2">
            <tbody>
                <tr>
                    <td>Сумма кредита:</td>
                    <td className="text-bold">{totals.principal}</td>
                </tr>
                <tr>
                    <td>Сумма процентов:</td>
                    <td className="text-bold">{totals.interest}</td>
                </tr>
                <tr>
                    <td>Выплачено всего:</td>
                    <td className="text-bold">{totals.total}</td>
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
                <th>Основной долг</th>
                <th>Проценты</th>
                <th>Платеж</th>
                <th>Остаток долга</th>
            </tr>
        </thead>
    )
};

const TableFooter = ({totals}) => {
    return (
        <tfoot>
            <tr>
                <td />
                <td />
                <td>
                    <span className="text-bold">{totals.principal}</span>
                    <br />
                    <span className="text-gray">(Сумма кредита)</span>
                </td>
                <td>
                    <span className="text-bold">{totals.interest}</span>
                    <br />
                    <span className="text-gray">(Сумма процентов)</span>
                </td>
                <td>
                    <span className="text-bold">{totals.total}</span>
                    <br />
                    <span className="text-gray">(Выплачено всего)</span>
                </td>
                <td />
            </tr>
        </tfoot>
    )
};

const TableBody = ({data, showPercentage}) => {
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
                        <td>{formatNumber(item.principal)}</td>
                        <td>{formatNumber(item.interest)}</td>
                        {item.reduce
                            ? <td className="tooltip" data-tooltip={`↓ ${formatNumber(item.reduce)}`}>↓ {formatNumber(item.total)}</td>
                            : <td>{formatNumber(item.total)}</td>
                        }
                        <td>{formatNumber(item.balance)} {showPercentage && <span>({formatNumber(item.progress)}%)</span>}</td>
                    </tr>
                )
            })}
        </tbody>
    )
}

const Table = ({data, showPercentage, totals}) => {
    return (
        <table id="table" className="table">
            <TableHeader/>
            <TableBody data={data} showPercentage={showPercentage}/>
            <TableFooter totals={totals}/>
        </table>
    )
};

const Schedule = React.memo(({schedule: {error, data}}) => {
    const [showPercentage, setShowPercentage] = React.useState(true);

    if (error)
        return (
            <div id="error" className="toast toast-error">
                {error.toString()}
            </div>
        );

    if (data.length === 0)
        return null;

    const principal = data.reduce((acc, val) => acc + (val.principal || 0), 0);
    const interest = data.reduce((acc, val) => acc + (val.interest || 0), 0);

    for (const item of data)
        item.progress = (principal - item.balance) / principal * 100;

    const totals = {
        principal: formatNumber(principal),
        interest: formatNumber(interest),
        total: formatNumber(principal + interest),
    }

    return (
        <div id="schedule">
            <Totals totals={totals} />

            <div className="divider"/>

            <label className="form-switch">
                <input type="checkbox" checked={showPercentage} onChange={ev => setShowPercentage(ev.target.checked)}/>
                <i className="form-icon"/> Показывать прогресс
            </label>

            <div className="divider"/>

            <Table data={data} showPercentage={showPercentage} totals={totals} />
        </div>
    )
});

Schedule.propTypes = {
    schedule: propTypes.shape({
        data: propTypes.array,
        error: propTypes.instanceOf(Error),
    })
}

export default Schedule;