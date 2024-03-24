"use client"

import { GlobalSearchFilters } from '@/constants/filter'
import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const GlobalFilters=()=>{
const router=useRouter()
const searchParams=useSearchParams()
const type=searchParams.get("type")
const [active,setActive]=useState(type|| "")
const handleTypeClick=(item:string)=>{
  if(active===item){
    setActive("")
    const newurl=formUrlQuery({
      params:searchParams.toString(),
      key:"type",
      value:null
    })
    router.push(newurl,{scroll:false})
  }else{
  setActive(item)
const newUrl=formUrlQuery({
  params:searchParams.toString(),
  key:"type",
  value:item.toLowerCase()
})
router.push(newUrl,{scroll:false})
  }
}
return (

  <div className='flex items-center gap-5 px-5'>
  <p className='text-dark_light900 body-medium'>
    Type:
  </p>
    <div className='flex gap-3'>
      {
      GlobalSearchFilters.map((item)=>{
      return (
          <button
        type='button'
        onClick={()=>handleTypeClick(item.value)}
        key={item.value}
        className={` ${
          active===item.value ? "bg-primary-500 text-light-900" : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
        } light-border-2 small-medium :text-light-800 rounded-2xl px-5 py-2 capitalize dark:hover:text-primary-500`}>
          {item.name}
        </button>
      )
      })
      }
    </div>
  </div>
)

}

export default GlobalFilters