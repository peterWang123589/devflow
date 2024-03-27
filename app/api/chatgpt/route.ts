import { NextResponse} from 'next/server';

export const POST =async (request:Request)=>{
  const {question} =await request.json();
/*   console.log(question)
  console.log(process.env.OPENAI_API_KEY) */
try {
  const reponse=await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
    },
    body:JSON.stringify({
      model:"gpt-3.5-turbo",
      messages:[
          {
            role: "system",
            content:
              "You are a knowlegeable assistant that provides quality information."
          }
        ,
        {
          role:"user",
          content:`Tell me ${question}`
        }
      ]
    })
  })
  const responseData=await reponse.json()
     if (
      responseData.choices &&
      responseData.choices[0] &&
      responseData.choices[0].message
    ) {
      const reply = responseData.choices[0].message.content;
      return NextResponse.json({ reply });
    } else {
      return NextResponse.json({ error: "Unexpected API response structure" });
    }

} catch (error:any) {
    //  console.error(error);
    return NextResponse.json({ error: error.message });
}


}