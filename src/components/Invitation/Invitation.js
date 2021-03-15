import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
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
        </div>
      );

    case InvitationStatuses.READY:
      return (
        <React.Fragment>
          <div
            className={`invitationBody`}
            dangerouslySetInnerHTML={{__html: invitationText}}
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
          dangerouslySetInnerHTML={{__html: invitationText}}
        />
      );
    case InvitationStatuses.ERROR:
      return (
        <div>
          Network Error. Return
          <Link to={"/profile"}>Home</Link>
        </div>
      );

    case InvitationStatuses.ACCEPTED:
      return <h1>Invitation Accepted</h1>;

    case InvitationStatuses.REMOVED:
      return <h1>Invitation Removed</h1>;

    default:
      return <h1>Loading</h1>;
  }
};

const InvitationButtons = ({ onAcceptInvite, onDeclineInvite }) => (
  <div>
    <button onClick={onAcceptInvite}>Accept Invitation</button>
    <button onClick={onDeclineInvite}>Decline Invitation</button>
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
      const {
        body, acceptable
      } = await getInvitation({ invitationId, token });
      setInvitationText(body);
      setStatus(
        acceptable
          ? InvitationStatuses.READY
          : InvitationStatuses.ALREADY_ACCEPTED
      );
    } catch (err) {
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
