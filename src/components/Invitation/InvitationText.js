import React from "react";
import { InvitationStatuses } from "../../constants";
import { Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom"
import "./style.css";

export const InvitationText = ({
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
            className={`invitationBody`}
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
          <h1 className={"invitationMessage"}>{invitationText ? invitationText : "Invitation Accepted"}</h1>
        </div>
      );

    case InvitationStatuses.DECLINED:
      return (
        <div className={"heading"}>
          <h1 className={"invitationMessage"}>{invitationText}</h1>
        </div>
      );
    case InvitationStatuses.REMOVED:
      return (
        <div className={"heading"}>
          <h1 className={"invitationMessage"}>Invitation Removed</h1>
        </div>
      );

    default:
      return null;
  }
};

const InvitationButtons = ({ onAcceptInvite, onDeclineInvite }) => (
  <div
    className={"d-flex justify-content-center align-items-center"}
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
