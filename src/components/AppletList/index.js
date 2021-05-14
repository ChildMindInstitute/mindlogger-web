import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Container, Row } from 'react-bootstrap'
import { loggedInSelector } from '../../state/user/user.selectors'
import { getApplets } from '../../state/app/app.actions'
import Avatar from 'react-avatar';

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
  const [applets, setApplets] = useState([]);

  useEffect(() => {
    const fetchApplets = async () => {
      setIsLoading(true);
      const res = await dispatch(getApplets());

      setApplets(res.payload);
      setIsLoading(false);
    }

    fetchApplets();
  }, [])

  const onSelectApplet = (appletId) => {
    history.push(`/applet/${appletId}/dashboard`);
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        {applets.map(applet => (
          <Card className="applet-card" onClick={() => onSelectApplet(applet.id)} key={applet.id}>
            {applet.image &&
              <Card.Img variant="top" src={applet.image} />
            }
            {!applet.image &&
              <Avatar name={applet.name.en} maxInitials={2} size="254" round="3px" />
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
