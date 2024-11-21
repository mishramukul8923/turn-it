import { MongoClient } from 'mongodb';

let client;

const createConnection = async () => {
  if (!client) {
    try {
      console.log("Attempting to connect to MongoDB...");

      // Use the correct MongoDB URI format with the cluster address
      const uri = `mongodb+srv://agarwalayush170801:${process.env.MONGODB_PASSWORD}@cluster0.uo3db.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
      
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 130000, // Set connection timeout
      });

      await client.connect();
      console.log("MongoDB connection established");
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      throw error;
    }
  }
  return client.db(process.env.DB_NAME);
};



export const closeConnection = async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};

export default createConnection;
