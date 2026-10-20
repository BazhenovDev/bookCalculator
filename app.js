const readline = require('node:readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class DebtCalculatorPerPerson {
    constructor(person) {
        this.person = person;
        this.totalDebt = 0;
        this.overdueBooksCount = 0;
        this.lostBooksCount = 0;
        this.maxBookDebt = null;
    }

    processDebt(booksQuantity) {
        this.totalDebt = 0;
        this.overdueBooksCount = 0;
        this.lostBooksCount = 0;
        this.maxBookDebt = null;
        for (let i = 0; i < booksQuantity; i++) {
                const { bookType, daysOverdue, bookPrice, bookIsLost, bookName } = this.person.books[i];
                this.checkBookData(bookType, daysOverdue, bookPrice, bookIsLost, bookName, i);
        }
                console.log(`Вывод итогов итерации:\n общая задолженность: ${this.totalDebt.toFixed(2)}\n количество просроченных книг: ${this.overdueBooksCount }\n количество утерянных книг: ${this.lostBooksCount }\n книга с наибольшими начислениями: ${this.maxBookDebt?.name ?? ''}, задолженность: ${this.maxBookDebt?.debt.toFixed(2) ?? ''}`);
                this.askRepeat();
    }

    checkBookData(bookType, daysOverdue, bookPrice, bookIsLost, bookName, index) {

        if ((typeof bookType === 'string' && (bookType.toLowerCase() === 'common' || bookType.toLowerCase() === 'rare')) &&
            (typeof daysOverdue === 'number' && daysOverdue >= 0) &&
            (typeof bookPrice === 'number' && bookPrice > 0) &&
            typeof bookIsLost === 'boolean' &&
            (typeof bookName === 'string' && bookName.length > 2)) {
            this.processCheckingBook({bookType, daysOverdue, bookPrice, bookIsLost, bookName, index});
        } else {
            console.log(`Некорректные данные о книге: ${index + 1}`);
        }
    }

    processCheckingBook(data) {
        let bookDebt = 0;
        let overdueFee = 0;
        const finePayment = data.bookPrice / 2;
        if (data.bookIsLost) {
            bookDebt = data.bookPrice;
            this.lostBooksCount++;
            this.totalDebt += bookDebt;
            this.setMaxBookDebt({name: data.bookName, debt: bookDebt});
            console.log(`Начисления по книге ${data.index + 1}.${data.bookName} - ${bookDebt.toFixed(2)} руб`);
            return;
        }

        if (data.bookType.toLowerCase() === 'rare') {
            overdueFee = 20 * data.daysOverdue;
        } else if (data.daysOverdue > 3) {
            const paidDays = data.daysOverdue - 3;
            overdueFee = 5 * paidDays;
        } else {
            overdueFee = 0;
        }

        if (overdueFee > finePayment) {
            bookDebt = finePayment;
            this.totalDebt += bookDebt;
        } else {
            bookDebt = overdueFee;
            this.totalDebt += bookDebt;
        }

        if (data.daysOverdue > 0) {
            this.overdueBooksCount++;
        }

        this.setMaxBookDebt({name: data.bookName, debt: bookDebt});

        console.log(`Начисления по книге ${data.index + 1}.${data.bookName} - ${bookDebt.toFixed(2)} руб`)
    }

    setMaxBookDebt(data) {
        if (this.maxBookDebt === null || data.debt > this.maxBookDebt.debt) {
            this.maxBookDebt = {
                name: data.name,
                debt: data.debt,
            }
        }
    }

    start() {
        rl.question('Введите количество книг от 2 до 50: ', (answer) => {
            const booksQuantity = Number(answer);

            if (!Number.isInteger(booksQuantity) || booksQuantity < 2 || booksQuantity > 50) {
                console.log('Введите целое число от 2 до 50');
                this.start();
                return;
            }

            if (booksQuantity > this.person.books.length) {
                console.log(`Доступно книг: ${this.person.books.length}`);
                this.start();
                return;
            }

            this.processDebt(booksQuantity);
        });
    }

    askRepeat() {
        rl.question('Новый расчёт? 1 — да, 0 — нет: ', (answer) => {
            const repeat = +answer;

            if (repeat === 1) {
                this.start();
            } else if (repeat === 0) {
                rl.close();
            } else {
                console.log('Введите 1 или 0');
                this.askRepeat();
            }
        });
    }

}


const personData = {
    name: 'Ivan',
    books: [
        {
            bookType: 'common',
            daysOverdue: 0,
            bookPrice: 500,
            bookIsLost: false,
            bookName: 'Мастер и Маргарита'
        },
        {
            bookType: 'common',
            daysOverdue: 3,
            bookPrice: 400,
            bookIsLost: false,
            bookName: 'Преступление и наказание'
        },
        {
            bookType: 'common',
            daysOverdue: 5,
            bookPrice: 600,
            bookIsLost: false,
            bookName: 'Война и мир'
        },
        {
            bookType: 'common',
            daysOverdue: 30,
            bookPrice: 200,
            bookIsLost: false,
            bookName: 'Капитанская дочка'
        },
        {
            bookType: 'rare',
            daysOverdue: 0,
            bookPrice: 2000,
            bookIsLost: false,
            bookName: 'Старинный атлас'
        },
        {
            bookType: 'rare',
            daysOverdue: 4,
            bookPrice: 1000,
            bookIsLost: false,
            bookName: 'История русской живописи'
        },
        {
            bookType: 'rare',
            daysOverdue: 40,
            bookPrice: 800,
            bookIsLost: false,
            bookName: 'Сборник старинных сказаний'
        },
        {
            bookType: 'common',
            daysOverdue: 0,
            bookPrice: 700,
            bookIsLost: true,
            bookName: 'Собачье сердце'
        },
        {
            bookType: 'rare',
            daysOverdue: 10,
            bookPrice: 3000,
            bookIsLost: true,
            bookName: 'Редкое собрание стихотворений'
        },
        {
            bookType: 'common',
            daysOverdue: 4,
            bookPrice: 350,
            bookIsLost: false,
            bookName: 'Герой нашего времени'
        }
    ]
}

const person1 = new DebtCalculatorPerPerson(personData);
person1.start();