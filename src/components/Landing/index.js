import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { loggedInSelector } from '../../state/user/user.selectors'
import './style.css'
/**
 * Component for the index page of the WebApp
 * @constructor
 */
export default function Landing () {
  const { t } = useTranslation()
  const isLoggedIn = useSelector(loggedInSelector)
  return (
    <div className="position-absolute d-flex landing-container">
      <div>
        <img
          style={{ maxWidth: '70px', width: '100%' }}
          className="mb-2 ml-2"
          src="/apple.png"
        />
      </div>
      <div className="mb-3 pt-3 d-flex flex-column align-items-center">
        <img
          style={{ maxWidth: '120px', width: '100%' }}
          className="mb-2"
          src="/favicon.png"
        />
        <div>
          {isLoggedIn
            ? (
            <div className="mt-4">
              <Link to="/applet">
                <Button type="button" className="btn btn-danger btn-lg">
                  {t('Landing.getStart')}
                </Button>
              </Link>
            </div>
              )
            : (
            <div>
              <p className="mt-4 text-center">{t('Landing.toGet')}</p>
              <Link className="d-flex justify-content-center mb-2" to="/login">
                <Button type="button" variant="primary" className="btn btn-primary btn-lg">
                  {t('Landing.login')}
                </Button>
              </Link>
              <Link className="d-flex justify-content-center" to="/signup">
                <Button type="button" variant="success" className="btn btn-primary btn-lg">
                  {t('Landing.signUp')}
                </Button>
              </Link>
            </div>
              )}
        </div>
      </div>
      <div>
        <img
          style={{ maxWidth: '60px', width: '100%' }}
          className="mb-2 mr-4"
          src="/android.png"
        />
      </div>
    </div>
  )
}
