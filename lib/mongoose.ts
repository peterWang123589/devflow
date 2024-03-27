import mongoose from 'mongoose'
let isConnected: boolean = false

export const connectToDatabase= async () => {
  mongoose.set('strictQuery', true)
  if(!process.env.MONGODB_URL){
    // console.log('Missing MONGODB_URL')
    return 
  }
  if(isConnected) {
    // console.log('MongoDB is already connected')
    return
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL,{
      dbName: 'devflow'
    })
    isConnected = true
    console.log('MongoDB connected')
  } catch (error) {
    console.log(error)
  }

}