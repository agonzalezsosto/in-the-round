import React from 'react'
import * as Image from '../images/logo.png'
import * as Insta from '../images/insta.png'
import * as Twitty from '../images/twitter.png'
import * as NX from '../images/nx.png'
import './landing.css'
import { TEXT } from '../constants/text'
import { useNavigate } from 'react-router'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const [width, setWidth] = React.useState<number>(window.innerWidth)

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth)
  }

  const isMobile = width < 800

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  })

  const handleNavigate = () => {
    navigate('submission-page')
  }
  return (
    <div className='landing-container'>
      {/* <div className='landing-title'>{TEXT.LANDING_HEADER}</div> */}
      <img
        src={Image.default}
        alt=''
        className='landing-image'
        style={{ zIndex: 0 }}
      />
      <div className='landing-description' style={{ zIndex: 1 }}>
        {TEXT.LANDING_SUBTITLE}
      </div>
      <div className='landing-description' style={{ zIndex: 1 }}>
        {TEXT.LANDING_DESCRIPTION}
      </div>
      {isMobile ? (
        <div className='landing-disclaimer'>
          Please visit this page from a computer to submit seeds.
        </div>
      ) : (
        <button className='landing-button' onClick={handleNavigate}>
          {TEXT.ENTER_TEXT}
        </button>
      )}

      <div className='landing-disclaimer'>
        Please stick to one sound source per seed.
      </div>
      <div className='landing-disclaimer'>
        By pressing enter, you agree that all sounds belong to you, and can be
        used in the release. If you would like to be credited, please include
        your name in the file name.
      </div>
      <div className='landing-disclaimer'>
        Info, such as key signature, BPM, or additional suggestions, can also be
        included in the file name.
      </div>
      <div className='landing-disclaimer'>{TEXT.DISCLAIMERB}</div>
      <div className='landing-footer'>
        <a href='https://www.nxrecords.co.uk/' target='_blank' rel='noreferrer'>
          <img
            src={NX.default}
            alt=''
            width={50}
            style={{ paddingRight: 10 }}
          />
        </a>
        <a
          href='https://www.instagram.com/nxrecords/'
          target='_blank'
          rel='noreferrer'
        >
          <img
            src={Insta.default}
            alt=''
            width={30}
            style={{ paddingRight: 10 }}
          />
        </a>
        <a
          href='https://twitter.com/NXRecords'
          target='_blank'
          rel='noreferrer'
        >
          <img src={Twitty.default} alt='' width={30} />
        </a>
      </div>
    </div>
  )
}

export default LandingPage
