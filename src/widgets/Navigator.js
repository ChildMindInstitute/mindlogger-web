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
    canSubmit,
    isOnePageAssessment,
    skippable,
  } = props;

  if (isOnePageAssessment) {
    return (
      <div className="row no-gutters d-flex flex-row justify-content-around">
        {
          isSubmitShown
            &&
            <MyButton
              type="submit"
              label={isSubmitShown ? t("submit") : t("Consent.next")}
              disabled={false}
              classes="mb-2"
              handleClick={(e) => {
                if (typeof canSubmit === 'function' && !canSubmit(e)) {
                  e.preventDefault();
                }
              }}
            /> || <div />
        }
        {
          skippable &&
            <MyButton
              label={t("Consent.skip")}
              classes="mb-2"
              disabled={!isNextDisable}
            />
        }
      </div>
    );
  }

  return (
    <div className="row no-gutters d-flex flex-row justify-content-around">
      {
        isBackShown &&
        <MyButton
          label={t("Consent.back")}
          handleClick={handleBack}
          classes="mb-2"
        />
        || <div />
      }

      {
        isNextShown &&
        <MyButton
          type="submit"
          label={isSubmitShown ? t("submit") : isNextDisable && skippable ? t("Consent.skip") : t("Consent.next")}
          disabled={!skippable && isNextDisable}
          classes="mb-2"
          handleClick={(e) => {
            if (typeof canSubmit === 'function' && !canSubmit(e)) {
              e.preventDefault();
            }
          }}
        /> || <div />
      }
    </div>
  )
}
