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
        <h1>{t('Landing.title')}</h1>
        <p className="lead">{t('Landing.reserchStudies')}</p>
        <img
          style={{ maxWidth: '500px', width: '100%' }}
          src="/undraw_data_xmfy.svg"
        />
        <div>
          {isLoggedIn
            ? (
            <div className="mt-3">
              <Link to="/applet">
                <Button type="button" className="btn btn-danger btn-lg">
                  {t('Landing.getStart')}
                </Button>
              </Link>
            </div>
              )
            : (
            <div>
              <p className="mt-3 text-center">{t('Landing.toGet')}</p>
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
