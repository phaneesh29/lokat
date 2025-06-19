import React from 'react'

const LoadingButton = () => {
    return (
        <>
            <div className='flex justify-center items-center gap-2'>
                <div className='size-6 border-r-2 rounded-full border-red-950 animate-spin'>

                </div>
                <p>Loading ...</p>
            </div>

        </>
    )
}

export default LoadingButton