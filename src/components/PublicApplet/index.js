import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import Avatar from 'react-avatar';
import { useTranslation } from 'react-i18next';

import { getPublicApplet } from '../../state/applet/applet.actions'
import { appletsSelector } from '../../state/applet/applet.selectors';
import { setCurrentApplet } from '../../state/app/app.reducer'
import ActivityList from '../ActivityList'

import './style.css'

/**
 * Component for the index page of the WebApp
 * @constructor
 */
export default function PublicApplet() {
  const dispatch = useDispatch()
  const { publicId } = useParams()
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useTranslation()

  useEffect(() => {
    const fetchApplets = async () => {
      setIsLoading(true);
      const action = await dispatch(getPublicApplet(publicId));
      const applet = action.payload;

      if (applet) {
        dispatch(setCurrentApplet(applet.id))
      } else {
        setError(true);
      }

      setIsLoading(false);
    }
    fetchApplets();
  }, [])

  return (
      isLoading && <div className="text-center mt-4"><Spinner animation="border"></Spinner></div> ||
      error ? <h3 className="text-center mt-4">{t('additional.invalid_public_url')}</h3> : <ActivityList />
  )
}
