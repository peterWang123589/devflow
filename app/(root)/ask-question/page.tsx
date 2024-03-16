import React from "react";
import Question from '@/components/forms/Question';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';
const QuestionPage =async () => {
  const {userId}=auth()
  if(!userId){
    return redirect("/sign-in")
  }
  const user=await getUserById({userId})
  console.log(user)
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <Question userId={JSON.stringify(user._id)} />
      </div>
    </div>
  );
};

export default QuestionPage;
