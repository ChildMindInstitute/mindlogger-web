import React from 'react';
import _ from "lodash";
import { useTranslation } from 'react-i18next';

// Component
import MyButton from '../components/Button';

export default Navigator = () => {
  const { t } = useTranslation();

  return (
    <div className="row no-gutters d-flex flex-row justify-content-between">
      <MyButton link="#" label={t("Back")} classes="ml-5 mb-2" />
      <MyButton link="#" label={t("Next")} classes="mr-5 mb-2" />
    </div>
  )
}