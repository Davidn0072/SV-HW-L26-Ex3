import { useState, useRef } from "react";
import type { Transaction } from "./types/interfaces";
import { incomeCategories, expenseCategories } from "./types/interfaces";
import TransactionForm from "./components/TransactionForm";

export default function App() {
  const demoTransactions: Transaction[] = [
    // Income
    { id: "i1", type: "income", categoryId: "salary", description: "Salary Jan", amount: 3000, date: "2026-01-01" },
    { id: "i2", type: "income", categoryId: "salary", description: "Salary Feb", amount: 3200, date: "2026-02-01" },
    { id: "i3", type: "income", categoryId: "salary", description: "Salary Mar", amount: 3100, date: "2026-03-01" },
    { id: "i4", type: "income", categoryId: "freelance", description: "Project A", amount: 800, date: "2026-01-10" },
    { id: "i5", type: "income", categoryId: "freelance", description: "Project B", amount: 1200, date: "2026-02-15" },
    { id: "i6", type: "income", categoryId: "freelance", description: "Project C", amount: 950, date: "2026-03-20" },
    { id: "i7", type: "income", categoryId: "gift", description: "Birthday gift", amount: 200, date: "2026-01-15" },
    { id: "i8", type: "income", categoryId: "gift", description: "Christmas gift", amount: 150, date: "2026-12-25" },
    { id: "i9", type: "income", categoryId: "gift", description: "Bonus", amount: 500, date: "2026-06-01" },

    // Expense
    { id: "e1", type: "expense", categoryId: "food", description: "Groceries 1", amount: 300, date: "2026-01-02" },
    { id: "e2", type: "expense", categoryId: "food", description: "Groceries 2", amount: 250, date: "2026-02-05" },
    { id: "e3", type: "expense", categoryId: "food", description: "Groceries 3", amount: 350, date: "2026-03-10" },
    { id: "e4", type: "expense", categoryId: "transport", description: "Bus pass", amount: 150, date: "2026-01-05" },
    { id: "e5", type: "expense", categoryId: "transport", description: "Gas", amount: 200, date: "2026-02-10" },
    { id: "e6", type: "expense", categoryId: "transport", description: "Taxi", amount: 120, date: "2026-03-15" },
    { id: "e7", type: "expense", categoryId: "housing", description: "Rent Jan", amount: 1000, date: "2026-01-03" },
    { id: "e8", type: "expense", categoryId: "housing", description: "Rent Feb", amount: 1000, date: "2026-02-03" },
    { id: "e9", type: "expense", categoryId: "housing", description: "Rent Mar", amount: 1000, date: "2026-03-03" },
  ];

  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formPosition, setFormPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const [formMode, setFormMode] = useState<"insert" | "edit">("insert");

  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLLIElement>>({});

  // ---- Handlers ----
  function handleInsert() {
    setFormMode("insert");
    setEditingTransaction(null);
    setFormPosition({ top: 0, left: 0 });
    setIsFormOpen(true);
  }

  function handleEdit(transaction: Transaction) {
    setFormMode("edit");
    setEditingTransaction(transaction);

    const row = rowRefs.current[transaction.id];
    if (row && containerRef.current) {
      const top = row.offsetTop - containerRef.current.scrollTop;
      const left = row.offsetWidth + 10;
      setFormPosition({ top, left });
    }

    setIsFormOpen(true);
  }

  function handleDelete(id: string) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  function handleSave(transaction: Transaction) {
    setTransactions(prev => {
      const exists = prev.find(t => t.id === transaction.id);
      let updated: Transaction[];
      if (exists) {
        updated = prev.map(t => t.id === transaction.id ? transaction : t);
      } else {
        updated = [...prev, transaction];
      }

      // ---- Sort transactions ----
      updated.sort((a, b) => {
        const catCompare = a.categoryId.localeCompare(b.categoryId);
        if (catCompare !== 0) return catCompare;
        const typeCompare = a.type.localeCompare(b.type);
        if (typeCompare !== 0) return typeCompare;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      return updated;
    });

    setIsFormOpen(false);
  }

  // ---- Budget Summary ----
  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  function getCategoryNameById(id: string) {
    const allCategories = [...incomeCategories, ...expenseCategories];
    const category = allCategories.find(c => c.id === id);
    return category?.name ?? id;
  }

  // ---- Totals per Category ----
  const totalsByCategory = transactions.reduce<Record<string, { total: number; type: "income" | "expense"; name: string }>>((acc, t) => {
    if (!acc[t.categoryId]) acc[t.categoryId] = { total: 0, type: t.type, name: getCategoryNameById(t.categoryId) };
    acc[t.categoryId].total += t.type === "income" ? t.amount : -t.amount;
    return acc;
  }, {});

  const categoryTotals = Object.values(totalsByCategory)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "income" ? -1 : 1; // income first
      return a.name.localeCompare(b.name); // alphabetical
    });

  return (
    <div className="p-6 max-w-xl mx-auto font-sans relative" ref={containerRef}>
      <h1 className="text-2xl font-bold mb-4">Budget Manager</h1>

      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={handleInsert}
      >
        ➕ Add Transaction
      </button>

      <ul className="mb-6 relative">
        {transactions.map(t => (
          <li
            key={t.id}
            ref={el => { if (el) rowRefs.current[t.id] = el; }}
            className={`p-2 mb-2 rounded border flex justify-between items-center ${t.type === "income"
              ? "bg-green-100 border-green-300 text-green-800"
              : "bg-red-100 border-red-300 text-red-800"
              }`}
          >
            <span className="flex">
              <span className="font-bold mr-2">{getCategoryNameById(t.categoryId)}</span>
              <span>{t.description} — {t.amount}$ ({t.type})</span>
            </span>

            <div>
              <button
                className="mr-2 px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300 transition"
                onClick={() => handleEdit(t)}
              >
                ✏️ Edit
              </button>
              <button
                className="px-2 py-1 bg-red-300 rounded hover:bg-red-400 transition"
                onClick={() => handleDelete(t.id)}
              >
                🗑 Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="p-4 rounded border bg-gray-100 mb-6">
        <p>Total Income: ${totalIncome}</p>
        <p>Total Expenses: ${totalExpenses}</p>
        <p className={`${balance >= 0 ? "text-green-700" : "text-red-700"} font-bold`}>Balance: ${balance}</p>
      </div>

      <div className="p-4 rounded border bg-gray-50 mb-6">
        <h2 className="font-bold mb-2">Totals per Category</h2>
        <ul>
          {categoryTotals.map(ct => (
            <li
              key={ct.name}
              className={`p-2 mb-2 rounded flex justify-between ${ct.total >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
            >
              <span className="font-bold">{ct.name}</span>
              <span>{ct.total}$</span>
            </li>
          ))}
        </ul>
      </div>

      {isFormOpen && (
        <div
          className="absolute bg-white p-4 border rounded shadow-lg z-10"
          style={{ top: formPosition.top, left: formPosition.left }}
        >
          <TransactionForm
            transaction={editingTransaction}
            onSave={handleSave}
            onClose={() => setIsFormOpen(false)}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
          />
        </div>
      )}
    </div>
  );
}
