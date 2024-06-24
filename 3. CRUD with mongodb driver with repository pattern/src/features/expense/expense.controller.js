// import ExpenseRepository from "./expense.repository.js";
// import ExpenseModel from "./expense.model.js";

// export default class ExpenseController {
//   constructor() {
//     this.expenseRepository = new ExpenseRepository();
//   }

//   // Create new expense
//   add = async (req, res) => {
//     try {
//       const { title, amount, date, isRecurring, tags } = req.body;
//       const expense = new ExpenseModel(title, amount, date, isRecurring, tags);
//       const newExpense = await this.expenseRepository.addExpense(newExpense);
//       res.status(201).json(newExpense);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

//   // Get a specific expense
//   getOne = async (req, res) => {
//     try {
//       const expense = await this.expenseRepository.getOne(req.params.id);
//       if (expense) {
//         res.json(expense);
//       } else {
//         res.status(404).json({ message: "Expense not found" });
//       }
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

//   // Get all expenses
//   getAll = async (req, res) => {
//     try {
//       const expenses = await this.expenseRepository.getAllExpenses();
//       res.json(expenses);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

//   // Add a tag to an expense
//   addTag = async (req, res) => {
//     try {
//       const updatedExpenses = await this.expenseRepository.addTagToExpense(
//         req.params.id,
//         req.body.tag
//       );
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

//   // Filter expenses based on given criteria
//   filter = async (req, res) => {
//     try {
//       const criteria = req.query;
//       const expenses = await this.expenseRepository.filterExpenses(criteria);
//       res.json(expenses);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };
// }

import ExpenseRepository from "./expense.repository.js";
import ExpenseModel from "./expense.model.js";

export default class ExpenseController {
  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  add = async (req, res) => {
    try {
      const { title, amount, date, isRecurring, tags } = req.body;
      const expense = new ExpenseModel(title, amount, date, isRecurring, tags);
      const newExpense = await this.expenseRepository.addExpense(expense);
      res.status(201).json(newExpense);
    } catch (error) {
      console.error("Failed to add expense", error);
      res.status(500).json({ message: error.message });
    }
  };

  getOne = async (req, res) => {
    try {
      const expense = await this.expenseRepository.getOne(req.params.id);
      if (expense) {
        res.json(expense);
      } else {
        res.status(404).json({ message: "Expense not found" });
      }
    } catch (error) {
      console.error("Failed to get expense", error);
      res.status(500).json({ message: error.message });
    }
  };

  getAll = async (req, res) => {
    try {
      const expenses = await this.expenseRepository.getAllExpenses();
      res.json(expenses);
    } catch (error) {
      console.error("Failed to get all expenses", error);
      res.status(500).json({ message: error.message });
    }
  };

  // addTag = async (req, res) => {
  //   try {
  //     const tags = req.body.tags; // Ensure req.body.tags is an array
  //     if (!Array.isArray(tags)) {
  //       return res.status(400).json({ message: "Tags should be an array" });
  //     }
  //     const updatedExpense = await this.expenseRepository.addTagToExpense(req.params.id, tags);
  //     console.log(updatedExpense);
  //     res.json(updatedExpense);
  //   } catch (error) {
  //     console.error("Failed to add tag to expense", error);
  //     res.status(500).json({ message: error.message });
  //   }
  // };
  // addTag = async (req, res) => {
  //   try {
  //     const tags = req.body.tags; // Ensure req.body.tags is an array
  //     if (!Array.isArray(tags)) {
  //       return res.status(400).json({ message: "Tags should be an array" });
  //     }
  //     const updatedExpense = await this.expenseRepository.addTagToExpense(req.params.id, tags);
  //     res.json(updatedExpense);
  //   } catch (error) {
  //     console.error("Failed to add tag to expense", error);
  //     res.status(500).json({ message: error.message });
  //   }
  // };
  addTag = async (req, res) => {
    const { id } = req.params;
    const { tag } = req.body;

    try {
      await this.expenseRepository.addTagToExpense(id, tag);
      res.status(200).send("Tag added successfully.");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error adding tag to expense.");
    }
  };

  filter = async (req, res) => {
    try {
      const criteria = req.query;
      const expenses = await this.expenseRepository.filterExpenses(criteria);
      res.json(expenses);
    } catch (error) {
      console.error("Failed to filter expenses", error);
      res.status(500).json({ message: error.message });
    }
  };
}
