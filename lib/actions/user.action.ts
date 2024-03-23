"use server"

import User from '@/database/user.model'
import { connectToDatabase } from '../mongoose'
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from './shared.type'
import { revalidatePath } from 'next/cache'
import Question from '@/database/question.model'
import { FilterQuery } from 'mongoose'
import Tag from '@/database/tag.model'
import Answer from '@/database/answer.model'


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
    const {searchQuery,filter,page=1,pageSize=10}=params
    const query:FilterQuery<typeof User>={}
    const skipAmount = (page - 1) * pageSize
    if (searchQuery) {
      query.$or=[
        {name:{$regex:new RegExp(searchQuery,"i")}},
        {username:{$regex:new RegExp(searchQuery,"i")}}
      ]
      
    }
    console.log(filter)
    let sortOptions={}
    switch (filter) {
      case "new_users":
        sortOptions={joinedAt:'desc'};
        break;
      case "old_users":
        sortOptions={joinedAt:'asc'};
        break;
      case "top_contributors":
        sortOptions={reputation:-1}
        break;
      default:
        break;
    }

    const users=await User.find(query).sort(sortOptions)
                    .skip(skipAmount).limit(pageSize)
    const totalUsers=await User.countDocuments(query)
    const isNext=skipAmount+pageSize<totalUsers
    return {
      users,
      isNext
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
    const {clerkId,page=1,pageSize=1,filter,searchQuery}=params
    const skipAmount = (page - 1) * pageSize
    const query:FilterQuery<typeof Question>=searchQuery?{
      title:{$regex:new RegExp(searchQuery,'i')}
    }:{}
    let sortOptions={}
    switch (filter) {
      case "most_recent":
        sortOptions={createdAt:'desc'}
        
        break;
        case "oldest":
          sortOptions={createdAt:'asc'}
          break;
        case "most_voted":
            sortOptions={upvotes:'desc'}
            break;
        case "most_viewed":
           sortOptions={views:'desc'}
           break;
        case "most_answered":
          sortOptions={answers:'desc'}
          break;
      default:
        break;
    }
    // @ts-ignore
    const user=await User.findOne({clerkId}).populate({
      path:'saved',
      match:query,
      options:{
        limit:pageSize+1,
        skip:skipAmount,
        sort:sortOptions,
  
      },
      populate:[
        {path:"tags",model:Tag,select:"_id name"},
        {path:"author",model:User,select:"_id clerkId name picture"}
      ]
  
    })
    if (!user) {
      throw new Error('User not found');
    }
    const isNext=pageSize<user.saved.length
  return {
    questions:user.saved,
    isNext
  }
  } catch (error) {
    console.log(error)
    throw error
    
  }
}

export async function getUserInfo(params:GetUserByIdParams) {
  try {
    await connectToDatabase()
    const {userId}=params
    const user=await User.findOne({clerkId:userId})
    if (!user) {
      throw new Error('User not found');
    }
  const totalQuestions=await Question.countDocuments({author:user._id})
  const totalAnswers=await Answer.countDocuments({author:user._id})
  return {
    user,
    totalAnswers,
    totalQuestions
  }

  } catch (error) {
    console.log(error)
    throw error
  }
  
}

export async function getUserQuestions(params:GetUserStatsParams) {
  try {
    await connectToDatabase()
    const {userId,page=1,pageSize=10}=params
    const skipAmount = (page - 1) * pageSize
    const totalQuestions=await Question.countDocuments({author:userId})
    const userQuestions=await Question.find({author:userId}).populate(
      "tags","_id name",
    ).populate("author","_id clerkId name picture").sort({views:-1,upvotes:-1})
    .skip(skipAmount).limit(pageSize)
const isNext=skipAmount+pageSize<totalQuestions
  return {
    questions:userQuestions,
  totalQuestions,
  isNext
  }
  } catch (error) {
    console.log(error)
    throw error
  }
  
}

export async function getUserAnswers(params:GetUserStatsParams){
try {
  const {userId,page=1,pageSize=1}=params
  const skipAmount = (page - 1) * pageSize
  const totalAnswers=await Answer.countDocuments({author:userId})
  const userAnswers=await Answer.find({author:userId}).populate(
    "question","_id title"
  ).populate("author","_id clerkId name picture").sort({upvotes:-1}).
  skip(skipAmount).limit(pageSize)
const isNext=skipAmount+pageSize<totalAnswers
return {
  answers:userAnswers,
  totalAnswers,
  isNext
}
} catch (error) {
  console.log(error)
throw error
}


}