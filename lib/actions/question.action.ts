"use server"
import { connectToDatabase } from '../mongoose'
import Question from '@/database/question.model'
import Tag from '@/database/tag.model'
import { revalidatePath } from 'next/cache'
import { GetQuestionsParams,CreateQuestionParams } from './shared.type'
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