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
const {searchQuery,filter,page=1,pageSize=2}=params
const query:FilterQuery<typeof Tag>={}
const skipAmount = (page - 1) * pageSize
if (searchQuery) {
  query.$or=[
    {name:{$regex:new RegExp(searchQuery,"i")}},
  ]
}
let sortOptions={}
switch (filter) {
  case "popular":
    sortOptions={questions:"desc"}
    
    break;
    case "recent":
      sortOptions={createdAt:"desc"}
      break;
   case "name":
   sortOptions={name:1};
   break;
   case "old":
    sortOptions={createdAt:"asc"}
    break;

  default:
    break;
}

    const tags = await Tag.find(query).sort(sortOptions)
                  .limit(pageSize).skip(skipAmount);
     const totalTags=await Tag.countDocuments(query);
     const isNext=skipAmount+pageSize<totalTags;             

    return { tags ,isNext};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionByTagId(params:GetQuestionsByTagIdParams){
  try{
    await connectToDatabase()
    const {tagId,searchQuery,page=1,pageSize=1}=params
    const skipAmount = (page - 1) * pageSize
    const tagFilter:FilterQuery<ITag>={_id:tagId}
    const tag=await Tag.findOne(tagFilter).sort({createdAt:'desc'}).skip(skipAmount).limit(pageSize).populate({
      path:'questions',
      model:Question,
      match:
        searchQuery? {title:{$regex:searchQuery, $options:'i'}}:{}

      ,

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
    }).exec()
    if (!tag) {
      throw new Error("Tag not found");
      
    }
    console.log(`skipAmount: ${skipAmount}, pageSize: ${pageSize}, tag.questions.length: ${tag.questions.length}`)
    const isNext=skipAmount+pageSize<tag.questions.length
    return {tagTitle:tag.name,questions:tag.questions,isNext}
  }catch(error){
   console.log(error)
   throw error
  }
}

export async function getTopPopularTags(){
try {
  await connectToDatabase()
  const popularTags=await Tag.aggregate([
    {$project:{name:1,numberOfQuestions:{$size:'$questions'}}},
    {$sort:{numberOfQuestions:-1}},
    {$limit:5}
  ])
  return popularTags;
} catch (error) {
  console.log(error)
  throw error
}


}