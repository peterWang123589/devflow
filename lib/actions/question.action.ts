"use server"
import { connectToDatabase } from '../mongoose'
import Question from '@/database/question.model'
import Tag from '@/database/tag.model'
import { revalidatePath } from 'next/cache'
import { GetQuestionsParams,CreateQuestionParams, GetQuestionByIdParams, QuestionVoteParams, DeleteQuestionParams, EditQuestionParams } from './shared.type'
import User from '@/database/user.model'
import Answer from '@/database/answer.model'
import Interaction from '@/database/interaction.model'
import { FilterQuery } from 'mongoose'

export async function getQuestions (params:GetQuestionsParams) {
  try {
    await connectToDatabase()
    console.log(params)
    const { searchQuery,filter,page=1,pageSize=20 }=params
    const query:FilterQuery<typeof Question>={}
    const skipAmount = (page - 1) * pageSize
    if (searchQuery) {
      query.$or=[
        {title:{$regex:new RegExp(searchQuery,"i")}},
        {content:{$regex:new RegExp(searchQuery,"i")}}
      ]
      
    }
let sortOptions={

} 
switch(filter){
case "newset":
  sortOptions={createdAt:'desc'};
  break;
case 'frequent':
  sortOptions={views:'desc'};
  break;
  case "unanswered":
    query.answers={
      $size:0
    }
    break;
    default:
      break;
}

    const questions = await Question.find(
      query
    ).populate({
      path:'tags',
      model:Tag
    }).populate({
      path:'author',
      model:User
    }).sort(sortOptions).skip(skipAmount).limit(pageSize)
    const totalQuestions=await Question.countDocuments(query)
    const isNext=skipAmount+pageSize<totalQuestions
    return { questions,isNext}
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

export async function deleteQuestion(params:DeleteQuestionParams){
  try {
    await connectToDatabase()
    const {questionId,path}=params
    await Question.deleteOne({_id:questionId}
      )
    await Answer.deleteMany({question:questionId})
    await Interaction.deleteMany({question:questionId})
    await Tag.updateMany(
      {
        questions:questionId
      },
      {
        $pull:{
          questions:questionId
        }
      }
    )
    revalidatePath(path)
    
    
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function editQuestion(params:EditQuestionParams){
  try {
    
    const {questionId,title,content,path}=params
    const question=await Question.findById(questionId).
                     populate("tags")
       if(!question){
        throw new Error('Question not found')
       }              
    question.title=title
    question.content=content
    await question.save()
    revalidatePath(path)
  } catch (error) {
    console.log(error)
throw error
    
  }
}
export async function getHotQuestions(){
  try {
    await connectToDatabase()
    const hotQuestions=await Question.find({})
    .sort({upvotes:-1,views:-1}).limit(5)
    return hotQuestions
  } catch (error) {
    console.log(error)
    throw error
  }
}