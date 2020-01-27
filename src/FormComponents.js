import React from "react";

export const Accordion = ({name, title, defaultChecked, children}) => {
    return (
        <div className="accordion mb-2">
            <input type="checkbox" id={name} name={name} hidden defaultChecked={defaultChecked}/>
            <label className="accordion-header h4" htmlFor={name}>
                <i className="icon icon-arrow-right mr-1"/>{title}
            </label>
            <div className="accordion-body">
                {children}
            </div>
        </div>
    )
}

export const CreditSum = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="sum">Сумма кредита (руб.)</label>
            </div>
            <div className="col-8 col-sm-12 d-flex">
                <input required type="number" min="0" step="1" name="sum" id="sum" className="form-input" value={value} onChange={onChange}/>
                <span className="ml-2 text-nowrap">рублей</span>
            </div>
        </div>
    )
};

export const MonthsNum = ({value, onChange}) => {
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

export const StartDate = ({value, onChange}) => {
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

export const Percent = ({value, onChange}) => {
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

// TODO: no tooltip should be on mobile
export const PaymentType = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="paymentType">Вид платежа</label>
            </div>
            <div className="col-8 col-sm-12">
                <label className="form-radio form-inline tooltip" data-tooltip="Аннуитетный платеж – вариант ежемесячного платежа по кредиту, когда размер ежемесячного платежа остаётся постоянным на всём периоде кредитования.">
                    <input type="radio" name="paymentType" value="annuity" checked={value === "annuity"} onChange={onChange}/><i className="form-icon"/> Аннуитетный
                </label>
                <label className="form-radio form-inline tooltip" data-tooltip="Дифференцированный платеж – вариант ежемесячного платежа по кредиту, когда размер ежемесячного платежа по погашению кредита постепенно уменьшается к концу периода кредитования.">
                    <input type="radio" name="paymentType" value="differentiated" checked={value === "differentiated"} onChange={onChange}/><i className="form-icon"/> Дифференцированный
                </label>
            </div>
        </div>
    )
};

export const PaymentDay = ({value, onChange}) => {
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
}

export const ExtraPayment = {
    Period: ({index, value, onChange}) => {
        return (
            <div className="form-group column col-sm-12 col-lg-4 col-xl-2 col-4">
                <select name={`payment.${index}.period`} className="form-select" value={value} onChange={onChange}>
                    <option value="0">Разовый</option>
                    <option value="1">Раз в месяц</option>
                    <option value="2">Раз в 2 месяца</option>
                    <option value="3">Раз в 3 месяца</option>
                    <option value="6">Раз в полгода</option>
                    <option value="12">Раз в год</option>
                </select>
            </div>
        )
    },
    StartDate: ({index, value, onChange}) => {
        return (
            <div className="form-group column col-sm-6 col-lg-4 col-xl-2 col-4">
                <input required type="date" name={`payment.${index}.startDate`} className="form-input" value={value} onChange={onChange}/>
            </div>
        )
    },
    Sum: ({index, value, onChange}) => {
        return (
            <div className="form-group column col-sm-6 col-lg-4 col-xl-2 col-4">
                <input required type="number" min="0" step="1" name={`payment.${index}.sum`} className="form-input" placeholder="Сумма" value={value} onChange={onChange}/>
            </div>
        )
    },
    ReduceType: ({index, value, onChange}) => {
        return (
            <div className="form-group column col-md-12 col-lg-6 col-xl-3 col-6">
                <select name={`payment.${index}.reduceType`} className="form-select" value={value} onChange={onChange}>
                    <option value="reduce_period">Уменьшить срок кредита</option>
                    <option value="reduce_sum">Уменьшить ежемесячный платеж</option>
                </select>
            </div>
        )
    },
    NextPaymentType: ({index, value, onChange, removePayment}) => {
        return (
            <div className="form-group column col-md-12 col-lg-6 col-xl-3 col-6 d-flex">
                <select name={`payment.${index}.nextPaymentType`} className="form-select" value={value} onChange={onChange}>
                    <option value="no_changes">Следующий платеж - без изменений</option>
                    <option value="only_interest">Следующий платеж - только проценты</option>
                </select>
            </div>
        )
    }
}