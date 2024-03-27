"use client"
import { useTheme } from '@/context/ThemeProvider';
import { AnswerSchema } from '@/lib/validation';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import {useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAnswer } from '@/lib/actions/answer.action';
import { Button } from '../ui/button';
import Image from 'next/image';
import { FormField, FormItem,Form,FormControl, FormMessage} from '../ui/form';
import { Editor } from '@tinymce/tinymce-react';
interface Props {
  questionId:string;
  question:string;
  authorId:string;
}

const Answer=({questionId,question,authorId}:Props)=>{
  const pathname=usePathname()
  const [isSubmitting,setIsSubmitting]=useState(false)
  const [isSubmittingAI,setIsSubmittingAI]=useState(false)
const {mode}=useTheme()
const editorRef=useRef(null)
const form=useForm<z.infer<typeof AnswerSchema>>({
  resolver:zodResolver(AnswerSchema),
  defaultValues:{
    answer:''
  }
})

const handleCreateAnswer=async (values:z.infer<typeof AnswerSchema>)=>{
  setIsSubmitting(true)
  try {
    
  await createAnswer({
    content:values.answer,
    author:JSON.parse(authorId) ,
    question:JSON.parse(questionId),
    path:pathname
  })
  form.reset()
  if(editorRef.current){
    (editorRef.current as any).setContent('')
  }
  } catch (error) {
    console.log(error)
  }finally{

  setIsSubmitting(false)
  }
  
}


const generateAIanswer=async ()=>{
  if(!authorId) return
  setIsSubmittingAI(true)
 try {
  const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          body: JSON.stringify({ question }),
        }
      );

      const aiAnswer = await response.json();
      // console.log(aiAnswer);
      // console.log(aiAnswer);
      if (!aiAnswer.reply) {
            alert(
          "Sorry for the inconvenience. No reply from the server because all credits have been used."
        );
        return;
      }
      // alert(aiAnswer.reply);

      // Convert plain text to HTML format
      const formattedAnswer = aiAnswer.reply
        ? aiAnswer.reply.replace(/\n/g, "<br />")
        : "";
      // const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }
 } catch (error) {
  console.log(error)
  throw error
 }finally{
  setIsSubmittingAI(false) // reset
 }
}
return (
  <div>
    <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
      <h4 className='paragraph-semibold text-dark400_light800 '>
        Write your answer here
      </h4>
      <Button
      onClick={generateAIanswer}
      disabled={isSubmittingAI}
      className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500">
        {isSubmittingAI ? 'Generating...' : <>
        
       <Image
       src={"/assets/icons/stars.svg"}
       alt='star'
       width={12}
       height={12}
       className='object-contain'

       />
    Generate an AI answer
        </>}
      </Button>
    </div>
    <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
  </div>

)

}

export default Answer