import React from "react";
import {CreditSum, MonthsNum, StartDate, Percent, PaymentType, PaymentDay, ExtraPayment} from "./FormComponents";

function DesktopForm({credit, onChange, addPayment, removePayment, changePayment, calculate}) {
    return (
        <form id="form">
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

            <div className="divider"/>

            <div id="payments-wrapper" className="form-group">
                <label className="form-label">Досрочные погашения</label>
                {credit.payments.map((payment, i) =>
                    <div key={payment.key} className="payment d-flex">
                        <div className="mr-2">
                            <span>{(i+1).toString().padStart(2, "0")}.</span>
                        </div>
                        <div className="columns">
                            <ExtraPayment.Period index={i} value={payment.period} onChange={changePayment}/>
                            <ExtraPayment.StartDate index={i} value={payment.startDate} onChange={changePayment}/>
                            <ExtraPayment.Sum index={i} value={payment.sum} onChange={changePayment}/>
                            <ExtraPayment.ReduceType index={i} value={payment.reduceType} onChange={changePayment}/>
                            <ExtraPayment.NextPaymentType index={i} value={payment.nextPaymentType} onChange={changePayment} removePayment={removePayment}/>
                        </div>
                        <div className="ml-2">
                            <button type="button" className="btn btn-action" onClick={removePayment} data-id={i}>
                                <i className="icon icon-cross"/>
                            </button>
                        </div>
                    </div>
                )}
                <div className="payment d-flex">
                    <button type="button" id="add-button" className="btn btn-link btn-sm" onClick={addPayment}><i className="icon icon-plus"/> Добавить досрочный платеж</button>
                </div>
            </div>

            <div className="divider"/>

            <div className="form-horizontal">
                <div className="form-group">
                    <div className="col-4 col-sm-12"/>
                    <div className="col-8 col-sm-12">
                        <button type="button" className="btn btn-primary" onClick={calculate}>Рассчитать</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default DesktopForm;