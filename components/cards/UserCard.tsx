import { getTopInteractedTags } from "@/lib/actions/tag.action"
import Link from "next/link"
import React from 'react'
import {Badge} from '@/components/ui/badge'
import RenderTag from '@/components/shared/RenderTag'
import Image from "next/image"

interface Props {
 user:{
  _id:string;
  clerkId:string;
  picture:string;
  name:string;
  username:string;
 }


}


const UserCard=async ({user}:Props)=>{
  const interactedTags=await getTopInteractedTags({userId:user._id})
  return (
    <Link
     className='shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]'
     href={`/profile/${user.clerkId}`}>
     <div
     className='background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8'>
     <Image src={user.picture}
     alt='user profile picture' 
     width={100} height={100}
     className='rounded-full'></Image>
     <div className=' mt-4 text-center'>
      <h3 className='h3-bold text-dark200_light900 
      line-clamp-1'>{user.name}</h3>
      <p className='body-regular text-dark500_light500
      mt-2'>@{user.username}</p>

     </div>

     <div className='mt-5'>
     {
      interactedTags.length>0?(
           <div className='
           item-center flex gap-2'>


           {
            interactedTags.map((tag)=>{
              return <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
            })
           }
           </div>       
      ):(
      <Badge>No tags yet</Badge>
      )
     }
      
     </div>

     </div>
    
    </Link>
  )


}

export default UserCard