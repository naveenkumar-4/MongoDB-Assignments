//No need to change code other than the last four methods
import { getClient, getDB } from "../../config/mongodb.js";

const collectionName = "students";

class studentRepository {
  async addStudent(studentData) {
    const db = getDB();
    await db.collection(collectionName).insertOne(studentData);
  }

  async getAllStudents() {
    const db = getDB();
    const students = await db.collection(collectionName).find({}).toArray();
    return students;
  }

  //You need to implement methods below:

  async createIndexes() {
    const db = getDB();
    await db.collection(collectionName).createIndex({ name: 1 });
    await db.collection(collectionName).createIndex({ age: 1, grade: -1 });
  }

  async getStudentsWithAverageScore() {
    const db = getDB();
    const students = await db
      .collection(collectionName)
      .aggregate([
        {
          $project: {
            _id: 0,
            name: 1,
            averageScore: { $avg: "$assignments.score" },
          },
        },
      ])
      .toArray();
    return students;
  }

  async getQualifiedStudentsCount() {
    const db = getDB();
    const count = await db.collection(collectionName).countDocuments({
      age: { $gt: 9 },
      grade: { $lte: "B" },
      "assignments.title": "math",
      "assignments.score": { $gte: 60 },
    });
    return count;
  }

  async updateStudentGrade(studentId, extraCreditPoints) {
    const db = getDB();
    const client = getClient();
    const session = client.startSession();
    try {
      session.startTransaction();
      await db
        .collection(collectionName)
        .updateOne(
          { _id: studentId},
          { $inc: { "assignments.$.score": extraCreditPoints } },
          { session }
        );

      // Recalculate the grade based on the updated scores
      const student = await db
        .collection(collectionName)
        .findOne({ _id: studentId }, { session });
      const averageScore =
        student.assignments.reduce((sum, assignment) => sum + assignment, 0) /
        student.assignments.length;

      let newGrade;
      if (averageScore >= 90) newGrade = "A";
      else if (averageScore >= 80) newGrade = "B";
      else if (averageScore >= 70) newGrade = "C";
      else if (averageScore >= 60) newGrade = "D";
      else newGrade = "F";

      await db
        .collection(collectionName)
        .updateOne(
          { _id: studentId },
          { $set: { grade: newGrade } },
          { session }
        );

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    } finally {
      client.close();
    }
  }
}

export default studentRepository;
