import mongoose from "mongoose";

async function connectToDatabase() {
  try {
    const uri = process.env.MONGO_URL;
    if (uri) {
      await mongoose.connect(uri);
    }
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectToDatabase;
