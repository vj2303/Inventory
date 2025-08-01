'use client'

import FileUploadComponent from '@/components/FileUpload'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  const router = useRouter()
  
  return (
    <div>
      <div className='flex flex-row items-center justify-between'>
        <h1 className="text-3xl font-bold mb-8">Comparison</h1>

        <button 
          className='bg-[#004C4C] text-[20px] px-[29px] py-[15px] cursor-pointer text-[#ffff] rounded-lg'
          onClick={() => router.push('/analytics/comparison/comparing')}
        >
          Compare
        </button>
        
      </div>
      <FileUploadComponent/>
    </div>
  )
}

export default Page