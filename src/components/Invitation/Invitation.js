import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import {
  loggedInSelector,
  authTokenSelector,
} from "../../state/user/user.selectors";
import { InvitationStatuses } from "../../constants";
import {
  getInvitation,
  acceptInvitation,
  declineInvitation,
} from "../../services/network";
import "./style.css";

const InvitationText = ({
  status,
  invitationText,
  onAcceptInvite,
  onDeclineInvite,
}) => {
  switch (status) {
    case InvitationStatuses.LOADING:
      return (
        <div className="heading">
          <h1>Loading Invitation</h1>
          <Spinner animation="border" variant="primary" />
        </div>
      );

    case InvitationStatuses.READY:
      return (
        <React.Fragment>
          <div
            className={`heading`}
            dangerouslySetInnerHTML={{ __html: invitationText }}
          />
          <InvitationButtons
            onAcceptInvite={onAcceptInvite}
            onDeclineInvite={onDeclineInvite}
          />
        </React.Fragment>
      );

    case InvitationStatuses.ALREADY_ACCEPTED:
      return (
        <div
          className={`invitationBody alreadyAccepted`}
          dangerouslySetInnerHTML={{ __html: invitationText }}
        />
      );

    case InvitationStatuses.ERROR:
      return (
        <div className={"heading"}>
          Network Error. Return <Link to={"/profile"}>Home</Link>
        </div>
      );

    case InvitationStatuses.ACCEPTED:
      return (
        <div className={"heading"}>
          <h1>Invitation Accepted</h1>
        </div>
      );

    case InvitationStatuses.REMOVED:
      return (
        <div className={"heading"}>
          <h1>Invitation Removed</h1>
        </div>
      );

    default:
      return null;
  }
};

const InvitationButtons = ({ onAcceptInvite, onDeclineInvite }) => (
  <div
    className={"d-flex justify-content-center align-items-center"}
    style={{ height: "100vh" }}
  >
    <Button
      onClick={onAcceptInvite}
      variant="success"
      className={"mx-2"}
      size="lg"
    >
      Accept Invitation
    </Button>
    <Button
      onClick={onDeclineInvite}
      variant="danger"
      className={"mx-2"}
      size="lg"
    >
      Decline Invitation
    </Button>
  </div>
);

const Invitation = () => {
  const [status, setStatus] = React.useState(InvitationStatuses.LOADING);
  const [invitationText, setInvitationText] = React.useState("");
  const isLoggedIn = useSelector(loggedInSelector);
  const token = useSelector((state) => authTokenSelector(state));
  const { invitationId } = useParams();

  React.useEffect(() => {
    if (isLoggedIn) handleGetInvitation();
  }, [isLoggedIn]);

  const handleGetInvitation = async () => {
    setStatus(InvitationStatuses.LOADING);
    try {
      const { body, acceptable } = await getInvitation({ invitationId, token });
      console.log({ body });
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
      await acceptInvitation({ token, invitationId });
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
