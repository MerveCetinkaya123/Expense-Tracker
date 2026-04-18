const transactionForm = document.getElementById("transactionForm");
const typeInput = document.getElementById("type");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const transactionListEl = document.getElementById("transactionList");
const clearAllBtn = document.getElementById("clearAllBtn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function formatCurrency(value) {
  return `₺${value.toFixed(2)}`;
}

function updateSummary() {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const expense = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expense;

  balanceEl.textContent = formatCurrency(balance);
  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);
}

function renderTransactions() {
  transactionListEl.innerHTML = "";

  if (transactions.length === 0) {
    transactionListEl.innerHTML = `<p class="text-slate-500 text-sm">Henüz işlem eklenmedi.</p>`;
    return;
  }

  transactions.forEach((item) => {
    const card = document.createElement("div");
    card.className = `flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-xl border ${
      item.type === "income"
        ? "border-green-200 bg-green-50"
        : "border-red-200 bg-red-50"
    }`;

    card.innerHTML = `
      <div>
        <h3 class="font-semibold text-slate-800">${item.description}</h3>
        <p class="text-sm text-slate-500">Kategori: ${item.category}</p>
      </div>

      <div class="flex items-center gap-3">
        <span class="font-bold ${
          item.type === "income" ? "text-green-600" : "text-red-600"
        }">
          ${item.type === "income" ? "+" : "-"} ${formatCurrency(item.amount)}
        </span>

        <button
          onclick="deleteTransaction(${item.id})"
          class="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-700 transition"
        >
          Sil
        </button>
      </div>
    `;

    transactionListEl.appendChild(card);
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter((item) => item.id !== id);
  saveTransactions();
  renderTransactions();
  updateSummary();
}

transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const type = typeInput.value;
  const description = descriptionInput.value.trim();
  const category = categoryInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!description || !category || isNaN(amount) || amount <= 0) {
    alert("Lütfen tüm alanları doğru şekilde doldur.");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    type,
    description,
    category,
    amount,
  };

  transactions.push(newTransaction);

  saveTransactions();
  renderTransactions();
  updateSummary();

  transactionForm.reset();
});

clearAllBtn.addEventListener("click", function () {
  const confirmDelete = confirm("Tüm işlemleri silmek istediğine emin misin?");
  if (!confirmDelete) return;

  transactions = [];
  saveTransactions();
  renderTransactions();
  updateSummary();
});

renderTransactions();
updateSummary();