export default class Calculator {
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
        const pmt = sum * (t + t/(Math.pow((1 + t), monthsNum) - 1));
        return parseFloat(pmt.toFixed(2));
    }

    calcAnnuity(sum, monthsNum, percent, start, payments) {
        let pmt = this.calcAnnuityPMT(sum, monthsNum, percent),
            date = new Date(start),
            loan, interest = 0,
            nextOnlyInterest = false,
            alreadyReducedInThisMonth = false;
        payments = payments.map(obj => ({...obj}));

        for (const payment of payments) {
            if (sum <= 0)
                break;

            while (+date < +payment.date) {
                date.setDate(date.getDate() + 1);
                interest += sum * percent / this.daysInYear(date.getFullYear());
            }
            interest = parseFloat(interest.toFixed(2));

            if (payment.type === "regular") {
                loan = nextOnlyInterest ? 0 : Math.min(pmt - interest, sum);
                nextOnlyInterest = false;
                alreadyReducedInThisMonth = false;
            } else {
                if (payment.sum < interest) {
                    payment.error = 'Внесенной суммы досрочного погашения недостаточно для уплаты процентов. Платеж не засчитан.';
                    continue;
                }
                loan = Math.min(payment.sum - interest, sum);
                nextOnlyInterest = payment.nextPaymentType === "only_interest";

                if (payment.reduceType === "reduce_sum") {
                    let oldPMT = pmt;
                    let t = percent / 12;
                    let newMonthsNum = Math.log(pmt/(pmt - sum * t))/Math.log(1 + t) - (1 - alreadyReducedInThisMonth);
                    newMonthsNum = Math.abs(Math.round(newMonthsNum) - newMonthsNum) < 0.01 ? Math.round(newMonthsNum) : Math.ceil(newMonthsNum);
                    pmt = this.calcAnnuityPMT(sum - loan, newMonthsNum, percent);
                    alreadyReducedInThisMonth = true;
                    payment.reduce = parseFloat((oldPMT - pmt).toFixed(2));
                }
            }

            sum -= loan;
            Object.assign(payment, {interest, loan, total: interest + loan, balance: sum});
            interest = 0;
        }

        if (sum > 0) {
            const payment = payments[payments.length-1];
            payment.loan += sum;
            payment.total += sum;
            payment.balance = 0;
        }

        return payments
            .filter(payment => !!payment.total || !!payment.error)
            .map(payment => ({...payment, date: payment.date.toISOString()}))
    }

    calcDifferentiated(sum, monthsNum, percent, start, payments) {
        let pmt = parseFloat((sum / monthsNum).toFixed(2)),
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
            interest = parseFloat(interest.toFixed(2));

            if (payment.type === "regular") {
                loan = nextOnlyInterest ? 0 : Math.min(pmt, sum);
                lastRegularId = payment.index;
                nextOnlyInterest = false;
            } else {
                if (payment.sum < interest) {
                    payment.error = 'Внесенной суммы досрочного погашения недостаточно для уплаты процентов. Платеж не засчитан.';
                    continue;
                }
                loan = Math.min(payment.sum - interest, sum);

                if (payment.reduceType === "reduce_sum")
                    pmt = parseFloat((sum / (monthsNum - lastRegularId)).toFixed(2));

                nextOnlyInterest = (payment.nextPaymentType === "only_interest");
            }

            sum -= loan;
            Object.assign(payment, {interest, loan, total: interest + loan, balance: sum});
            interest = 0;
        }

        if (sum > 0) {
            const payment = payments[payments.length-1];
            payment.loan += sum;
            payment.total += sum;
            payment.balance = 0;
        }

        return payments
            .filter(payment => !!payment.total || !!payment.error)
            .map(payment => ({...payment, date: payment.date.toISOString()}))
    }
}