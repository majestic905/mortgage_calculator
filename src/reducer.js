/* global chrome */

export const actionTypes = {
    ADD_CREDIT: "ADD_CREDIT",
    CHANGE_CREDIT: "CHANGE_CREDIT",
    REMOVE_CREDIT: "REMOVE_CREDIT",
    SELECT_CREDIT: "SELECT_CREDIT",
    RENAME_CREDIT: "RENAME_CREDIT",
    CALCULATE: "CALCULATE",
    MARK_SAVED: "MARK_SAVED",
};

export const actions = {
    addCredit: () => ({
        type: actionTypes.ADD_CREDIT,
    }),
    removeCredit: (id) => ({
        type: actionTypes.REMOVE_CREDIT,
        payload: {id},
    }),
    selectCredit: (id) => ({
        type: actionTypes.SELECT_CREDIT,
        payload: {id}
    }),
    changeCredit: (field, value) => ({
        type: actionTypes.CHANGE_CREDIT,
        payload: {field, value}
    }),
    renameCredit: (id, name) => ({
        type: actionTypes.RENAME_CREDIT,
        payload: {id, name}
    }),
    calculate: () => ({
        type: actionTypes.CALCULATE
    }),
    markSaved: () => ({
        type: actionTypes.MARK_SAVED
    }),
    saveChanges: () => (dispatch, getState) => {
        if (process.env.NODE_ENV === "development")
            dispatch(actions.markSaved());
        else
            chrome.storage.local.set(
                {state: getState()},
                () => dispatch(actions.markSaved())
            );
    }
};

export const selectors = {
    getCredits: store => store.credits,
    getSelectedId: store => store.selectedId,
    getSelectedCredit: store => store.credits[store.selectedId],
    getCalculation: store => store.calculation,
    getModified: store => store.modified
};

const initialState = {
    credits: [getEmptyCredit(), getEmptyCredit(), getEmptyCredit()],
    selectedId: 0,
    calculation: {error: null, data: []},
    modified: false,
};

export default function rootReducer(state = initialState, action) {
    if (Object.values(actionTypes).includes(action.type) && action.type !== actionTypes.MARK_SAVED)
        state = {...state, modified: true};

    switch (action.type) {
        case actionTypes.ADD_CREDIT: {
            const credits = [...state.credits, getEmptyCredit()];
            return {...state, credits};
        }
        case actionTypes.REMOVE_CREDIT: {
            const {id} = action.payload;
            const credits = [...state.credits];

            if (credits.length > 1) {
                credits.splice(id, 1);

                let selectedId = state.selectedId;
                if (selectedId >= id)
                    selectedId = Math.max(0, selectedId - 1);

                return {...state, credits, selectedId};
            }

            return state;
        }
        case actionTypes.SELECT_CREDIT: {
            const {id} = action.payload;

            const credit = state.credits[id];
            const calculation = calculate(credit);

            return {...state, selectedId: id, calculation};
        }
        case actionTypes.CHANGE_CREDIT: {
            const {field, value} = action.payload;
            const selectedId = state.selectedId;
            const credits = state.credits.slice();
            credits[selectedId] = {...credits[selectedId], [field]: value};
            return {...state, credits}
        }
        case actionTypes.RENAME_CREDIT: {
            const {id, name} = action.payload;
            const credits = [...state.credits];
            credits[id] = {...credits[id], meta: {...credits[id].meta, name}};
            return {...state, credits};
        }
        case actionTypes.CALCULATE: {
            const credit = state.credits[state.selectedId];
            const calculation = calculate(credit);
            return {...state, calculation};
        }
        case actionTypes.MARK_SAVED: {
            return {...state, modified: false}
        }
        default:
            return state;
    }
}

function getEmptyCredit() {
    return {
        sum: "2224000",
        monthsNum: "84",
        startDate: "2019-04-29",
        percent: "10.8",
        paymentType: "annuity",
        paymentDay: "issue_day",
        // firstPaymentOnlyPercents: false,
        payments: [
            {
                key: Math.random().toString(36).slice(2),
                period: "0",
                reduceType: "reduce_period",
                startDate: "2019-05-21",
                sum: "42700",
                nextPaymentType: "only_interest"
            }
        ],
        meta: {
            key: Math.random().toString(36).slice(2),
            name: "Новый расчет",
            date: new Date().toISOString()
        }
    };
}

class Calculator {
    DAYS_IN_MONTH = [31, undefined, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    isLeapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    daysInMonth(month, year) {
        if (month !== /* Feb */ 1)
            return this.DAYS_IN_MONTH[month];
        return this.isLeapYear(year) ? 29 : 28;
    }

    daysInYear(year) {
        return this.isLeapYear(year) ? 366 : 365;
    }

    nextDate(dateObj, paymentDay) {
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const date = Math.min(paymentDay, this.daysInMonth(month % 12, dateObj.getFullYear()));
        return new Date(year, month, date);
    }

    calculate(credit) {
        if (!credit.sum || !credit.monthsNum || !credit.percent || !credit.startDate ||
            credit.payments.some(payment => !payment.startDate || !payment.sum))
            throw Error("Не все необходимые поля заполнены");

        const monthsNum = parseInt(credit.monthsNum, 10);
        const startDate = new Date(credit.startDate);

        let paymentDay = null;
        switch (credit.paymentDay) {
            case 'issue_day': paymentDay = startDate.getDate(); break;
            case 'last_day_of_month': paymentDay = 31; break;
            default: paymentDay = parseInt(credit.paymentDay, 10);
        }

        const payments = [];
        for (let i = 1, date = new Date(startDate); i <= monthsNum; ++i) {
            date = this.nextDate(date, paymentDay);
            payments.push({type: 'regular', date, index: i});
        }

        let endDate = payments[payments.length-1].date;
        for (const payment of credit.payments) {
            let date = new Date(payment.startDate);
            paymentDay = date.getDate();
            const sum = parseInt(payment.sum, 10);
            const period = parseInt(payment.period, 10);
            const {reduceType, nextPaymentType} = payment;

            while (date < endDate) {
                payments.push({type: 'extra', date, sum, reduceType, nextPaymentType});
                if (period > 0) {
                    for (let i = 0; i < period; ++i)
                        date = this.nextDate(date, paymentDay);
                } else
                    break;
            }
        }

        payments.sort((a, b) => a.date - b.date);

        const sum = parseInt(credit.sum, 10);
        const percent = parseFloat(credit.percent)/100;

        return credit.paymentType === "annuity"
               ? this.calcAnnuity(sum, monthsNum, percent, startDate, payments)
               : this.calcDifferentiated(sum, monthsNum, percent, startDate, payments);
    }

    calcAnnuityPMT(sum, monthsNum, percent) {
        const t = percent / 12;
        return parseFloat((sum * (t + t/(Math.pow((1 + t), monthsNum) - 1))).toFixed(2));
    }

    calcAnnuity(sum, monthsNum, percent, start, payments) {
        let pmt = this.calcAnnuityPMT(sum, monthsNum, percent),
            date = new Date(start),
            loan, interest = 0,
            lastRegularId = 1,
            nextOnlyInterest = false;
        payments = payments.map(obj => ({...obj}));

        for (const payment of payments) {
            if (sum <= 0)
                break;

            while (+date < +payment.date) {
                date.setDate(date.getDate() + 1);
                interest += sum * percent / this.daysInYear(date.getFullYear());
            }

            if (payment.type === "extra" && payment.sum < interest) {
                payment.error = 'Внесенной суммы досрочного погашения недостаточно для уплаты процентов. Платеж не засчитан.';
                continue;
            }

            interest = parseFloat(interest.toFixed(2));
            loan = nextOnlyInterest ? 0 : Math.min((payment.sum || pmt) - interest, sum);
            sum -= loan;
            Object.assign(payment, {interest, loan, total: interest + loan, balance: sum});
            interest = 0;

            if (payment.type === "regular") {
                lastRegularId = payment.index;
                nextOnlyInterest = false;
            } else {
                if (payment.reduceType === "reduce_sum")
                    pmt = this.calcAnnuityPMT(sum, monthsNum - lastRegularId, percent);
                if (payment.nextPaymentType === "only_interest")
                    nextOnlyInterest = true;
            }
        }

        if (sum > 0) {
            const payment = payments[payments.length-1];
            payment.loan += sum;
            payment.total += sum;
            payment.balance = 0;
        }

        return payments
            .filter(payment => !!payment.total)
            .map(payment => ({...payment, date: payment.date.toISOString()}))
    }

    calcDifferentiated(sum, monthsNum, percent, start, payments) {
        let pmt = parseFloat((sum / monthsNum).toFixed(2)),
            date = new Date(start),
            interest = 0,
            lastRegularId = 1,
            nextOnlyInterest = false;
        payments = payments.map(obj => ({...obj}));

        for (const payment of payments) {
            if (sum <= 0)
                break;

            while (+date < +payment.date) {
                date.setDate(date.getDate() + 1);
                interest += sum * percent / this.daysInYear(date.getFullYear());
            }

            interest = parseFloat(interest.toFixed(2));
            let loan = null;
            if (payment.type === "regular") {
                loan = nextOnlyInterest ? 0 : Math.min(pmt, sum);
            } else {
                if (payment.sum < interest) {
                    payment.error = 'Внесенной суммы досрочного погашения недостаточно для уплаты процентов. Платеж не засчитан.';
                    continue;
                } else {
                    loan = Math.min(payment.sum - interest, sum);
                }
            }

            sum -= loan;
            Object.assign(payment, {interest, loan, total: interest + loan, balance: sum});
            interest = 0;

            if (payment.type === "regular") {
                lastRegularId = payment.index;
                nextOnlyInterest = false;
            } else {
                if (payment.reduceType === "reduce_sum")
                    pmt = parseFloat((sum / (monthsNum - lastRegularId)).toFixed(2));
                if (payment.nextPaymentType === "only_interest")
                    nextOnlyInterest = true;
            }
        }

        if (sum > 0) {
            const payment = payments[payments.length-1];
            payment.loan += sum;
            payment.total += sum;
            payment.balance = 0;
        }

        return payments
            .filter(payment => !!payment.total)
            .map(payment => ({...payment, date: payment.date.toISOString()}))
    }
}

function calculate(credit) {
    try {
        const data = new Calculator().calculate(credit);
        return {error: null, data};
    } catch (error) {
        return {error, data: []};
    }
}