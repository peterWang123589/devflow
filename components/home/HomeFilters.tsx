'use client'
import { HomePageFilters } from '@/constants/filter'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import {useState } from 'react'

const HomeFilters=()=>{
  const searchParams=useSearchParams()
  const [active,setActive]=useState(searchParams.get("filter")||"newest")
  const router=useRouter()
  const handleTypeClick=(item:string)=>{
  if(active===item){
    setActive("")
    const newUrl=removeKeysFromQuery({
      params:searchParams.toString(),
      keysToRemove:["filter"],

    })
    router.push(newUrl,{scroll:false})
  }else{
    setActive(item)
    const newUrl=formUrlQuery({
      params:searchParams.toString(),
      key:"filter",
      value:item
    })
    router.push(newUrl,{scroll:false})
  }


  }

  return (
    <div className='mt-10 hidden flex-wrap gap-4 md:flex'>
      {HomePageFilters.map((filter)=>{
        return (
          <Button
          onClick={() => { handleTypeClick(filter.value) }}
          className={ ` ${active === filter.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500" }
          body-medium rounde-lg px-6 py-3 capitalize shadow-none` }
          key={filter.value}>{filter.name}</Button>)
          })}
    </div>
  )
}
export default HomeFilters