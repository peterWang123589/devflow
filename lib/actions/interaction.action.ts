"use server"

import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import { ViewQuestionParams } from './shared.type';
import Interaction from '@/database/interaction.model';



export async function viewQuestion(params:ViewQuestionParams){

  try {
    await connectToDatabase()
    const {questionId,userId}=params
  // update the view count
  console.log("view question")
  await Question.findByIdAndUpdate(questionId,{
    $inc:{
     views:1
    }
  })
if (userId) {
  const existingInteraction=await Interaction.findOne({
    question:questionId,
    user:userId,
    action:"view"
  })
  if(existingInteraction){
    return console.log("user already viewed question")
  } 
     await Interaction.create({
      question:questionId,
      user:userId,
      action:"view"
    })
}
  } catch (error) {
    console.log(error)
    throw error
  }
}