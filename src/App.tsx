import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { SiteRoutes } from './constants/routes'
import LandingPage from './landing-page'
import SubmissionPage from './submission-page'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={SiteRoutes.LANDING_PAGE} element={<LandingPage />} />
        <Route path={SiteRoutes.SUBMISSION_PAGE} element={<SubmissionPage />} />
      </Routes>
    </Router>
  )
}

export default App
