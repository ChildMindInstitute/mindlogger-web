/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';

import TimedActivity from './TimedActivity';

import { scheduledEndTime, convertDateString } from '../../util/time';
import './style.css'

const ActivityItem = (props) => {
  const { activity, disabled, onPress } = props;

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

  const dueDateStr = activityDueDate();
  return (
    <Button
      className="ds-shadow ds-activity-button"
      variant="link"
      onClick={() => onPress(activity)}
      disabled={disabled}
      block
    >
      <div className="activity-name-date">{activity.name.en} {dueDateStr ? ' - ' + dueDateStr : ''} </div>

      {
        activity.description && <div className="activity-description">{activity.description.en}</div>
      }
      <TimedActivity activity={activity} />
    </Button>
  )
}
export default ActivityItem
