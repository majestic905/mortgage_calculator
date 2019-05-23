import React from 'react';
import {connect} from 'react-redux';
import {selectors, actions} from "./store";


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
            period: "", recalc: "1", date: "", next: "0", sum: ""
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
                            <label className="form-label" htmlFor="creditSum">Сумма кредита (руб.)</label>
                        </div>
                        <div className="col-8 col-sm-12 d-flex">
                            <input required type="number" min="0" step="1" name="creditSum" id="creditSum" className="form-input" value={credit.creditSum} onChange={this.onChange}/>
                            <span className="ml-2 text-nowrap">рублей</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-4 col-sm-12">
                            <label className="form-label" htmlFor="period">Срок кредита</label>
                        </div>
                        <div className="col-8 col-sm-12 d-flex">
                            <input required type="number" min="0" step="1" name="period" id="period" className="form-input" value={credit.period} onChange={this.onChange}/>
                            <span className="ml-2 text-nowrap">месяцев</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-4 col-sm-12">
                            <label className="form-label" htmlFor="dateStart">Дата выдачи кредита</label>
                        </div>
                        <div className="col-8 col-sm-12">
                            <input required type="date" id="dateStart" name="dateStart" className="form-input" value={credit.dateStart} onChange={this.onChange}/>
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
                            <label className="form-label" htmlFor="paymentWhen">Ежемесячные платежи</label>
                        </div>
                        <div className="col-8 col-sm-12">
                            <select name="paymentWhen" className="form-select" value={credit.paymentWhen} onChange={this.onChange}>
                                <option value="issueDay">в день выдачи кредита</option>
                                <option value="lastDayOfMonth">в последний день месяца</option>
                                {Array.from({length: 28}, (_, i) =>
                                    <option key={i+1} value={i+1}>{i+1}-е число каждого месяца</option>
                                )}
                            </select>
                            <label className="form-checkbox">
                                <input type="checkbox" name="firstPaymentOnlyPercents" checked={credit.firstPaymentOnlyPercents} onChange={this.onChange}/><i className="form-icon"/> Первый платеж - только проценты
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Досрочные погашения</label>
                    {credit.payments.map((payment, i) =>
                        <div key={payment.key} className="payment columns">
                            <div className="column col-3">
                                <select name={`payment.${i}.period`} className="form-select select-sm" value={payment.period} onChange={this.changePayment}>
                                    <option value="">Разовый</option>
                                    <option value="1M">Раз в месяц</option>
                                    <option value="2M">Раз в 2 месяца</option>
                                    <option value="3M">Раз в квартал</option>
                                    <option value="6M">Раз в полгода</option>
                                    <option value="1Y">Раз в год</option>
                                </select>
                            </div>
                            <div className="column col-5">
                                <select name={`payment.${i}.recalc`} className="form-select select-sm" value={payment.recalc} onChange={this.changePayment}>
                                    <option value="1">Уменьшить срок кредита</option>
                                    <option value="2">Уменьшить ежемесячный платеж</option>
                                </select>
                            </div>
                            <div className="column col-4 d-flex">
                                <input type="date" name={`payment.${i}.date`} className="form-input input-sm" value={payment.date} onChange={this.changePayment}/>
                                <button type="button" className="btn btn-action btn-sm ml-2" onClick={this.removePayment} data-id={i}><i className="icon icon-cross"/></button>
                            </div>
                            <div className="column col-3 mt-2">
                                <input type="number" name={`payment.${i}.sum`} className="form-input input-sm" placeholder="Сумма" value={payment.sum} onChange={this.changePayment}/>
                            </div>
                            <div className="column col-9 mt-2">
                                <select name={`payment.${i}.next`} className="form-select select-sm" value={payment.next} onChange={this.changePayment}>
                                    <option value="0">Следующий платеж - без изменений</option>
                                    <option value="1">Следующий платеж - только проценты</option>
                                </select>
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