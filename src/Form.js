import React from 'react';
import {connect} from 'react-redux';
import {selectors, actions} from "./reducer";


class Form extends React.Component {
    onChange = (ev) => {
        const field = ev.target.name;
        const value = ev.target.type === "checkbox" ? ev.target.checked : ev.target.value;
        this.props.changeCredit(field, value);
    };

    addPayment = () => {
        const payments = this.props.credit.payments.slice();
        payments.push({
            key: Math.random().toString(36).slice(2),
            period: "", date: "", next: "0", sum: "", divide: false
        });
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

    onSubmit = (ev) => {
        ev.preventDefault();
        this.props.calculate();
    };

    render() {
        const credit = this.props.credit;

        return (
            <form id="form">
                <div className="form-horizontal">
                    <div className="form-group">
                        <div className="col-4 col-sm-12">
                            <label className="form-label" htmlFor="sum">Сумма кредита (руб.)</label>
                        </div>
                        <div className="col-8 col-sm-12 d-flex">
                            <input required type="number" min="0" step="1" name="sum" id="sum" className="form-input" value={credit.sum} onChange={this.onChange}/>
                            <span className="ml-2 text-nowrap">рублей</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-4 col-sm-12">
                            <label className="form-label" htmlFor="monthsNum">Срок кредита</label>
                        </div>
                        <div className="col-8 col-sm-12 d-flex">
                            <input required type="number" min="0" step="1" name="monthsNum" id="monthsNum" className="form-input" value={credit.monthsNum} onChange={this.onChange}/>
                            <span className="ml-2 text-nowrap">месяцев</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-4 col-sm-12">
                            <label className="form-label" htmlFor="startDate">Дата выдачи кредита</label>
                        </div>
                        <div className="col-8 col-sm-12">
                            <input required type="date" id="startDate" name="startDate" className="form-input" value={credit.startDate} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-4 col-sm-12">
                            <label className="form-label" htmlFor="percent">Процентная ставка</label>
                        </div>
                        <div className="col-8 col-sm-12 d-flex">
                            <input required type="number" min="0" step="0.1" name="percent" id="percent" className="form-input" value={credit.percent} onChange={this.onChange}/>
                            <span className="ml-2 text-nowrap">% годовых</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-4 col-sm-12">
                            <label className="form-label" htmlFor="paymentType">Вид платежа</label>
                        </div>
                        <div className="col-8 col-sm-12">
                            <label className="form-radio form-inline tooltip" data-tooltip="Аннуитетный платеж – вариант ежемесячного платежа по кредиту, когда размер ежемесячного платежа остаётся постоянным на всём периоде кредитования.">
                                <input type="radio" name="paymentType" value="annuity" checked={credit.paymentType === "annuity"} onChange={this.onChange}/><i className="form-icon"/> Аннуитетный
                            </label>
                            <label className="form-radio form-inline tooltip" data-tooltip="Дифференцированный платеж – вариант ежемесячного платежа по кредиту, когда размер ежемесячного платежа по погашению кредита постепенно уменьшается к концу периода кредитования.">
                                <input type="radio" name="paymentType" value="differentiated" checked={credit.paymentType === "differentiated"} onChange={this.onChange}/><i className="form-icon"/> Дифференцированный
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-4 col-sm-12">
                            <label className="form-label" htmlFor="paymentDay">Ежемесячные платежи</label>
                        </div>
                        <div className="col-8 col-sm-12">
                            <select name="paymentDay" className="form-select" value={credit.paymentDay} onChange={this.onChange}>
                                <option value="issue_day">в день выдачи кредита</option>
                                <option value="last_day_of_month">в последний день месяца</option>
                                {Array.from({length: 28}, (_, i) =>
                                    <option key={i+1} value={i+1}>{i+1}-е число каждого месяца</option>
                                )}
                            </select>
                            {/*<label className="form-checkbox">*/}
                            {/*    <input type="checkbox" name="firstPaymentOnlyPercents" checked={credit.firstPaymentOnlyPercents} onChange={this.onChange}/><i className="form-icon"/> Первый платеж - только проценты*/}
                            {/*</label>*/}
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Досрочные погашения</label>
                    {credit.payments.map((payment, i) =>
                        <div key={payment.key} className="payment d-flex">
                            <div className="payment-id mr-2">{i+1}.</div>
                            <div key={payment.key} className="payment-fields columns">
                                <div className="column col-3">
                                    <select name={`payment.${i}.period`} className="form-select" value={payment.period} onChange={this.changePayment}>
                                        <option value="0">Разовый</option>
                                        <option value="1">Раз в месяц</option>
                                        <option value="2">Раз в 2 месяца</option>
                                        <option value="3">Раз в 3 месяца</option>
                                        <option value="6">Раз в полгода</option>
                                        <option value="12">Раз в год</option>
                                    </select>
                                </div>
                                <div className="column col-5">
                                    <select name={`payment.${i}.reduceType`} className="form-select" value={payment.reduceType} onChange={this.changePayment}>
                                        <option value="reduce_period">Уменьшить срок кредита</option>
                                        <option value="reduce_sum">Уменьшить ежемесячный платеж</option>
                                    </select>
                                </div>
                                <div className="column col-4 d-flex">
                                    <input required type="date" name={`payment.${i}.startDate`} className="form-input" value={payment.startDate} onChange={this.changePayment}/>
                                    <button type="button" className="btn btn-action ml-2" onClick={this.removePayment} data-id={i}><i className="icon icon-cross"/></button>
                                </div>
                                <div className="column col-3 mt-2">
                                    <input required type="number" min="0" step="1" name={`payment.${i}.sum`} className="form-input" placeholder="Сумма" value={payment.sum} onChange={this.changePayment}/>
                                </div>
                                <div className="column col-9 mt-2">
                                    <select name={`payment.${i}.nextPaymentType`} className="form-select" value={payment.nextPaymentType} onChange={this.changePayment}>
                                        <option value="no_changes">Следующий платеж - без изменений</option>
                                        <option value="only_interest">Следующий платеж - только проценты</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    <button type="button" id="add-button" className="btn btn-link btn-sm" onClick={this.addPayment}><i className="icon icon-plus"/> Добавить досрочный платеж</button>
                </div>

                <div className="divider"/>

                <div className="form-horizontal">
                    <div className="form-group">
                        <div className="col-4 col-sm-12">
                            <label className="form-label"/>
                        </div>
                        <div className="col-8 col-sm-12">
                            <button type="submit" id="submit-button" className="btn btn-primary" onClick={this.onSubmit}>Рассчитать</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

const mapStateToProps = (store) => ({
    credit: selectors.getSelectedCredit(store)
});

const mapDispatchToProps = {
    changeCredit: actions.changeCredit,
    calculate: actions.calculate
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);