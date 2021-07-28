import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Container, Row } from 'react-bootstrap'
import Avatar from 'react-avatar';

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
  const applets = useSelector(appletsSelector);

  useEffect(() => {
    const fetchApplets = async () => {
      setIsLoading(true);
      const action = await dispatch(getPublicApplet(publicId));
      const applet = action.payload;

      dispatch(setCurrentApplet(applet.id))

      setIsLoading(false);
    }
    fetchApplets();
  }, [])

  return (
    isLoading && <></> || <ActivityList />
  )
}
