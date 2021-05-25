import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Container, Row } from 'react-bootstrap'
import Avatar from 'react-avatar';

import { loggedInSelector } from '../../state/user/user.selectors'
import { getApplets } from '../../state/applet/applet.actions'
import { setCurrentApplet } from '../../state/app/app.reducer'
import { appletsSelector } from '../../state/applet/applet.selectors';

import './style.css'

/**
 * Component for the index page of the WebApp
 * @constructor
 */
export default function AppletList() {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(loggedInSelector);
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

  const onSelectApplet = (appletId) => {
    dispatch(setCurrentApplet(appletId));

    history.push(`/${appletId}/dashboard`);
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        {!isLoading && applets.map(applet => (
          <Card className="applet-card" onClick={() => onSelectApplet(applet.id)} key={applet.id}>
            {applet.image ?
              <Card.Img variant="top" src={applet.image} />
              :
              <Avatar color="#777" name={applet.name.en} maxInitials={2} size="286" round="3px" />
            }
            <Card.Body>
              <Card.Title className="applet-card-title"> {applet.name.en} </Card.Title>
              <Card.Text> {applet.description.en} </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  )
}
