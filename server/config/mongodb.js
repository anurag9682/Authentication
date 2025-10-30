import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log("Database Conntected Successfully")
  );

  await mongoose.connect(`${process.env.MONGODB_URI}/authentication`);
};

export default connectDB;
