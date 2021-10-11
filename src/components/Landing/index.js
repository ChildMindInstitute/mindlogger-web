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
    <div className="my-3 h-100">
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
              <Link to="/login">
                <Button type="button" variant="primary" className="btn btn-primary btn-lg mr-1">
                  {t('Landing.login')}
                </Button>
              </Link>
              {t('Landing.or')}
              <Link to="/signup">
                <Button type="button" variant="success" className="btn btn-primary btn-lg ml-1">
                  {t('Landing.signUp')}
                </Button>
              </Link>
            </div>
              )}
        </div>
      </div>
    </div>
  )
}
