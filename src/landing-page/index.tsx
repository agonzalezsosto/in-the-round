import React from 'react'
import * as Image from '../images/logo.png'
import './landing.css'
import { TEXT } from '../constants/text'
import { useNavigate } from 'react-router'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('submission-page')
  }
  return (
    <div className='landing-container'>
      <div className='landing-title'>{TEXT.LANDING_HEADER}</div>
      <img src={Image.default} alt='' className='landing-image' />
      <div className='landing-subtitle'>{TEXT.LANDING_SUBTITLE}</div>
      <div className='landing-description'>{TEXT.LANDING_DESCRIPTION}</div>
      <button className='landing-button' onClick={handleNavigate}>
        {TEXT.ENTER_TEXT}
      </button>
    </div>
  )
}

export default LandingPage
