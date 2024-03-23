"use server"
import Answer from '@/database/answer.model';
import { connectToDatabase } from '../mongoose';
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from './shared.type';
import { revalidatePath } from 'next/cache';
import User from '@/database/user.model';
import Question from '@/database/question.model';
import Interaction from '@/database/interaction.model';



export async function createAnswer(params:CreateAnswerParams) {
  try {
    await connectToDatabase()
    const {content,author,question,path}=params
    const answer=await Answer.create(
      {
        content,
        author,
        question
      }
    )
    await Question.findByIdAndUpdate(question,{
      $push:{
        answers:answer._id
      }
    })
    revalidatePath(path)
    return answer
    
  } catch (error) {
    console.log(error)
    throw error


  }
}

export async function getAnswers(params:GetAnswersParams){

  try {
    await connectToDatabase()
    const {questionId,sortBy,page=1,pageSize=10}=params
    const skipAmount = (page - 1) * pageSize
    let sortOptions={}
    switch (sortBy) {
      case "highestUpvotes":
        sortOptions={upvotes:'desc'}
        break;
       case 'lowestUpvotes':
        sortOptions={upvotes:'asc'}
        break;
        case "recent":
          sortOptions={createdAt:'desc'}
          break;
        case "old":
          sortOptions={createdAt:'asc'}
          break;
      default:
        break;
    }

    const answers=await Answer.find({question:questionId}).populate({
      path:'author',
      model:User,
      select:'_id clerkId name picture'


      

    }).sort(sortOptions).skip(skipAmount).limit(pageSize)
    const totalAnswers=await Answer.countDocuments({question:questionId})
    const isNext=skipAmount+pageSize<totalAnswers
    return {answers,isNext}
  } catch (error) {
    console.log(error)
    throw error
    
  }
}

export async function upvoteAnswer(params:AnswerVoteParams){
  try {
    await connectToDatabase()
    const {answerId,userId,hasupVoted,hasdownVoted,path}=params
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
const answer=await Answer.findByIdAndUpdate(answerId,updateQuery,{
  new:true
})
if(!answer){
  throw new Error('Answer not found')
}
// Increment author's reputation bt +10 for upvoting a question
revalidatePath(path)

  } catch (error) {
    console.log(error)
    throw  error;
  }
}

export async function downvoteAnswer(params:AnswerVoteParams){

  try {
    
    await connectToDatabase()
    const {answerId,userId,hasupVoted,hasdownVoted,path}=params
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
    const answer=await Answer.findByIdAndUpdate(answerId,updateQuery,{
      new:true
    })
    if(!answer){
      throw new Error('Answer not found')
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw  error; 
    
  }


}

export async function deleteAnswer(params:DeleteAnswerParams){
  try {
    await connectToDatabase(

    )
    const {answerId,path}=params
    const answer=await Answer.findById(answerId)
    if(!answer){
      throw new Error('Answer not found')
    }
  await answer.deleteOne({_id:answerId})
  await Question.updateMany(
    {_id:answer.question},
    {
      $pull:{
        answers:answerId
      }
    }
    
    )
    await Interaction.deleteMany({answer:answerId})
    
    revalidatePath(path)
  } catch (error) {
    console.log(error)
  throw error
  }
}

