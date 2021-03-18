import { T } from 'ramda';
import React from 'react';
import { useTranslation } from "react-i18next";
import {useSelector} from "react-redux";
import {userInfoSelector} from "../../state/user/user.selectors";

/**
 *
 * Component to display User Profile
 * @constructor
 */
export default function Profile() {
  const { t, i18n } = useTranslation();
  let user = useSelector(state => userInfoSelector(state));

  return (
    <div className="my-3 h-100">
      <div className="heading">
        <h1>
          {user?.firstName} {user?.lastName}
        </h1>
      </div>
      <hr/>
      <div>
       {t("Profile.p1")}
      </div>

      <div>
       {t("Profile.p2")}
      </div>
    </div>
  );
}
