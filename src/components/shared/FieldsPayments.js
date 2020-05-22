import React from 'react';
import cx from "classnames";


function generateEmptyPayment() {
    return {
        key: Math.random().toString(36).slice(2),
        period: "0", startDate: "", nextPaymentType: "only_interest", reduceType: "reduce_sum", sum: "0"
    }
}

const Period = ({index, value, onChange}) => {
    return (
        <div className="column col-sm-12 col-lg-4 col-xl-2 col-4">
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
};

const StartDate = ({index, value, onChange}) => {
    return (
        <div className="column col-sm-6 col-lg-4 col-xl-2 col-4">
            <input required type="date" name={`payment.${index}.startDate`} className="form-input" value={value} onChange={onChange}/>
        </div>
    )
};

const Sum = ({index, value, onChange}) => {
    return (
        <div className="column col-sm-6 col-lg-4 col-xl-2 col-4">
            <input required type="number" min="0" step="1" name={`payment.${index}.sum`} className="form-input" placeholder="Сумма" value={value} onChange={onChange}/>
        </div>
    )
};

const ReduceType = ({index, value, onChange}) => {
    return (
        <div className="column col-md-12 col-lg-6 col-xl-3 col-6">
            <select name={`payment.${index}.reduceType`} className="form-select" value={value} onChange={onChange}>
                <option value="reduce_period">Уменьшить срок кредита</option>
                <option value="reduce_sum">Уменьшить ежемесячный платеж</option>
            </select>
        </div>
    )
};

const NextPaymentType = ({index, value, onChange}) => {
    return (
        <div className="column col-md-12 col-lg-6 col-xl-3 col-6 d-flex">
            <select name={`payment.${index}.nextPaymentType`} className="form-select" value={value} onChange={onChange}>
                <option value="no_changes">Следующий платеж - без изменений</option>
                <option value="only_interest">Следующий платеж - только проценты</option>
            </select>
        </div>
    )
};

const RemoveButton = ({mobile, paymentIndex, onClick}) => {
    if (mobile)
        return (
            <button type="button" className="btn btn-sm" onClick={onClick} data-id={paymentIndex}>
                <i className="icon icon-cross"/> Удалить
            </button>
        );

    return (
        <button type="button" className="btn btn-action" onClick={onClick} data-id={paymentIndex}>
            <i className="icon icon-cross"/>
        </button>
    )
};

const AddButton = ({block, onClick}) => {
    const className = cx("btn", {"btn-block": block});
    return (
        <button type="button" className={className} onClick={onClick}>
            <i className="icon icon-plus"/> Добавить досрочный платеж
        </button>
    )
};

const FieldsPayments = React.memo(({payments, mobile, onChange}) => {
    const addPayment = () => {
        const paymentz = payments.slice();
        paymentz.push(generateEmptyPayment());
        onChange({target: {name: 'payments', value: paymentz}});
    };

    const removePayment = (ev) => {
        const id = parseInt(ev.currentTarget.dataset.id, 10);
        const paymentz = payments.slice();
        paymentz.splice(id, 1);
        onChange({target: {name: 'payments', value: paymentz}});
    };

    const changePayment = (ev) => {
        const [, i, field] = ev.target.name.split('.');
        const paymentz = payments.slice();
        const index = parseInt(i, 10);
        paymentz[index] = {...paymentz[index], [field]: ev.target.value};
        onChange({target: {name: 'payments', value: paymentz}});
    };

    return (
        <React.Fragment>
            {payments.map((payment, i) =>
                <div key={payment.key} className="payment">
                    <div className="mr-2">{i+1}.</div>
                    <div className="columns col-gapless">
                        <Period index={i} value={payment.period} onChange={changePayment}/>
                        <StartDate index={i} value={payment.startDate} onChange={changePayment}/>
                        <Sum index={i} value={payment.sum} onChange={changePayment}/>
                        <ReduceType index={i} value={payment.reduceType} onChange={changePayment}/>
                        <NextPaymentType index={i} value={payment.nextPaymentType} onChange={changePayment} removePayment={removePayment}/>
                    </div>
                    <div className="ml-2">
                        <RemoveButton mobile={mobile} onClick={removePayment} paymentIndex={i}/>
                    </div>
                </div>
            )}
            <div className="payment">
                <div className="mr-2"/>
                <AddButton block={mobile} onClick={addPayment}/>
            </div>
        </React.Fragment>
    )
});

export default FieldsPayments;