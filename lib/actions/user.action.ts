"use server"

import User from '@/database/user.model'
import { connectToDatabase } from '../mongoose'
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, UpdateUserParams } from './shared.type'
import { revalidatePath } from 'next/cache'
import Question from '@/database/question.model'

export const  getUserById= async (params:any)=>{
  
  try {
    await connectToDatabase()
    const {userId} =params
    const user=await User.findOne({clerkId:userId})
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}


export async function createUser(userData:CreateUserParams){

  try {
    await connectToDatabase()

    const newUser=await User.create(userData)
    return newUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function updateUser(params:UpdateUserParams){

  try {
    await connectToDatabase()
    const {clerkId,updateData,path}=params
    const user=await User.findOneAndUpdate({clerkId},{
      ...updateData
    },{
      new:true
    })
    revalidatePath(path)
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteUser(params:DeleteUserParams){
  try {
    await connectToDatabase()
    const {clerkId}=params
    const user=await User.findOneAndDelete({clerkId})
    if(!user){
      throw new Error('User not found')
    }
// Delete user from databse
    // and questions, answers, comments, etc

    // get user question ids
  // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.

   

    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllUsers(params:GetAllUsersParams){

  try {
    await connectToDatabase()
    const users=await User.find({}).sort({createdAt:'desc'})
    return {
      users
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}