"use server"

import Tag, { ITag } from '@/database/tag.model'
import { connectToDatabase } from '../mongoose'
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from './shared.type'
import User from '@/database/user.model'
import { FilterQuery } from 'mongoose'
import Question from '@/database/question.model'



export async function getTopInteractedTags(params:GetTopInteractedTagsParams){

  try {
    // await connectToDatabase()
    // const {userId}=params
    // const user=await User.findById(userId)
    // if(!user){
    //   throw new Error('User not found')
    //  }
     // Find interactions for the user and group by tags...
    // Interaction ..
    return [
      {
        _id:'1',
        name:'JavaScript'
      },
      {
        _id:'2',
        name:'ReactJS'
      },
      {
        _id:'3',
        name:'NextJS'
    }
    ]
  // eslint-disable-next-line no-unreachable
  } catch (error) {
  console.log(error)
    throw error
  }
}


export async function getAllTags(params: GetAllTagsParams) {
  try {
  await  connectToDatabase();

    const tags = await Tag.find({});

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionByTagId(params:GetQuestionsByTagIdParams){
  try{
    await connectToDatabase()
    const {tagId,searchQuery}=params
    const tagFilter:FilterQuery<ITag>={_id:tagId}
    const tag=await Tag.findOne(tagFilter).populate({
      path:'questions',
      model:Question,
      match:
        searchQuery? {title:{$regex:searchQuery, $options:'i'}}:{}

      ,
      options:{
      sort:{
        createdAt:'desc'
      }},
      populate:[
        {
          path:'author',
          model:User,
          select:"_id clerkId name picture"

        },
        {
          path:'tags',
          model:Tag,
          select:"_id name"
        }
      ]
    })
    if (!tag) {
      throw new Error("Tag not found");
      
    }
    return {tagTitle:tag.name,questions:tag.questions}
  }catch(error){
   console.log(error)
   throw error
  }
}