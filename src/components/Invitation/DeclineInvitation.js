import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  loggedInSelector,
  authTokenSelector,
} from "../../state/user/user.selectors";
import { InvitationText } from "./InvitationText";
import { InvitationStatuses } from "../../constants";
import { declineInvitation } from "../../services/invitation.service";
import "./style.css";

const DeclineInvitation = () => {
  const [status, setStatus] = React.useState(InvitationStatuses.LOADING);
  const [invitationText, setInvitationText] = React.useState("");
  const isLoggedIn = useSelector(loggedInSelector);
  const token = useSelector((state) => authTokenSelector(state));
  const { invitationId } = useParams();
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    if (isLoggedIn) handleDeclineInvitation();
  }, [isLoggedIn]);

  /**
   * Sends request to API for decling invitation
   * Displays the message from server upon succesful response
   */
  const handleDeclineInvitation = async () => {
    setStatus(InvitationStatuses.LOADING);
    try {
      const { body } = await declineInvitation({ token, invitationId });
      setStatus(InvitationStatuses.DECLINED);
      setInvitationText(body);
    } catch {
      setStatus(InvitationStatuses.ERROR);
    }
  };

  return (
    <div className="mt-3 pt-3 container">
      {isLoggedIn ? (
        <InvitationText status={status} invitationText={invitationText} />
      ) : (
        <div className="heading">
            {t("DeclineInvitation.please")} <Link to={"/login"}>{t("DeclineInvitation.login")}</Link> {t("DeclineInvitation.or")}{" "}
          <Link to={"/signup"}>{t("DeclineInvitation.singUp")}</Link> {t("DeclineInvitation.acceptInvitation")}
        </div>
      )}
    </div>
  );
};
export default DeclineInvitation;
