import React, {useState, useCallback} from 'react';
import cx from "classnames";

function key() { return Math.random().toString(36).slice(2); }

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
    const className = cx("btn mb-2", {"btn-block": block});
    return (
        <button type="button" className={className} onClick={onClick}>
            <i className="icon icon-plus"/> Добавить досрочный платеж
        </button>
    )
};

const Payment = ({i, payment, changePayment, removePayment, mobile}) => {
    return (
        <div className="payment">
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
    );
}

const FieldsPayments = React.memo(({payments, mobile, dispatch}) => {
    const [keys, setKeys] = useState(() => payments.map(key));

    const addPayment = useCallback(() => {
        dispatch({type: 'ADD_PAYMENT'});
        setKeys(keys => [...keys, key()]);
    }, [dispatch, setKeys]);

    const removePayment = useCallback(ev => {
        const id = parseInt(ev.currentTarget.dataset.id, 10);
        dispatch({type: 'REMOVE_PAYMENT', payload: {id}});
        setKeys(keys => keys.filter((_, i) => i !== id));
    }, [dispatch, setKeys]);

    const changePayment = useCallback(ev => {
        const [, i, name] = ev.target.name.split('.');
        const id = parseInt(i, 10);
        const value = ev.target.value;
        dispatch({type: 'CHANGE_PAYMENT', payload: {id, name, value}});
    }, [dispatch]);

    return (
        <React.Fragment>
            <div className="payment">
                <div className="mr-2"/>
                <AddButton block={mobile} onClick={addPayment}/>
            </div>
            {payments.map((payment, i) =>
                <Payment key={keys[i]} i={i} payment={payment} changePayment={changePayment}
                         removePayment={removePayment} mobile={mobile} />
            ).reverse()}
        </React.Fragment>
    )
});

export default FieldsPayments;