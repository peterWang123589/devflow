'use client'
import { HomePageFilters } from '@/constants/filter'
import { Button } from '../ui/button'

const HomeFilters=()=>{
  const active="newest"
  return (
    <div className='mt-10 hidden flex-wrap gap-4 md:flex'>
      {HomePageFilters.map((filter)=>{
        return (
          <Button
          onClick={() => {}}
          className={ ` ${active === filter.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500" }
          body-medium rounde-lg px-6 py-3 capitalize shadow-none` }
          key={filter.value}>{filter.name}</Button>)
          })}
    </div>
  )
}
export default HomeFilters