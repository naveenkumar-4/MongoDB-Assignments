// import { getDB } from "../../config/mongodb.js";
// import { ObjectId } from "mongodb";
// class ExpenseRepository {
//   constructor() {
//     this.collectionName = "expenses"; // name of the collection in mongodb
//   }

//   // Create a new expense
//   async addExpense(expense) {
//     const db = getDB();
//     const collection = db.collection(this.collectionName);
//     await collection.insertOne(expense);
//     return expense;
//   }

//   // Get one expnese by its ID
//   async getOne(id) {
//     const db = getDB();
//     const collection = db.collection(this.collectionName);
//     return collection.findOne({ _id: new ObjectId(id) });
//   }

//   // Get all expenses
//   async getAllExpenses() {
//     const db = getDB();
//     const collection = db.collection(this.collectionName);
//     return collection.find().toArray();
//   }

//   // Add tag to an expense
//   async addTagToExpense(id, tag) {
//     const db = getDB();
//     const collection = db.collection(this.collectionName);
//     await collection.updateOne(
//       { _id: new ObjectId(id) },
//       { $push: { tags: tag } }
//     );
//     return this.getOne(id);
//   }

//   // Filter expenses based on date, amount, and isRecurring field
//   async filterExpenses(criteria) {
//     const db = getDB();
//     const collection = db.collection(this.collectionName);
//     const query = {};

//     if(criteria.minAmount !== undefined){
//       query.amount = {...query.amount, $gte:parseFloat(criteria.minAmount)};
//     }
//     if(criteria.maxAmount !== undefined){
//       query.amount == {...query.amount, $lte:parseFloat(criteria.maxAmount)};
//     }
//     if(criteria.isRecurring !== undefined){
//       query.isRecurring = criteria.isRecurring === "true";
//     }
//     return collection.find(query).toArray();
//   }
// }

// export default ExpenseRepository;

import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

class ExpenseRepository {
  constructor() {
    this.collectionName = "expenses"; // name of the collection in mongodb
  }

  async addExpense(expense) {
    try {
      const db = getDB();
      const collection = db.collection(this.collectionName);
      await collection.insertOne(expense);
      return expense;
    } catch (error) {
      console.error("Failed to add expense", error);
      throw error;
    }
  }

  async getOne(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collectionName);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Failed to get expense", error);
      throw error;
    }
  }

  async getAllExpenses() {
    try {
      const db = getDB();
      const collection = db.collection(this.collectionName);
      return await collection.find().toArray();
    } catch (error) {
      console.error("Failed to get all expenses", error);
      throw error;
    }
  }

  
  // async addTagToExpense(id, tags) {
  //   const db = getDB();
  //   const collection = db.collection(this.collectionName);
  //   await collection.updateOne(
  //     { _id: new ObjectId(id) },
  //     { $push: { tags: { $each: tags } } } // Ensure $each is used correctly
  //   );
  //   return this.getOne(id);
  // }

  async addTagToExpense(id, tag) {
    const db = getDB();
    const result = await db
      .collection(this.collectionName)
      .updateOne({ _id: new ObjectId(id) }, { $push: { tags: tag } });
    return result;
  }

  async filterExpenses(criteria) {
    try {
      const db = getDB();
      const collection = db.collection(this.collectionName);
      const query = {};

      if (criteria.minAmount !== undefined) {
        query.amount = {
          ...query.amount,
          $gte: parseFloat(criteria.minAmount),
        };
      }

      if (criteria.maxAmount !== undefined) {
        query.amount = {
          ...query.amount,
          $lte: parseFloat(criteria.maxAmount),
        };
      }

      if (criteria.isRecurring !== undefined) {
        query.isRecurring = criteria.isRecurring === "true";
      }

      return await collection.find(query).toArray();
    } catch (error) {
      console.error("Failed to filter expenses", error);
      throw error;
    }
  }
}

export default ExpenseRepository;
