import { createStore } from "redux";

export const actionTypes = {
    ADD_CREDIT: "ADD_CREDIT",
    CHANGE_CREDIT: "CHANGE_CREDIT",
    REMOVE_CREDIT: "REMOVE_CREDIT",
    SELECT_CREDIT: "SELECT_CREDIT",
    RENAME_CREDIT: "RENAME_CREDIT"
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
    })
};

export const selectors = {
    getCredits: store => store.credits,
    getSelectedId: store => store.selectedId,
    getSelectedCredit: store => store.credits[store.selectedId]
};


const initialState = {
    credits: [getEmptyCredit(), getEmptyCredit(), getEmptyCredit()],
    selectedId: 0
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
        default:
            return state;
    }
}

function getEmptyCredit() {
    return {
        creditSum: "",
        period: "",
        periodType: "years",
        dateStart: "",
        floatRate: "constant",
        percent: "",
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


export default createStore(rootReducer);