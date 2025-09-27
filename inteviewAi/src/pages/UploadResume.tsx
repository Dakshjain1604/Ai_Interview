import FileUpload from '@/components/ui/file-upload'
import React from 'react'

const UploadResume = () => {
  return (
    <div className='bg-background h-full w-full flex justify-center items-center'>
        <div className='absolute z-20'>
        <FileUpload />
        </div>
    </div>
  )
}

export default UploadResume