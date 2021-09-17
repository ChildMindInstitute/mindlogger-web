import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'

import { startedTimesSelector } from '../../state/app/app.selectors';
// import { endActivity } from '../../state/responses/responses.thunks';

const TimedActivity = ({ activity }) => {
  const startedTimes = useSelector(startedTimesSelector);
  const { event } = activity;
  const { t } = useTranslation();

  if (activity.status === 'scheduled' && event && event.data.timedActivity.allow) {
    let { hour, minute, allow } = event.data.timedActivity;

    return (
      <small>
        {allow ? `${t('timed_activity.time_to_complete')}: ${hour} ${t('timed_activity.hours')} and ${minute} minutes ` : ``}
      </small>
    );
  }
  if (activity.status === 'pastdue' && event && event.data.timedActivity.allow) {
    let { hour, minute, allow } = event.data.timedActivity;

    return (
      <small>
        {allow ? `${t('timed_activity.time_to_complete')}: ${hour} ${t('timed_activity.hours')} and ${minute} minutes ` : ``}
      </small>
    );
  }
  if (activity.status === 'in-progress' && event && event.data.timedActivity.allow) {
    let { hour, minute, second, allow } = event.data.timedActivity;
    const startedTime = startedTimes ? startedTimes[activity.id + event.id] : null;

    if (startedTime && allow) {
      const activityTime = hour * (60000 * 60) + minute * 60000 + second * 1000;
      const difference = Math.abs(Date.now() - startedTime);

      if (activityTime > difference) {
        hour = Math.floor((activityTime - difference) / 60000 / 60);
        minute = Math.floor(((activityTime - difference) % (60000 * 60)) / 60000);
      } else {
        hour = null;

        // if (Actions.currentScene == 'applet_details') {
        //   dispatch(endActivity(activity));
        // }
      }
    } else {
      hour = null;
    }

    return (
      <small>
        {(!startedTime || hour !== null) ? `${t('timed_activity.time_to_complete')}: ${hour} ${t('timed_activity.hours')} and ${minute} minutes` : ``}
      </small>
    )
  }
  return null;
};

TimedActivity.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default TimedActivity;

