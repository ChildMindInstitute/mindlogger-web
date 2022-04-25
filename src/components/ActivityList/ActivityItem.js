/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment';
import i18n from 'i18next';
import { Button, Image } from 'react-bootstrap';

import TimedActivity from './TimedActivity';

import { scheduledEndTime, convertDateString } from '../../util/time';
import './style.css'

const ActivityItem = (props) => {
  const { activity, disabled, onPress, isRecommended } = props;

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
    if (activity.text === '') {
      return <br />
    }
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
      {activity.image && 
        <div
          className="activity-image"
          style={{
            backgroundImage: `url(${activity.image})`
          }}
        />
      }
      {isRecommended ? 
        <img className="activity-recomended-image" src={'/recomended_badge.png'} /> : null
      }
      <div className="activity-data">
        <div className="activity-name-date">{activity.name.en} {dueDateStr ? ' - ' + dueDateStr : ''} </div>

        {
          activity.description && <div className="activity-description">{activity.description.en}</div>
        }
        <TimedActivity activity={activity} />
      </div>
    </Button>
  )
}
export default ActivityItem
