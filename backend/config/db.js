import mongooe from "mongoose";

const connectDb = async () => {
  await mongooe.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
};

export default connectDb;
