const DAYS_IN_MONTH = [31, undefined, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const isLeapYear = (year) => ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
const getDaysInMonth = (month, year) => (month !== /* Feb */ 1 ? DAYS_IN_MONTH[month] : isLeapYear(year) ? 29 : 28);
const getDaysInYear = (year) => isLeapYear(year) ? 366 : 365;
const formatDate = (d) => ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." + d.getFullYear();

function calcAnnuityPMT(sum, monthsNum, percent) {
    const t = percent / 12;
    const pmt = sum * (t + t/(Math.pow((1 + t), monthsNum) - 1));
    return parseFloat(pmt.toFixed(2));
}

function calcMonthsNum(pmt, balance, percent) {
    const p = percent / 12;
    const n = Math.log(pmt/(pmt - balance * p))/Math.log(1 + p);
    return Math.ceil(n - 0.01);
}

class Payment {
    constructor({startDate, paymentDay, period, sum, reduceType, nextPaymentType}) {
        this.startDate = new Date(startDate);
        this.paymentDay = paymentDay || this.startDate.getDate();
        this.period = period === undefined ? 1 : period;
        this.reduceType = reduceType || 'reduce_period';
        this.nextPaymentType = nextPaymentType || 'no_changes';
        this.sum = sum || 0;

        this.nextDate = new Date(this.startDate);
    }

    getNextDate() {
        const year = this.nextDate.getFullYear();
        const month = this.nextDate.getMonth() + this.period;
        const date = Math.min(this.paymentDay, getDaysInMonth(month % 12, year)); // '% 12' to set january from 12 to 0
        return new Date(year, month, date);
    }

    isPaymentDay(date) {
        return formatDate(this.nextDate) === formatDate(date);
    }
}

class RegularPayment extends Payment {
    constructor(props) {
        super(props);

        this.nextDate = this.getNextDate();
        this.index = 0;
    }

    paymentDue(date) {
        if (this.isPaymentDay(date)) {
            this.index += 1;
            this.nextDate = this.getNextDate();
            return {sum: this.sum, reduceType: this.reduceType, nextPaymentType: this.nextPaymentType, date: formatDate(date),
                index: this.index
            };
        }
    }
}

class ExtraPayment extends Payment {
    paymentDue(date) {
        if (this.isPaymentDay(date)) {
            this.nextDate = this.getNextDate();
            return {sum: this.sum, reduceType: this.reduceType, nextPaymentType: this.nextPaymentType, date: formatDate(date)};
        }
    }
}

export default function calculate(credit) {
    if (!credit.sum || !credit.monthsNum || !credit.percent || !credit.startDate || !credit.paymentType ||
        credit.payments.some(payment => !payment.startDate || !payment.sum))
        throw Error("Не все необходимые поля заполнены");

    let monthsNum = parseInt(credit.monthsNum, 10);
    let balance = parseInt(credit.sum, 10);
    const percent = parseFloat(credit.percent)/100;
    const {startDate, payments, paymentType} = credit;

    const paymentDay = credit.paymentDay === 'issue_day' ? parseInt(startDate.slice(-2), 10)
        : credit.paymentDay === 'last_day_of_month' ? 31
            : parseInt(credit.paymentDay, 10);

    return paymentType === "annuity"
        ? calcAnnuity({startDate, monthsNum, balance, percent, payments, paymentDay})
        : calcDifferentiated({startDate, monthsNum, balance, percent, payments, paymentDay});
}

function calcAnnuity({startDate, monthsNum, balance, percent, payments, paymentDay}) {
    payments = [
        new RegularPayment({startDate, paymentDay, sum: calcAnnuityPMT(balance, monthsNum, percent)}),
        ...payments.map(payment => new ExtraPayment({
            ...payment,
            sum: parseInt(payment.sum, 10),
            period: parseInt(payment.period, 10)
        }))
    ];

    let currentDate = new Date(startDate);
    let loan = 0, interest = 0;
    let nextOnlyInterest = false;
    let monthsPassed = 0;
    const data = [];

    while (balance > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        interest += balance * percent / getDaysInYear(currentDate.getFullYear());

        for (const item of payments) {
            const payment = item.paymentDue(currentDate);
            if (!payment) continue;

            const isRegular = !!payment.index;
            interest = parseFloat(interest.toFixed(2));
            // nextOnlyInterest can be true only after extra payment, since regular payment always yields {nextPaymentType: 'no_changes'}
            loan = isRegular && nextOnlyInterest ? 0 : Math.min(payment.sum - interest, balance);
            nextOnlyInterest = payment.nextPaymentType === 'only_interest';
            monthsPassed += isRegular;

            // regular payment cannot satisfy the next condition since payment.sum is precalculated
            if (loan < 0) { // i.e. payment.sum < interest
                payment.error = 'Внесенной суммы досрочного погашения недостаточно для уплаты процентов. Платеж не засчитан.';
                data.push(payment);
                continue;
            }

            // regular payment always yields {reduceType: 'reduce_period'}
            if (payment.reduceType === "reduce_sum") {
                monthsNum = calcMonthsNum(payments[0].sum, balance, percent) - (monthsPassed > 0);
                const pmt = calcAnnuityPMT(balance - loan, monthsNum, percent);
                payment.reduce = payments[0].sum - pmt;
                payments[0].sum = pmt;
                monthsPassed = 0;
            }

            balance -= loan;
            data.push({...payment, interest, loan, total: interest + loan, balance});
            interest = 0;
        }
    }

    return data;
}

function calcDifferentiated({startDate, monthsNum, balance, percent, payments, paymentDay}) {
    payments = [
        new RegularPayment({startDate, paymentDay, sum: parseFloat((balance / monthsNum).toFixed(2))}),
        ...payments.map(payment => new ExtraPayment({
            ...payment,
            sum: parseInt(payment.sum, 10),
            period: parseInt(payment.period, 10)
        }))
    ];

    let currentDate = new Date(startDate);
    let loan = 0, interest = 0;
    let nextOnlyInterest = false;
    let monthsPassed = 0;
    const data = [];

    while (balance > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        interest += balance * percent / getDaysInYear(currentDate.getFullYear());

        for (const item of payments) {
            const payment = item.paymentDue(currentDate);
            if (!payment) continue;

            const isRegular = !!payment.index;
            interest = parseFloat(interest.toFixed(2));
            // nextOnlyInterest can be true only after extra payment, since regular payment always yields {nextPaymentType: 'no_changes'}
            loan = isRegular ? (nextOnlyInterest ? 0 : Math.min(payment.sum, balance)) : Math.min(payment.sum - interest, balance);
            nextOnlyInterest = payment.nextPaymentType === 'only_interest';
            monthsPassed += isRegular;

            if (loan < 0) {
                payment.error = 'Внесенной суммы досрочного погашения недостаточно для уплаты процентов. Платеж не засчитан.';
                data.push(payment);
                continue;
            }

            // regular payment always yields {reduceType: 'reduce_period'}
            if (payment.reduceType === "reduce_sum") {
                monthsNum = Math.ceil(balance / payments[0].sum - 0.01) - (monthsPassed > 0);
                const pmt = parseFloat(((balance - loan) / monthsNum).toFixed(2));
                payment.reduce = payments[0].sum - pmt;
                payments[0].sum = pmt;
                monthsPassed = 0;
            }

            balance -= loan;
            data.push({...payment, interest, loan, total: interest + loan, balance});
            interest = 0;
        }
    }

    return data;
}