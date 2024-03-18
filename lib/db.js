const mongoose = require("mongoose");

const url = process.env.DATABASE_URL;
let connection = null;

const startDb = async () => {
  if (!connection) {
    try {
      connection = await mongoose.connect(url);
      console.log("Database connected");
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  }
  return connection;
};

module.exports = startDb;
