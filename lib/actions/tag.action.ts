"use server"

import Tag from '@/database/tag.model'
import { connectToDatabase } from '../mongoose'
import { GetAllTagsParams, GetTopInteractedTagsParams } from './shared.type'
import User from '@/database/user.model'



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
    connectToDatabase();

    const tags = await Tag.find({});

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}