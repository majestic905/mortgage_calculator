import React from 'react';


function generateEmptyPayment() {
    return {
        key: Math.random().toString(36).slice(2),
        period: "0", startDate: "", nextPaymentType: "only_interest", reduceType: "reduce_sum", sum: "0"
    }
}

export default class Form extends React.Component {
    onChange = (ev) => this.props.onChange({target: {
        name: ev.target.name,
        value: ev.target.type === "checkbox" ? ev.target.checked : ev.target.value
    }});

    addPayment = () => {
        const payments = this.props.credit.payments.slice();
        payments.push(generateEmptyPayment());
        this.onChange({target: {name: 'payments', value: payments}});
    };

    removePayment = (ev) => {
        const id = parseInt(ev.currentTarget.dataset.id, 10);
        const payments = this.props.credit.payments.slice();
        payments.splice(id, 1);
        this.onChange({target: {name: 'payments', value: payments}});
    };

    changePayment = (ev) => {
        const [_, i, field] = ev.target.name.split('.');
        const payments = this.props.credit.payments.slice();
        const index = parseInt(i, 10);
        payments[index] = {...payments[index], [field]: ev.target.value};
        this.onChange({target: {name: 'payments', value: payments}});
    };

    render() {
        const credit = this.props.credit;

        return (
            <form id="form">
                <div className="accordion mb-2">
                    <input type="checkbox" id="accordion-details" name="accordion-details" hidden
                           defaultChecked={credit.payments.length === 0}/>
                    <label className="accordion-header h4" htmlFor="accordion-details">
                        <i className="icon icon-arrow-right mr-1"/>Параметры кредита
                    </label>
                    <div className="accordion-body">
                        <div className="form-group">
                            <label className="form-label" htmlFor="sum">Сумма кредита (руб.)</label>
                            <div className="d-flex">
                                <input required type="number" min="0" step="1" name="sum" id="sum" className="form-input" value={credit.sum} onChange={this.onChange}/>
                                <span className="ml-2 text-nowrap">рублей</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="monthsNum">Срок кредита</label>
                            <div className="d-flex">
                                <input required type="number" min="0" step="1" name="monthsNum" id="monthsNum" className="form-input" value={credit.monthsNum} onChange={this.onChange}/>
                                <span className="ml-2 text-nowrap">месяцев</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="startDate">Дата выдачи кредита</label>
                            <input required type="date" id="startDate" name="startDate" className="form-input" value={credit.startDate} onChange={this.onChange}/>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="percent">Процентная ставка</label>
                            <div className="d-flex">
                                <input required type="number" min="0" step="0.1" name="percent" id="percent" className="form-input" value={credit.percent} onChange={this.onChange}/>
                                <span className="ml-2 text-nowrap">% годовых</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="paymentType">Вид платежа</label>
                            <div>
                                <label className="form-radio form-inline tooltip">
                                    <input type="radio" name="paymentType" value="annuity" checked={credit.paymentType === "annuity"} onChange={this.onChange}/><i className="form-icon"/> Аннуитетный
                                </label>
                                <label className="form-radio form-inline tooltip">
                                    <input type="radio" name="paymentType" value="differentiated" checked={credit.paymentType === "differentiated"} onChange={this.onChange}/><i className="form-icon"/> Дифференцированный
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="paymentDay">Ежемесячные платежи</label>
                            <select name="paymentDay" className="form-select" value={credit.paymentDay} onChange={this.onChange}>
                                <option value="issue_day">в день выдачи кредита</option>
                                <option value="last_day_of_month">в последний день месяца</option>
                                {Array.from({length: 28}, (_, i) =>
                                    <option key={i+1} value={i+1}>{i+1}-е число каждого месяца</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="divider"/>

                <div className="accordion">
                    <input type="checkbox" id="accordion-payments" name="accordion-payments" hidden
                           defaultChecked={credit.payments.length !== 0}/>
                    <label className="accordion-header h4" htmlFor="accordion-payments">
                        <i className="icon icon-arrow-right mr-1"/> Досрочные погашения
                    </label>
                    <div className="accordion-body">
                        {credit.payments.map((payment, i) =>
                            <div key={payment.key} className="payment">
                                <div className="payment-header d-flex">
                                    <span className="h5">{i+1}.</span>
                                    <button type="button" className="btn btn-sm" onClick={this.removePayment} data-id={i}><i className="icon icon-cross"/> Удалить</button>
                                </div>
                                <select name={`payment.${i}.period`} className="form-select mt-2" value={payment.period} onChange={this.changePayment}>
                                    <option value="0">Разовый</option>
                                    <option value="1">Раз в месяц</option>
                                    <option value="2">Раз в 2 месяца</option>
                                    <option value="3">Раз в 3 месяца</option>
                                    <option value="6">Раз в полгода</option>
                                    <option value="12">Раз в год</option>
                                </select>
                                <div className="mt-2 d-flex">
                                    <input required type="date" name={`payment.${i}.startDate`} className="form-input mr-2" value={payment.startDate} onChange={this.changePayment}/>
                                    <input required type="number" min="0" step="1" name={`payment.${i}.sum`} className="form-input" placeholder="Сумма" value={payment.sum} onChange={this.changePayment}/>
                                </div>
                                <select name={`payment.${i}.reduceType`} className="form-select mt-2" value={payment.reduceType} onChange={this.changePayment}>
                                    <option value="reduce_period">Уменьшить срок кредита</option>
                                    <option value="reduce_sum">Уменьшить ежемесячный платеж</option>
                                </select>
                                <select name={`payment.${i}.nextPaymentType`} className="form-select mt-2" value={payment.nextPaymentType} onChange={this.changePayment}>
                                    <option value="no_changes">Следующий платеж - без изменений</option>
                                    <option value="only_interest">Следующий платеж - только проценты</option>
                                </select>
                            </div>
                        )}
                        <div className="px-1 py-1">
                            <button type="button" className="btn btn-block" onClick={this.addPayment}><i className="icon icon-plus"/> Добавить досрочный платеж</button>
                        </div>
                    </div>
                </div>

                <div className="divider"/>

                <div className="py-1">
                    <button type="button" className="btn btn-block btn-primary" data-screen="table" onClick={this.props.onScreenChange}>Рассчитать</button>
                </div>
            </form>
        )
    }
}