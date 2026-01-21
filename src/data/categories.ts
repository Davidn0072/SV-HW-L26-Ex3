// import type-only עבור Interfaces
import type { IncomeCategory, ExpenseCategory } from "../types/interfaces";

// רשימת קטגוריות הכנסה
export const incomeCategories: IncomeCategory[] = [
  { id: "salary", name: "Salary" },
  { id: "freelance", name: "Freelance" },
  { id: "investment", name: "Investment" },
  { id: "gift", name: "Gift" },
  { id: "other", name: "Other" },
];

// רשימת קטגוריות הוצאה
export const expenseCategories: ExpenseCategory[] = [
  { id: "food", name: "Food" },
  { id: "transport", name: "Transport" },
  { id: "housing", name: "Housing" },
  { id: "entertainment", name: "Entertainment" },
  { id: "shopping", name: "Shopping" },
  { id: "health", name: "Health" },
  { id: "education", name: "Education" },
  { id: "other", name: "Other" },
];
