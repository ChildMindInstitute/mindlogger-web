import React from 'react';
import _ from "lodash";
import { useTranslation } from 'react-i18next';

// Component
import MyButton from '../components/Button';

export default Navigator = ({ isBackShown, isNextShown, handleBack, isSubmitShown }) => {
  const { t } = useTranslation();

  return (
    <div className="row no-gutters d-flex flex-row justify-content-between">
      {isBackShown ? <MyButton label={t("back")} classes="ml-5 mb-2" handleClick={handleBack} /> : <div />}
      {isNextShown && <MyButton type="submit" label={isSubmitShown ? t("next") : t("submit")} classes="mr-5 mb-2" />}
    </div>
  )
}
