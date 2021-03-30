import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { steps, fullConsentForm, ConsentMode } from '../../constants/index'
import {
  userInfoSelector,
  loggedInSelector
} from '../../state/user/user.selectors'
import { useSelector } from 'react-redux'
import SignUp from '../../components/Signup/index'
import Login from '../../components/Login/index'
import { history } from '../../store'
import './style.css'

export const Consent = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const [mode, setMode] = useState(ConsentMode.SIGNUP)
  const isLoggedIn = useSelector(loggedInSelector)
  const user = useSelector(userInfoSelector)
  const { t } = useTranslation()

  const doNextStep = () => {
    window.scrollTo(0, 0)
    if (!isLoggedIn) setShowLogin(true)
    else {
      // Add User To Applet
      history.push('/applet')
    }
  }

  // const addAppletToUser = async (appletId, user) => {
  //   try {

  //   }
  // }

  return (
    <div>
      {steps.length > currentStep && (
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex flex-column align-items-center mt-4">
            <img src={steps[currentStep].image} width="300" />
            <h1 className="text-center pt-3"> {steps[currentStep].title}</h1>
          </div>
          <div
            className="step-content"
            dangerouslySetInnerHTML={{
              __html: steps[currentStep].text
            }}
          ></div>
        </div>
      )}

      {showLogin
        ? (
        <div className="text-center pt-5">
          <h1>{t('Consent.thanks')} </h1>
          <h5>
            {t('Consent.getStarted')}{' '}
            <span
              className="text-danger"
              onClick={() => setMode(ConsentMode.SIGNUP)}
            >
              {t('Consent.signUp')}
            </span>{' '}
            {t('Consent.or')}{' '}
            <span onClick={() => setMode(ConsentMode.LOGIN)}>
              {t('Consent.login')}
            </span>
          </h5>{' '}
          {mode === ConsentMode.SIGNUP ? <SignUp /> : <Login />}
        </div>
          )
        : (
            currentStep === steps.length && (
          <div>
            <div className="d-flex justify-content-center pt-3">
              <img
                src={'https://parkinsonmpower.org/static/images/Consent.svg'}
                width="55"
              />
              <h1 className="pl-2">{t('Consent.consentForm')}</h1>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: fullConsentForm.fullConsentForm
              }}
            />
          </div>
            )
          )}
      <div className="text-center">
        {!showLogin && currentStep > 0 && (
          <Button
            variant="outline-secondary"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="step-btn mr-1"
          >
            {t('Consent.back')}
          </Button>
        )}

        {currentStep < steps.length && (
          <Button
            variant="outline-success"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="step-btn"
          >
            {t('Consent.next')}
          </Button>
        )}

        {!showLogin && currentStep === steps.length && (
          <Button
            variant="outline-primary"
            onClick={() => {
              doNextStep()
            }}
            className="step-btn bg-primary text-white"
          >
            {' '}
            {t('Consent.consent')}
          </Button>
        )}
      </div>
    </div>
  )
}
