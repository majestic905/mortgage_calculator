import { createStore } from "redux";

export const actionTypes = {
    ADD_CREDIT: "ADD_CREDIT",
    CHANGE_CREDIT: "CHANGE_CREDIT",
    REMOVE_CREDIT: "REMOVE_CREDIT",
    SELECT_CREDIT: "SELECT_CREDIT",
    RENAME_CREDIT: "RENAME_CREDIT",
    CALCULATE: "CALCULATE"
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
    })
};

export const selectors = {
    getCredits: store => store.credits,
    getSelectedId: store => store.selectedId,
    getSelectedCredit: store => store.credits[store.selectedId],
    getCalculation: store => store.calculation
};

const initialState = {
    credits: [getEmptyCredit(), getEmptyCredit(), getEmptyCredit()],
    selectedId: 0,
    calculation: {error: null, data: []}
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.ADD_CREDIT: {
            const credits = [...state.credits];
            credits.push(getEmptyCredit());
            return {...state, credits};
        }
        case actionTypes.REMOVE_CREDIT: {
            const {id} = action.payload;

            const credits = [...state.credits];
            credits.splice(id, 1);

            let selectedId = state.selectedId;
            if (selectedId >= id)
                selectedId = Math.max(0, selectedId - 1);

            return {...state, credits, selectedId};
        }
        case actionTypes.SELECT_CREDIT: {
            const {id} = action.payload;
            return {...state, selectedId: id};
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
            try {
                const credit = state.credits[state.selectedId];
                const data = new Calculator().calculate(credit);
                const calculation = {error: null, data};
                return {...state, calculation};
            } catch (error) {
                const calculation = {error, data: []};
                return {...state, calculation};
            }
        }
        default:
            return state;
    }
}

function getEmptyCredit() {
    return {
        creditSum: "2224000",
        period: "84",
        dateStart: "2019-04-29",
        percent: "10.8",
        paymentType: "annuity",
        paymentWhen: "issueDay",
        firstPaymentOnlyPercents: false,
        payments: [],
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

    calculate(credit) {
        let balance = parseInt(credit.creditSum, 10);
        const period = parseInt(credit.period, 10);
        const percent = parseFloat(credit.percent);
        const dateStart = new Date(credit.dateStart);

        const t = percent/100/12;
        let pmt = balance * (t + t/(Math.pow((1+t), period) - 1));

        const data = [], D = dateStart.getDate();
        for (let n = 1, date = new Date(credit.dateStart); balance > 0; ++n) {
            let interest = 0;

            const targetMonth = (date.getMonth() + 1) % 12;
            const targetDate = Math.min(D, this.daysInMonth(targetMonth, date.getFullYear()));
            while (date.getDate() !== targetDate || date.getMonth() !== targetMonth) {
                date.setDate(date.getDate() + 1);
                interest += balance * percent/100/this.daysInYear(date.getFullYear());
            }

            if (n === period)
                pmt = interest + balance;
            const loan = pmt - interest;
            balance -= loan;
            data.push({date: new Date(date), interest, loan, pmt, balance});
        }

        return data;
    }
}


export default createStore(rootReducer);