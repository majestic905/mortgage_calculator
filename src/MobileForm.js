import React from 'react';
import {CreditSum, MonthsNum, StartDate, Percent, PaymentType, PaymentDay, Accordion, ExtraPayment} from "./FormComponents";

function MobileForm({credit, onChange, addPayment, removePayment, changePayment, calculate}) {
    return (
        <form id="form">
            <Accordion name="accordion-details" title="Параметры кредита" defaultChecked={credit.payments.length === 0}>
                <CreditSum value={credit.sum} onChange={onChange}/>
                <MonthsNum value={credit.monthsNum} onChange={onChange}/>
                <StartDate value={credit.startDate} onChange={onChange}/>
                <Percent value={credit.percent} onChange={onChange}/>
                <PaymentType value={credit.paymentType} onChange={onChange}/>
                <PaymentDay value={credit.paymentDay} onChange={onChange}/>
            </Accordion>

            <div className="divider"/>

            <Accordion name="accordion-payments" title="Досрочные погашения" defaultChecked={credit.payments.length !== 0}>
                {credit.payments.map((payment, i) =>
                    <div key={payment.key} className="payment columns">
                        <div className="form-group column col-12 d-flex">
                            <span className="h5">{i+1}.</span>
                            <button type="button" className="btn btn-sm" onClick={removePayment} data-id={i}><i className="icon icon-cross"/> Удалить</button>
                        </div>
                        <ExtraPayment.Period index={i} value={payment.period} onChange={changePayment}/>
                        <ExtraPayment.StartDate index={i} value={payment.startDate} onChange={changePayment}/>
                        <ExtraPayment.Sum index={i} value={payment.sum} onChange={changePayment}/>
                        <ExtraPayment.ReduceType index={i} value={payment.reduceType} onChange={changePayment}/>
                        <ExtraPayment.NextPaymentType index={i} value={payment.nextPaymentType} onChange={changePayment} removePayment={removePayment}/>
                    </div>
                )}
                <div className="px-1 py-1">
                    <button type="button" className="btn btn-block" onClick={addPayment}><i className="icon icon-plus"/> Добавить досрочный платеж</button>
                </div>
            </Accordion>

            <div className="divider"/>

            <div className="py-1">
                <button type="button" className="btn btn-block btn-primary" onClick={calculate}>Рассчитать</button>
            </div>
        </form>
    )
}

export default MobileForm;