import React from 'react';

import { Button } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';

import { useHistory } from 'react-router-dom';

export const SignIn = ({redirectUrl}) => {
  const { t } = useTranslation();

  const history = useHistory();

  const handleLogin = () => {
    history.push('/login', redirectUrl);
  };

  const handleSignup = () => {
    history.push('/signup', redirectUrl);
  };

  return (
    <div className="heading">
      {t('Invitation.please')}{' '}
      <Button type="button" className="btn btn-primary mx-1" onClick={handleLogin}>
        {t('Invitation.login')}
      </Button>
      {t('Invitation.or')}{' '}
      <Button type="button" className="btn btn-success mx-1" onClick={handleSignup}>
        {t('Invitation.singUp')}
      </Button>
    </div>
  );
};
