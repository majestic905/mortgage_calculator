import React from 'react';

export default class Table extends React.Component {
    render() {
        return (
            <div id="table-wrapper">
                <table className="table">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Дата</th>
                        <th>Сумма платежа</th>
                        <th>Платеж по основному долгу</th>
                        <th>Платеж по процентам</th>
                        <th>Остаток основного долга</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>№</td>
                        <td>Дата</td>
                        <td>Сумма платежа</td>
                        <td>Платеж по основному долгу</td>
                        <td>Платеж по процентам</td>
                        <td>Остаток основного долга</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}