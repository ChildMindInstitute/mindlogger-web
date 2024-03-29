import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Container, Row, Spinner } from 'react-bootstrap'
import Avatar from 'react-avatar';

import { getApplets } from '../../state/applet/applet.actions'
import { setCurrentApplet } from '../../state/app/app.reducer'
import { appletsSelector } from '../../state/applet/applet.selectors';

import './style.css'
import { Mixpanel } from '../../services/mixpanel'

/**
 * Component for the index page of the WebApp
 * @constructor
 */
export default function AppletList() {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);
  const applets = useSelector(appletsSelector);

  useEffect(() => {
    const fetchApplets = async () => {
      setIsLoading(true);
      await dispatch(getApplets());
      setIsLoading(false);
    }
    fetchApplets();
  }, [])

  useEffect(() => {
    Mixpanel.trackPageView('Dashboard');
  }, [])

  const onSelectApplet = (appletId) => {
    dispatch(setCurrentApplet(appletId));

    history.push(`/${appletId}/dashboard`);
  }

  return (
    <Container>
      <Row className="applet-list">
        {!isLoading ?
          applets.length && applets.filter(applet => !applet.isIgnore).map(applet => (
            <Card className="applet-card" onClick={() => onSelectApplet(applet.id)} key={applet.id}>
              <div className="applet-header">
                <div className="applet-image">
                  {applet.image ?
                    <Card.Img variant="top" src={applet.image} />
                    :
                    <Avatar color="#777" name={applet.name.en} maxInitials={2} size="240" round="3px" />
                  }
                </div>
              </div>
              <Card.Body>
                <Card.Title className="applet-card-title"> {applet.name.en} </Card.Title>
                <Card.Text> {applet.description.en} </Card.Text>
              </Card.Body>
            </Card>
          )) || <div className="mt-4 px-2 no-applets">{t('no_applets')}</div> :

          <Spinner animation="border mt-4"></Spinner>}
      </Row>
    </Container>
  )
}
