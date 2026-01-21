import { useState, useEffect } from "react";
import type { Transaction, IncomeCategory, ExpenseCategory } from "../types/interfaces";

type Props = {
  transaction: Transaction | null;
  onSave: (t: Transaction) => void;
  onClose: () => void;
  incomeCategories: IncomeCategory[];
  expenseCategories: ExpenseCategory[];
};

export default function TransactionForm({ transaction, onSave, onClose, incomeCategories, expenseCategories }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");

  // אתחול שדות INSERT / EDIT
  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount);
      setType(transaction.type);
      setCategoryId(transaction.categoryId);
      setDate(transaction.date);
    } else {
      setDescription("");
      setAmount("");
      setType("income");
      setCategoryId("");
      setDate("");
    }
  }, [transaction]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description || !amount || !type || !categoryId || !date) {
      alert("All fields are required!");
      return;
    }

    const t: Transaction = {
      id: transaction?.id ?? crypto.randomUUID(),
      description,
      amount: Number(amount),
      type,
      categoryId,
      date,
    };

    onSave(t);
  }

  const categories = type === "income" ? incomeCategories : expenseCategories;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-3 p-4 border-2 border-gray-300 rounded shadow-md min-w-[280px] bg-white"
    >
      {/* Type */}
      <div>
        <label className="block font-bold mb-1">Type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value as "income" | "expense")}
          className="w-full border rounded p-1 font-normal"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block font-bold mb-1">Category</label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="w-full border rounded p-1 font-normal"
          required
        >
          <option value="">--Select Category--</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block font-bold mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border rounded p-1 font-normal"
          required
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block font-bold mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="w-full border rounded p-1 font-normal"
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="block font-bold mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border rounded p-1 font-normal"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-3">
        <button
          type="submit"
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
