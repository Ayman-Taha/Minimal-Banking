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

// Elements
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
/////////////////////////////////////////////////
// creating usernames
accounts.forEach(function (acc) {
  acc.username = acc.owner.split(' ').reduce(function (username, word) {
    return username + word[0].toLowerCase();
  }, '');
});

// login function
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  let username = inputLoginUsername.value;
  let password = inputLoginPin.value;
  let acc = accounts.find(function (acc) {
    return acc.username === username;
  });
  if (password === acc?.pin) {
    updateUI(acc);
    containerApp.style.opacity = 1;
  }
});

//update UI
function updateUI(acc) {
  //welcome message
  labelWelcome.textContent = `Welcome back, ${acc.owner.split(' ')[0]}`;

  //movements
  containerMovements.innerHTML = '';
  acc.movements.forEach(function (mov, i) {
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

  //balance
  labelBalance.textContent =
    acc.movements.reduce(function (balance, mov) {
      return balance + mov;
    }, 0) + '€';

  //summary
  //In
  labelSumIn.textContent =
    acc.movements
      .filter(function (mov) {
        return mov > 0;
      })
      .reduce(function (sum, deposit) {
        return sum + deposit;
      }, 0) + '€';

  //Out
  labelSumOut.textContent =
    acc.movements
      .filter(function (mov) {
        return mov < 0;
      })
      .reduce(function (sum, withdrawal) {
        return sum + Math.abs(withdrawal);
      }, 0) + '€';

  //Interest (it is only added if it is more than or equal to 1)
  labelSumInterest.textContent =
    acc.movements
      .filter(function (mov) {
        return mov > 0;
      })
      .reduce(function (sum, deposit) {
        let interestAdded =
          (deposit * acc.interestRate) / 100 >= 1
            ? (deposit * acc.interestRate) / 100
            : 0;
        return sum + interestAdded;
      }, 0) + '€';
}

/////////////////////////////////////////////////
