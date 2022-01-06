'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  pin: '1111',
  movements: [
    { value: 200, date: '2019-11-18T21:31:17.178Z' },
    { value: 450, date: '2019-12-23T07:42:02.383Z' },
    { value: -400, date: '2020-01-28T09:15:04.904Z' },
    { value: 3000.35, date: '2020-04-01T10:17:24.185Z' },
    { value: -650.8, date: '2021-05-08T14:11:59.604Z' },
    {
      value: -130,
      date: new Date(new Date() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      value: 70.73,
      date: new Date(new Date() - 24 * 60 * 60 * 1000).toISOString(),
    },
    { value: 1300, date: new Date().toISOString() },
  ],
  interestRate: 1.2, // %
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  pin: '2222',
  movements: [
    { value: 5000, date: '2019-11-01T13:15:33.035Z' },
    { value: 3400, date: '2019-11-30T09:48:16.867Z' },
    { value: -150, date: '2019-12-25T06:04:23.907Z' },
    { value: -790.12, date: '2020-01-25T14:18:46.235Z' },
    { value: -3210.98, date: '2020-02-05T16:33:06.386Z' },
    {
      value: -1000,
      date: new Date(new Date() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      value: 8500,
      date: new Date(new Date() - 24 * 60 * 60 * 1000).toISOString(),
    },
    { value: -30.32, date: new Date().toISOString() },
  ],
  interestRate: 1.5,
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  pin: '3333',
  movements: [
    { value: 200, date: '2019-11-01T13:15:33.035Z' },
    { value: -200.35, date: '2019-11-30T09:48:16.867Z' },
    {
      value: 340,
      date: new Date(new Date() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      value: -300.12,
      date: new Date(new Date() - 24 * 60 * 60 * 1000).toISOString(),
    },
    { value: -20, date: new Date().toISOString() },
  ],
  interestRate: 0.7,
  currency: 'GBP',
};

const account4 = {
  owner: 'Sarah Smith',
  pin: '4444',
  movements: [
    { value: 430, date: '2019-11-01T13:15:33.035Z' },
    { value: 1000.34, date: '2020-11-30T09:48:16.867Z' },
    {
      value: 700,
      date: new Date(new Date() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      value: 50.1,
      date: new Date(new Date() - 24 * 60 * 60 * 1000).toISOString(),
    },
    { value: 90, date: new Date().toISOString() },
  ],
  interestRate: 1,
};

const accounts = [account1, account2, account3, account4];

// Elements Selection
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
//////////// Coding Work Starts Here ////////////
/////////////////////////////////////////////////

//Globals

let currentAccount, timer;
let sorted = false;
let curDate = new Date();

const curDateOptions = {
  hour: '2-digit',
  minute: '2-digit',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  weekday: 'long',
};

const movDateOptions = {
  hour: '2-digit',
  minute: '2-digit',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
};

//Functions

// creating usernames
accounts.forEach(function (acc) {
  acc.username = acc.owner
    .split(' ')
    .reduce((username, word) => username + word[0].toLowerCase(), '');
});

function dateFormatting(date, acc, options) {
  let loc = acc.locale || Navigator.language;
  return new Intl.DateTimeFormat(loc, options).format(date);
}

function currencyFormatting(num, acc) {
  let loc = acc.locale || Navigator.language;
  const currencyOptions = {
    style: 'currency',
    currency: acc.currency || 'USD',
  };
  return new Intl.NumberFormat(loc, currencyOptions).format(num);
}

function displayWelcome(acc) {
  labelWelcome.textContent = `Welcome back, ${acc.owner.split(' ')[0]}`;
}

function displayCurrentDate(acc) {
  let currentDate = dateFormatting(curDate, acc, curDateOptions);
  labelDate.textContent = currentDate;
}

function displayMovements(acc) {
  containerMovements.innerHTML = '';

  let sortedAccMovements = acc.movements.slice().sort(function (a, b) {
    return a.value - b.value;
  });

  let movements = sorted ? sortedAccMovements : acc.movements;

  movements.forEach(function (mov, i) {
    let type = mov.value > 0 ? 'deposit' : 'withdrawal';

    let movDate;

    let timePassed = Math.floor(
      (new Date() - new Date(mov.date)) / (1000 * 60 * 60 * 24)
    );

    if (timePassed === 0) {
      movDate = 'Today';
    } else if (timePassed === 1) {
      movDate = 'Yesterday';
    } else if (timePassed < 7) {
      movDate = `${timePassed} days ago`;
    } else if (timePassed === 7) {
      movDate = 'A week ago';
    } else {
      movDate = dateFormatting(new Date(mov.date), acc, movDateOptions);
    }

    const formattedMov = currencyFormatting(mov.value, acc);

    let str = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${movDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', str);
  });
}

function displayBalance(acc) {
  let accBalance = acc.movements.reduce(
    (balance, mov) => balance + mov.value,
    0
  );
  labelBalance.textContent = currencyFormatting(accBalance, acc);
}

function displaySummary(acc) {
  //In
  let sumIn = acc.movements
    .filter(mov => mov.value > 0)
    .reduce((sum, deposit) => sum + deposit.value, 0);

  labelSumIn.textContent = currencyFormatting(sumIn, acc);

  //Out
  let sumOut = acc.movements
    .filter(mov => mov.value < 0)
    .reduce((sum, withdrawal) => sum + Math.abs(withdrawal.value), 0);

  labelSumOut.textContent = currencyFormatting(sumOut, acc);

  //Interest (it is only added if it is more than or equal to 1)
  let sumInterest = acc.movements
    .filter(mov => mov.value > 0)
    .reduce(function (sum, deposit) {
      let interestAdded =
        (deposit.value * acc.interestRate) / 100 >= 1
          ? (deposit.value * acc.interestRate) / 100
          : 0;
      return sum + interestAdded;
    }, 0);
  labelSumInterest.textContent = currencyFormatting(sumInterest, acc);
}

//update UI
function updateUI(acc) {
  if (timer) {
    clearInterval(timer);
  }
  timer = startLogOutTimer();
  displayCurrentDate(acc);
  displayWelcome(acc);
  displayMovements(acc);
  displayBalance(acc);
  displaySummary(acc);
}

//Event handlers

// login function
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  let username = inputLoginUsername.value;
  let password = inputLoginPin.value;
  let acc = accounts.find(acc => acc.username === username);
  if (password === acc?.pin) {
    currentAccount = acc;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    updateUI(acc);
    containerApp.style.opacity = 1;
  } else {
    inputLoginPin.value = '';
  }
});

//transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let transferredAmt = Number(inputTransferAmount.value);
  let receivingAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  if (
    receivingAcc &&
    transferredAmt > 0 &&
    currentAccount.movements.reduce((balance, mov) => balance + mov.value, 0) >
      transferredAmt
  ) {
    receivingAcc.movements.push({
      value: transferredAmt,
      date: new Date().toISOString(),
    });
    currentAccount.movements.push({
      value: -transferredAmt,
      date: new Date().toISOString(),
    });

    updateUI(currentAccount);
  }
});

//loans (a loan only goes through if there was at least one deposit that is more than 10% of the loan amount)
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let loanAmt = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  if (
    loanAmt > 0 &&
    currentAccount.movements.some(mov => mov.value >= 0.1 * loanAmt)
  ) {
    currentAccount.movements.push({
      value: Math.round(loanAmt),
      date: new Date().toISOString(),
    });

    updateUI(currentAccount);
  }
});

//sorting (sort <> unsort)
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  updateUI(currentAccount);
});

//closing accounts
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let username = inputCloseUsername.value;
  let password = inputClosePin.value;
  if (
    username === currentAccount.username &&
    password === currentAccount?.pin
  ) {
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
    accounts.splice(
      accounts.findIndex(acc => acc.username === currentAccount.username),
      1
    );
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

// logout inactivity timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 60 * 5;

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
/////////////////////////////////////////////////
