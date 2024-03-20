"use server"
import { connectToDatabase } from '../mongoose'
import Question from '@/database/question.model'
import Tag from '@/database/tag.model'
import { revalidatePath } from 'next/cache'
import { GetQuestionsParams,CreateQuestionParams, GetQuestionByIdParams, QuestionVoteParams } from './shared.type'
import User from '@/database/user.model'

export async function getQuestions (params:GetQuestionsParams) {
  try {
    await connectToDatabase()
    const questions = await Question.find({
      
    }).populate({
      path:'tags',
      model:Tag
    }).populate({
      path:'author',
      model:User
    }).sort({createdAt:'desc'})

    return { questions }
  }catch(e){
    console.log(e)
  throw e
  }
}

export async function createQuestion(params:CreateQuestionParams) {
  try {
    await connectToDatabase()
    const {title,content,tags,author,path}=params
    const qusetion=await Question.create(
      {
        title,
        content,
        author
      }
    )
    const tagDocuments=[]
    // create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag=await Tag.findOneAndUpdate(
        {
          name:{$regex:new RegExp(`^${ tag }$`, 'i')}
        },
        {$setOnInsert:{
          name:tag,
          
        },$push:{
          questions:qusetion._id
        },

        },
        {
          upsert:true,
          new:true
        }
      )
      tagDocuments.push(existingTag)
    }

await Question.findByIdAndUpdate(qusetion._id,{
  $push:{
    tags:{$each:tagDocuments}
  }
})
revalidatePath(path)
  } catch (error) {
    
  }
  
}



export async function getQuestionById(params:GetQuestionByIdParams) {
  try {
    await connectToDatabase()
    const {questionId}=params
    const question=await Question.findById(questionId)
    .populate({path:'tags',model:Tag,select:"_id name"})
    .populate({path:'author',model:User,select:"_id clerkId name picture"})
    return question
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function upvoteQuestion(params:QuestionVoteParams){
  try {
    await connectToDatabase()
    const {questionId,userId,hasupVoted,hasdownVoted,path}=params
    let updateQuery={}
    if(hasupVoted){
      updateQuery={
        $pull:{
          upvotes:userId
        }
      }
    }else if(hasdownVoted){
      updateQuery={
        $pull:{
          downvotes:userId
        },
        $push:{
          upvotes:userId
        }
      }
    }else{
      updateQuery={$addToSet:{
        upvotes:userId
      }}
    }
    const question=await Question.findByIdAndUpdate(questionId,updateQuery,{
      new:true
    })
    if(!question){
      throw new Error('Question not found')
    }
    // Increment author's reputation bt +10 for upvoting a question
    revalidatePath(path)
  } catch (error) {
   console.log(error)
   throw error 
  }
}

export async function downvoteQuestion(params:QuestionVoteParams){
try {
  await connectToDatabase()
  const {questionId,userId,hasupVoted,hasdownVoted,path}=params
  let updateQuery={}
  if(hasdownVoted){
    updateQuery={
      $pull:{
        downvotes:userId
      }
    }
  }else if(hasupVoted){
    updateQuery={
      $pull:{
        upvotes:userId
      },
      $push:{
        downvotes:userId
      }
    }
  }else{
    updateQuery={$addToSet:{
      downvotes:userId
    }}
  }
  const question=await Question.findByIdAndUpdate(questionId,updateQuery,{
    new:true
  })
  if(!question){
    throw new Error('Question not found')
  }
  revalidatePath(path)
} catch (error) {
  
}


}