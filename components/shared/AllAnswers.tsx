import Image from "next/image"
import React from "react"
import Filter from './Filter';
import { AnswerFilters } from '@/constants/filter';
import { getAnswers } from '@/lib/actions/answer.action';
import Link from 'next/link';
import { getTimestamp } from '@/lib/utils';
import ParseHTML from './ParseHTML';



interface Props {
  questionId:string;
  userId:string
  totalAnswers:number;
  page?:number;
  filter?:number;
}

const AllAnswers =async ({questionId,userId,totalAnswers,page,filter}:Props) => {
  const result=await getAnswers({
    questionId
  })
  return (
    <div className='mt-11'> 
     <div className='item-center jus-between flex'>
      <h3 className='primary-text-gradient'>
        {
          totalAnswers
        } Answers
        <Filter filters={AnswerFilters} />
      </h3>
     </div>
     <div>
     {
      result.answers?.map((answer)=>(
<article key={answer._id}
className='text-dark100_light900 light-border border-b py-10'>
  <div className='flex items-center justify-between'>
    <div className='mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
      <Link href={`/profile/${answer.author.clerkId}`}
      className='flex flex-1 items-start gap-1 sm:items-center'>
       <Image 
       src={
        answer.author.picture
       }
       alt="profile picture"
       width={18}
       height={18}
       className='rounded-full object-cover max-sm:mt-0.5'

       />
       <div className='flex flex-col sm:flex 
       sm:items-center'>
        <p className='body-semibold 
        text-dark300_light700'>
        {answer.author.name}
        </p>
        <p className='small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1'>
          answered {getTimestamp(answer.createdAt)}
        </p>
       </div>
      </Link>
       
       <div className='flex justify-end'>

        VOTING
       </div>
    </div>
  </div>
<ParseHTML html={answer.content }/>
</article>
))
     }
      
     </div>
      
    </div>
  )
}
export default AllAnswers