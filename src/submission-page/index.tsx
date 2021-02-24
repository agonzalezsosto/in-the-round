import React, { useEffect } from 'react'
import p5 from 'p5'
import { SubmissionSketch } from '../sketches'

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
    />
  )
}

export default SubmissionPage
