import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  Container,
  Button,
} from 'react-bootstrap'

import { appletsSelector } from '../../state/applet/applet.selectors';

import './style.css'

const ActivityThanks = ({}) => {
  const { t } = useTranslation()
  const { appletId } = useParams();
  const history = useHistory();
  const applets = useSelector(appletsSelector);

  const applet = applets.find(({ id }) => id.includes(appletId));

  return (
    <Container fluid>
      <div className="mt-3 pt-3 container">
        <div className="saved-answer">
          <span>{t('additional.thanks')}</span>
          <span>{t('additional.saved_answers')}</span>
        </div>

        <div className="actions">
          <Button full rounded onClick={() => {
            if (applet.publicId) {
              history.push(`/applet/public/${appletId.split('/').pop()}/dashboard`);
            } else {
              history.push(`/applet/${appletId}/dashboard`);
            }
          }}>
            {t('additional.close')}
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default ActivityThanks;
