"use client"

import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.action';
import { viewQuestion } from '@/lib/actions/interaction.action';
import { downvoteQuestion, upvoteQuestion } from '@/lib/actions/question.action';
import { toggleSaveQuestion } from '@/lib/actions/user.action';
import { formatAndDivideNumber } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from '../ui/use-toast';


interface Props {
  type:"question" | "answer";
  itemId:string;
  userId:string;
  upvotes:number;
  hasupVoted:boolean;
  downvotes:number;
  hasdownVoted:boolean;
  hasSaved?:boolean
  testflag?:string
}

const Votes=({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved,
  testflag
}:Props)=>{
  const pathname=usePathname()
  const router=useRouter()
  const handleSave=async ()=>{
      if(!userId){
      return toast({
        title:"Please login to save",
        description:"You need to login to save",
          className:"text-dark400_light900 background-light700_dark400",
      duration:2000
      })
    }
await toggleSaveQuestion(
  {
    questionId:JSON.parse(itemId),
    userId:JSON.parse(userId),
    path:pathname
  }

)
return toast({
  title:`Question ${!hasSaved ? "saved in" : "removed from"} your collection`,
  variant:!hasSaved ?"default" :"destructive",
    className:"text-dark400_light900 background-light700_dark400",
      duration:2000
})

  }
  const handleVote=async (action:"upvote" | "downvote")=>{
    if(!userId){
      return toast({
        title:"Please login to vote",
        description:"You need to login to vote",
          className:"text-dark400_light900 background-light700_dark400",
      duration:2000

      })
    }
    if(action==="upvote"){
    if(type==="question"){
        await upvoteQuestion({
          questionId:JSON.parse(itemId),
          userId:JSON.parse(userId),
          hasdownVoted,
          hasupVoted,
          path:pathname
        })

    }else if(type==="answer"){
      await upvoteAnswer({
        answerId:JSON.parse(itemId),
        userId:JSON.parse(userId),
        hasdownVoted,
        hasupVoted,
        path:pathname
      })

    }
    return toast({
      title:`Upvote ${!hasupVoted ? "Successful" : "Removed"}`,
      variant:!hasupVoted ?"default" :"destructive",
        className:"text-dark400_light900 background-light700_dark400",
      duration:2000
    })
  }else if(action==="downvote"){
     if(type==="question"){
      await downvoteQuestion({
        questionId:JSON.parse(itemId),
        userId:JSON.parse(userId),
        hasdownVoted,
        hasupVoted,
        path:pathname
      })

     }else if(type==="answer"){

      await downvoteAnswer({
        answerId:JSON.parse(itemId),
        userId:JSON.parse(userId),
        hasdownVoted,
        hasupVoted,
        path:pathname
      })
  }}
  return toast(
    {
      title:`Downvote ${!hasdownVoted ? "Successful" : "Removed"}`,
      variant:!hasdownVoted ?"default"  :"destructive",
      className:"text-dark400_light900 background-light700_dark400",
      duration:2000,

    }
  )

  }

  useEffect(()=>{
    console.log("rerender"+" "+testflag )
    viewQuestion({
      questionId:JSON.parse(itemId),
      userId:userId?JSON.parse(userId):undefined

    })
  },[itemId,userId,pathname,router,testflag])

    return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2.5'>
        <div className='flex-center gap-1.5'>
          <Image
          src={hasupVoted?"/assets/icons/upvoted.svg":"/assets/icons/upvote.svg"}
          width={18}
          height={18}
          alt="upvote"
          className='cursor-pointer'
          onClick={()=>handleVote("upvote")}/>
        <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
          <p className='subtle-medium text-dark400_light900'>
            {formatAndDivideNumber(upvotes)}

          </p>

        </div>
        </div>

        <div className='flex-center gap-1.5'>
        <Image
        src={hasdownVoted?"/assets/icons/downvoted.svg":"/assets/icons/downvote.svg"}
        width={18}
        height={18}
        alt="downvote"
        className='cursor-pointer'
        onClick={()=>handleVote("downvote")}/>
        <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
          <p className='subtle-medium text-dark400_light900'>
            {formatAndDivideNumber(downvotes)}
          </p>
        </div>
      </div>
      </div>
      {
        type==='question' && <Image
        src={hasSaved?"/assets/icons/star-filled.svg":"/assets/icons/star.svg"}
        width={18}
        height={18}
        alt="save"
        className='cursor-pointer'
        onClick={handleSave}
        />
      }

    </div>
  )
}

export default Votes