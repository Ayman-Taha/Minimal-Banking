'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: '1111',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: '2222',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: '3333',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: '4444',
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

let currentAccount;
let sorted = false;
// creating usernames
accounts.forEach(function (acc) {
  acc.username = acc.owner
    .split(' ')
    .reduce((username, word) => username + word[0].toLowerCase(), '');
});

//Functions

function displayWelcome(acc) {
  labelWelcome.textContent = `Welcome back, ${acc.owner.split(' ')[0]}`;
}

function displayMovements(acc) {
  containerMovements.innerHTML = '';

  let sortedAccMovements = acc.movements.slice().sort(function (a, b) {
    return a - b;
  });

  let movements = sorted ? sortedAccMovements : acc.movements;

  movements.forEach(function (mov, i) {
    let type = mov > 0 ? 'deposit' : 'withdrawal';
    let str = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', str);
  });
}

function displayBalance(acc) {
  labelBalance.textContent =
    acc.movements.reduce((balance, mov) => balance + mov, 0) + '€';
}

function displaySummary(acc) {
  //In
  let sumIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, deposit) => sum + deposit, 0);

  labelSumIn.textContent = sumIn + '€';

  //Out
  let sumOut = acc.movements
    .filter(mov => mov < 0)
    .reduce((sum, withdrawal) => sum + Math.abs(withdrawal), 0);

  labelSumOut.textContent = sumOut + '€';

  //Interest (it is only added if it is more than or equal to 1)
  let sumInterest = acc.movements
    .filter(mov => mov > 0)
    .reduce(function (sum, deposit) {
      let interestAdded =
        (deposit * acc.interestRate) / 100 >= 1
          ? (deposit * acc.interestRate) / 100
          : 0;
      return sum + interestAdded;
    }, 0);
  labelSumInterest.textContent = sumInterest + '€';
}

//update UI
function updateUI(acc) {
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
    updateUI(acc);
    containerApp.style.opacity = 1;
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
    currentAccount.movements.reduce((balance, mov) => balance + mov, 0) >
      transferredAmt
  ) {
    receivingAcc.movements.push(transferredAmt);
    currentAccount.movements.push(-transferredAmt);
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
    currentAccount.movements.some(mov => mov >= 0.1 * loanAmt)
  ) {
    currentAccount.movements.push(loanAmt);
    updateUI(currentAccount);
  }
});

//sorting (sort <> unsort)
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  updateUI(currentAccount);
});

/////////////////////////////////////////////////
