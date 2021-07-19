import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Container, Row } from 'react-bootstrap'
import Avatar from 'react-avatar';

import { getPublicApplet } from '../../state/applet/applet.actions'
import { appletsSelector } from '../../state/applet/applet.selectors';
import { setCurrentApplet } from '../../state/app/app.reducer'

import './style.css'

/**
 * Component for the index page of the WebApp
 * @constructor
 */
export default function PublicApplet() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true);
  const applets = useSelector(appletsSelector);

  useEffect(() => {
    const fetchApplets = async () => {
      setIsLoading(true);
      await dispatch(getPublicApplet(id));
      setIsLoading(false);
    }
    fetchApplets();
  }, [])

  const onSelectApplet = (appletId) => {
    dispatch(setCurrentApplet(appletId));

    history.push(`/applet/public/${appletId.split('/').pop()}/dashboard`);
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
