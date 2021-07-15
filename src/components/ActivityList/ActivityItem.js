/* eslint-disable react/prop-types */
import React from 'react'
import { Button } from 'react-bootstrap'
import moment from 'moment';

import { scheduledEndTime, convertDateString } from '../../util/time';
import './style.css'

const ActivityItem = (props) => {
  const { activity, onPress } = props;

  const isActivityDisabled = () => {
    return activity.status === 'scheduled' && !activity.event.data.timeout.access;
  }

  const activityDueDate = () => {
    if (activity.status === 'scheduled' && activity.event) {
      return !activity.event.data.timeout.allow
        ? ` Scheduled At ${convertDateString(moment(activity.event.scheduledTime).format('hh:mm a'))}`
        : ` Available between ${convertDateString(moment(activity.event.scheduledTime).format('hh:mm A'))} to
        ${convertDateString(scheduledEndTime(activity.event.scheduledTime, activity.event.data.timeout))}`;
    }

    if (activity.status === 'pastdue') {
      return activity.event.data.timeout.allow
        ? ` To ${convertDateString(scheduledEndTime(activity.event.scheduledTime, activity.event.data.timeout))}`
        : ` To Midnight`;
    }

    return null;
  }

  if (activity.isHeader) {
    return (
      <p className="ds-activity-status">{activity.text}</p>
    )
  }

  return (
    <Button
      className="ds-shadow ds-activity-button"
      variant="link"
      onClick={() => onPress(activity)}
      disabled={isActivityDisabled()}
      block
    >
      {activity.name.en}
      {activityDueDate()}
    </Button>
  )
}
export default ActivityItem
