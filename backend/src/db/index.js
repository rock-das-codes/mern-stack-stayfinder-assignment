import mongoose from "mongoose"

const connectoDB = async ()=>{
    try {
        if(!process.env.MONGODB_URI){
            throw new Error("MONGO DB URL NOE DEFINED IN .ENV FILE")
        }
         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`,{
            maxPoolSIze:10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
         })

         mongoose.connection.on('connected',()=>{
            console.log('Mongoose connected to MongoDB');

         })
         mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});
    } catch (error) {
          console.log("MONGODB ERROR CONNECTION - FAILED: ", error);
        process.exit(1);
    }
   
}

export default connectoDB;