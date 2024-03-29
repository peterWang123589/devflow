"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams ,useRouter} from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import GlobalResult from './GlobalResult';

const GlobalSearch = () => {
  const router=useRouter()
  const pathname=usePathname()
  const searchParams=useSearchParams()
  const searchContainerRef=React.useRef<HTMLDivElement>(null)
  const query=searchParams.get('q')
const [search,setSearch]=useState(query || '')
const [isOpen,setIsOpen]=useState(false)
  useEffect(()=>{
    const handleClickOutside=(event:PointerEvent)=>{
      if(searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)){
        setIsOpen(false)
        setSearch('')
      }
    }
    setIsOpen(false)
    document.addEventListener('pointerdown',handleClickOutside)
    return ()=>{
      document.removeEventListener('pointerdown',handleClickOutside)
    }
  },[pathname])
useEffect(()=>{
  const delayDebounceFn=setTimeout(()=>{
    if(search){
      const newUrl=formUrlQuery({
        params:searchParams.toString(),
        key:'global',
        value:search
      })
      router.push(newUrl,{scroll:false})
    }else{
      
        const newUrl=removeKeysFromQuery({
          params:searchParams.toString(),
          keysToRemove:["global","type"]
        })
        router.push(newUrl,{scroll:false})
      
    }
  },300)
  return ()=>clearTimeout(delayDebounceFn)
},[search,router,searchParams,pathname,query])

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value) 
          if(!isOpen){
            setIsOpen(true)
          }
          if(!e.target.value&&isOpen){
            setIsOpen(false)
          }
          }}
          placeholder="Search globally"
          className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
        />
      </div>
      {isOpen&&<GlobalResult/>}
    </div>
  );
};

export default GlobalSearch;
