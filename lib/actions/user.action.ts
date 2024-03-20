"use server"

import User from '@/database/user.model'
import { connectToDatabase } from '../mongoose'
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, ToggleSaveQuestionParams, UpdateUserParams } from './shared.type'
import { revalidatePath } from 'next/cache'
import Question from '@/database/question.model'
import { FilterQuery } from 'mongoose'
import Tag from '@/database/tag.model'


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


export async function toggleSaveQuestion(params:ToggleSaveQuestionParams){
  try {
    await connectToDatabase(
    )
    const {userId,questionId,path}=params
    const user=await User.findById(userId)
    if (!user) {
      throw new Error('User not found');
    }
    const isQuestionSaved=user.saved.includes(questionId)

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        {$pull:{saved:questionId}},
        {new:true}
      )
      
    }else{
      await User.findByIdAndUpdate(
        userId,
        {$addToSet:{saved:questionId}},
        {new:true}
      )
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
  
}

export async function getSavedQuestions(params:GetSavedQuestionsParams) {
  try {
    await connectToDatabase()
    const {clerkId,page=1,pageSize=10,filter,searchQuery}=params
    const query:FilterQuery<typeof Question>=searchQuery?{
      title:{$regex:new RegExp(searchQuery,'i')}
    }:{}
    // @ts-ignore
    const user=await User.findOne({clerkId}).populate({
      path:'saved',
      match:query,
      options:{
        limit:pageSize,
        skip:pageSize*(page-1),
        sort:{createdAt:'desc'},
        
      },
      populate:[
        {path:"tags",model:Tag,select:"_id name"},
        {path:"author",model:User,select:"_id clerkId name picture"}
      ]
  
    })
    if (!user) {
      throw new Error('User not found');
    }
  return {
    questions:user.saved
  }
  } catch (error) {
    console.log(error)
    throw error
    
  }
}