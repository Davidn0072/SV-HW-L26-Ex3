export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  date: string;
}

export interface IncomeCategory {
  id: string;
  name: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
}

export const incomeCategories: IncomeCategory[] = [
  { id: "salary", name: "Salary" },
  { id: "freelance", name: "Freelance" },
  { id: "gift", name: "Gift" },
];

export const expenseCategories: ExpenseCategory[] = [
  { id: "food", name: "Food" },
  { id: "transport", name: "Transport" },
  { id: "housing", name: "Housing" },
];
