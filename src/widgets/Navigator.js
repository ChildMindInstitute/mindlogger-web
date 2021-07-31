import React from 'react';
import _ from "lodash";
import { useTranslation } from 'react-i18next';

// Component
import MyButton from '../components/Button';

export default Navigator = (props) => {
  const { t } = useTranslation();
  const {
    isBackShown,
    isNextShown,
    isNextDisable,
    handleBack,
    isSubmitShown,
    canSubmit
  } = props;

  return (
    <div className="row no-gutters d-flex flex-row justify-content-between">
      {
        isBackShown &&
        <MyButton
          label={t("back")}
          classes="ml-5 mb-2"
          handleClick={handleBack}
        />
        || <div />
      }

      {
        isNextShown
        &&
        <MyButton
          type="submit"
          label={isSubmitShown ? t("submit") : t("next")}
          classes="mr-5 mb-2"
          disabled={isNextDisable}
          handleClick={(e) => {
            if (typeof canSubmit === 'function' && !canSubmit(e)) {
              e.preventDefault();
            }
          }}
        />
      }
    </div>
  )
}
