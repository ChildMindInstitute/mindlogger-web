import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import {
  loggedInSelector,
  userInfoSelector,
  authTokenSelector,
} from "../../state/user/user.selectors";
import { InvitationStatuses } from "../../constants";
import { InvitationText } from "./InvitationText";
import {
  getInvitation,
  acceptInvitation,
  declineInvitation,
} from "../../services/invitation.service";
import "./style.css";

const Invitation = () => {
  const [status, setStatus] = React.useState(InvitationStatuses.LOADING);
  const [invitationText, setInvitationText] = React.useState("");
  const isLoggedIn = useSelector(loggedInSelector);
  const user = useSelector(userInfoSelector);
  const token = useSelector(authTokenSelector);
  const { invitationId } = useParams();

  React.useEffect(() => {
    if (isLoggedIn) handleGetInvitation();
  }, [isLoggedIn]);

  const handleGetInvitation = async () => {
    setStatus(InvitationStatuses.LOADING);
    try {
      const { body, acceptable } = await getInvitation({ invitationId, token });
      setInvitationText(body);
      setStatus(
        acceptable
          ? InvitationStatuses.READY
          : InvitationStatuses.ALREADY_ACCEPTED
      );
    } catch (err) {
      console.log({ err });
      setStatus(InvitationStatuses.ERROR);
    }
  };

  const handleAcceptInvitation = async () => {
    setStatus(InvitationStatuses.LOADING);
    try {
      await acceptInvitation({ token, invitationId, email: user.email });
      setStatus(InvitationStatuses.ACCEPTED);
    } catch {
      setStatus(InvitationStatuses.ERROR);
    }
  };

  const handleRemoveInvitation = async () => {
    setStatus(InvitationStatuses.LOADING);
    try {
      await declineInvitation({ invitationId, token });
      setStatus(InvitationStatuses.REMOVED);
    } catch {
      setStatus(InvitationStatuses.ERROR);
    }
  };

  return (
    <div className="mt-3 pt-3 container">
      {isLoggedIn ? (
        <InvitationText
          status={status}
          invitationText={invitationText}
          onAcceptInvite={handleAcceptInvitation}
          onDeclineInvite={handleRemoveInvitation}
        />
      ) : (
        <div className="heading">
          Please <Link to={"/login"}>Login</Link> or{" "}
          <Link to={"/signup"}>Sign Up</Link> to View Invitation
        </div>
      )}
    </div>
  );
};

export default Invitation;
