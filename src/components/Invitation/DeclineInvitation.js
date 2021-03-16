import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
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

  React.useEffect(() => {
    if (isLoggedIn) handleDeclineInvitation();
  }, [isLoggedIn]);

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
          Please <Link to={"/login"}>Login</Link> or{" "}
          <Link to={"/signup"}>Sign Up</Link> to Decline This Invitation
        </div>
      )}
    </div>
  );
};
export default DeclineInvitation;
