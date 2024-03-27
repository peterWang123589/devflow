import React from "react";
import { Button } from '@/components/ui/button';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import Filter from '@/components/shared/Filter';
import { HomePageFilters } from '@/constants/filter';
import HomeFilters from '@/components/home/HomeFilters';
import NoResult from '@/components/shared/NoResult';
import QuestionCard from '@/components/cards/QuestionCard';
import Link from 'next/link';
import { getQuestions, getRecommendedQuestions } from '@/lib/actions/question.action';
import { SearchParamsProps } from '@/types';
import Pagination from '@/components/shared/Pagination';
import { Metadata } from 'next';
import { auth } from '@clerk/nextjs';
// questions=[]
export const metadata: Metadata = {
  title: "Home | Dev Overflow",
};
export default async function Home ({searchParams}:SearchParamsProps) {
  let questions:any[];
  let isNext
  const {userId}=auth()
  console.log("----------",searchParams)
  if(searchParams?.filter === "recommended"){
    if(userId){
       const     res = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
      });
     console.log("recommed",res) 
       questions=res.questions
  isNext=res.isNext

    }else{
      questions=[]
      isNext=false
    }

  }else{
      const res=await getQuestions({

    filter:searchParams?.filter,
    searchQuery:searchParams?.q,
    page:searchParams?.page ?(+searchParams):1
  })
  questions=res.questions
  isNext=res.isNext

  }


  return (
    <>
    <div className=' flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
      <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
     <Link href='/ask-question' className='flex justify-end max-sm:w-full'>
      <Button className=' primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>Ask Question</Button></Link>     
      </div>  
      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchBar route='/' iconPosition='left' imgSrc='/assets/icons/search.svg' 
        placeholder='Search for questions' otherClasses='flex-1'/>
        <Filter filters={HomePageFilters} otherClasses='min-h-[56px] sm:min-w-[170px]'
        containerClasses='hidden max-md:flex'></Filter>
      </div>
       <HomeFilters/>
       <div className='mt-10 flex w-full flex-col gap-6'>
        {
questions.length>0?(
  questions.map((question:any)=>{
    // console.log(question.author)
    return(
      <QuestionCard key={question._id} 
      _id={question._id}
      title={question.title}
      tags={question.tags}
      author={question.author}
      upvotes={question.upvotes}
      views={question.views}
      answers={question.answers}
      createdAt={question.createdAt}
      />
    )
  })
):(
  <NoResult
              title="There&rsquo;s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
  />)
        }
       </div>
           <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  );
};
