


import Link from 'next/link'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Metric from '@/components/shared/Metric'
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils'
import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/RenderTag'
import AllAnswers from '@/components/shared/AllAnswers'
import Answer from '@/components/forms/Answer'


const Page=async ({params,searchParams}:any)=>{
  const result=await getQuestionById({
    questionId:params.id
  })
  const {userId:clerkId}=auth()
  let user
  if(clerkId){
    user=await getUserById({userId:clerkId})
  }
  return (
  <>
  <div className='flex-start w-full flex-col'>
  <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
    <Link href={`/profile/${result.author.clerkId}`}
    className='flex items-center justify-center gap-1'>
    <Image src={result.author.picture}
    className='rounded-full'
    width={22}
    height={22}
    alt="profile picture"/>
   <p className='paragraph-semibold text-dark300_light700'>
    {result.author.name}
   </p>
    </Link>
    <div className='text-dark200_light900 flex justify-end'>Voting</div>

  </div>
   <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
    {result.title}
   </h2>
  </div>
  <div className='mb-8 mt-5 flex flex-wrap gap-4'>
<Metric
    imgUrl='/assets/icons/clock.svg'
    alt='clock icon'
    value={`asked ${ getTimestamp(result.createdAt) }`}
    title='Asked'
    textStyle='text-dark400_light800 small-medium'/>

<Metric
imgUrl='/assets/icons/message.svg'
alt='message'
value={formatAndDivideNumber(result.answers.length)}
title='Answers'
textStyle='text-dark400_light800 small-medium'/>
  <Metric
    imgUrl='/assets/icons/eye.svg'
    alt='eye'
    value={formatAndDivideNumber(result.views)}
    title='Votes'
    textStyle='text-dark400_light800 small-medium'/>
  </div>

  <ParseHTML html={result.content}></ParseHTML>
  <div className='mt-8 flex flex-wrap gap-2'>
    {
      result.tags.map((tag:any)=>(
        <RenderTag
        key={tag._id}
        _id={tag._id}
        name={tag.name}
        showCount={false}/>
      ))
    }
  </div>
  <AllAnswers
  questionId={result._id}
  userId={JSON.stringify(user._id)}
  totalAnswers={result.answers.length}
  />
  <Answer
  question={result.content}
  questionId={JSON.stringify(result._id)}
  authorId={JSON.stringify(user._id)}/>
  </>
  )
}
export default Page