let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const currencySelect = document.getElementById('currency-select');
const convertedAmountInput = document.getElementById('converted-amount');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

const API_KEY = '2618af25ce85b742af1a1229';
const BASE_CURRENCY = 'USD'; // Change this to your base currency

async function fetchConversionRate(targetCurrency) {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`);
    const data = await response.json();
    return data.rates[targetCurrency];
}

async function updateConvertedAmount() {
    const amount = Number(amountInput.value);
    const targetCurrency = currencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        convertedAmountInput.value = '';
        return;
    }

    const conversionRate = await fetchConversionRate(targetCurrency);
    const convertedAmount = (amount * conversionRate).toFixed(2);
    convertedAmountInput.value = convertedAmount;
}

amountInput.addEventListener('input', updateConvertedAmount);
currencySelect.addEventListener('change', updateConvertedAmount);

addBtn.addEventListener('click', function() {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const convertedAmount = Number(convertedAmountInput.value);

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    expenses.push({ category, amount, date, convertedAmount });

    totalAmount += convertedAmount;
    totalAmountCell.textContent = totalAmount.toFixed(2);

    const newRow = expensesTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        expenses.splice(expenses.indexOf(expense), 1);
        totalAmount -= expense.convertedAmount;
        totalAmountCell.textContent = totalAmount.toFixed(2);
        expensesTableBody.removeChild(newRow);
    });

    const expense = expenses[expenses.length - 1];
    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.convertedAmount.toFixed(2);
    dateCell.textContent = expense.date;
    deleteCell.appendChild(deleteBtn);
});