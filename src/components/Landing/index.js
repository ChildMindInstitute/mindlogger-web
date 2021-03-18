import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Component for the index page of the WebApp
 * @constructor
 */
export default function Landing () {
  const { t } = useTranslation()
  return (
    <div className="my-3 h-100">
      <div className="mb-3 pt-3">
        <h1>{t('Landing.title')}</h1>
        <p className="lead">
        {t('Landing.reserchStudies')}
        </p>
        <img style={{ maxWidth: '500px', width: '100%' }} src="/undraw_data_xmfy.svg" />
        <div>
          <p className="mt-3">
          {t('Landing.toGet')}

          </p>
          <Link to="/login">
            <button type="button" className="btn btn-primary">
            {t('Landing.login')}
            </button>
          </Link>
          {t('Landing.or')}
          <Link to="/signup">
            <button type="button" className="btn btn-primary">
            {t('Landing.signUp')}
            </button>
          </Link>
        </div>
        <div className="mt-3">
          <Link to="/profile">
            <button type="button" className="btn btn-primary">
            {t('Landing.getStart')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
