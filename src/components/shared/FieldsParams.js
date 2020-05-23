import React from 'react';

const CreditSum = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="sum">Сумма кредита</label>
            </div>
            <div className="col-8 col-sm-12 d-flex">
                <input required type="number" min="0" step="1" name="sum" id="sum" className="form-input" value={value} onChange={onChange}/>
                <span className="ml-2 text-nowrap">рублей</span>
            </div>
        </div>
    )
};

const MonthsNum = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="monthsNum">Срок кредита</label>
            </div>
            <div className="col-8 col-sm-12 d-flex">
                <input required type="number" min="0" step="1" name="monthsNum" id="monthsNum" className="form-input" value={value} onChange={onChange}/>
                <span className="ml-2 text-nowrap">месяцев</span>
            </div>
        </div>
    )
};

const StartDate = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="startDate">Дата выдачи кредита</label>
            </div>
            <div className="col-8 col-sm-12">
                <input required type="date" id="startDate" name="startDate" className="form-input" value={value} onChange={onChange}/>
            </div>
        </div>
    )
};

const Percent = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="percent">Процентная ставка</label>
            </div>
            <div className="col-8 col-sm-12 d-flex">
                <input required type="number" min="0" step="0.1" name="percent" id="percent" className="form-input" value={value} onChange={onChange}/>
                <span className="ml-2 text-nowrap">% годовых</span>
            </div>
        </div>
    )
};

const PaymentType = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="paymentType">Вид платежа</label>
            </div>
            <div className="col-8 col-sm-12">
                <label className="form-radio form-inline" data-tooltip="Аннуитетный платеж – вариант ежемесячного платежа по кредиту, когда размер ежемесячного платежа остаётся постоянным на всём периоде кредитования.">
                    <input type="radio" name="paymentType" value="annuity" checked={value === "annuity"} onChange={onChange}/><i className="form-icon"/> Аннуитетный
                </label>
                <label className="form-radio form-inline" data-tooltip="Дифференцированный платеж – вариант ежемесячного платежа по кредиту, когда размер ежемесячного платежа по погашению кредита постепенно уменьшается к концу периода кредитования.">
                    <input type="radio" name="paymentType" value="differentiated" checked={value === "differentiated"} onChange={onChange}/><i className="form-icon"/> Дифференцированный
                </label>
            </div>
        </div>
    )
};

const PaymentDay = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="paymentDay">Ежемесячные платежи</label>
            </div>
            <div className="col-8 col-sm-12">
                <select name="paymentDay" className="form-select" value={value} onChange={onChange}>
                    <option value="issue_day">в день выдачи кредита</option>
                    <option value="last_day_of_month">в последний день месяца</option>
                    {Array.from({length: 28}, (_, i) =>
                        <option key={i+1} value={i+1}>{i+1}-е число каждого месяца</option>
                    )}
                </select>
            </div>
        </div>
    )
};

const FieldsParams = React.memo(({credit, dispatch}) => {
    const onChange = React.useCallback(ev => dispatch({
        type: 'CHANGE_CREDIT',
        payload: {
            name: ev.target.name,
            value: ev.target.type === "checkbox" ? ev.target.checked : ev.target.value
        }
    }), [dispatch]);

    return (
        <div className="form-horizontal columns">
            <div className="column col-lg-12 col-xl-6 col-12 mt-2">
                <CreditSum value={credit.sum} onChange={onChange}/>
                <MonthsNum value={credit.monthsNum} onChange={onChange}/>
                <StartDate value={credit.startDate} onChange={onChange}/>
            </div>

            <div className="column col-lg-12 col-xl-6 col-12 mt-2">
                <Percent value={credit.percent} onChange={onChange}/>
                <PaymentType value={credit.paymentType} onChange={onChange}/>
                <PaymentDay value={credit.paymentDay} onChange={onChange}/>
            </div>
        </div>
    )
});

export default FieldsParams;