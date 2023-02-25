import React, { useEffect } from 'react'
import p5 from 'p5'
import {
  SubmissionSketch,
  handleSubmitFiles,
  getRandomFiles
} from '../sketches'

const SubmissionPage: React.FC = () => {
  useEffect(() => {
    new p5(SubmissionSketch)
  })

  return (
    <div
      id='submission-canvas'
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    >
      {/* <button
        id='create-button'
        className='submit-button'
        onClick={handleSubmitFiles}
      >
        Submit Files
      </button>
      <button
        id='a-button'
        className='random-seed-button'
        onClick={getRandomFiles}
      >
        Get Random Files
      </button> */}
    </div>
  )
}

export default SubmissionPage
