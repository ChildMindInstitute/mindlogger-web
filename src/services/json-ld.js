import * as R from "ramda";
import moment from 'moment';
import { Parse, Day } from 'dayspan';
import {
  getStartOfInterval,
} from './time';

const getActivityAbility = (schedule, activityId) => {
  let availability = false;

  Object.keys(schedule.events).forEach(key => {
    const e = schedule.events[key];

    if (e.data.activity_id === activityId.substring(9)) {
      availability = e.data.availability;
    }
  });

  return availability;
}

export const parseAppletEvents = (applet) => {
  const extraInfoActivities = applet.activities.map((act) => {
    const events = [];
    const availability = getActivityAbility(applet.schedule, act.id);

    for (let eventId in applet.schedule.events) {
      const event = applet.schedule.events[eventId];
      const futureSchedule = Parse.schedule(event.schedule).forecast(
        Day.fromDate(new Date()),
        true,
        1,
        0,
        true,
      );

      event.scheduledTime = getStartOfInterval(futureSchedule.array()[0]);

      if (event.data.activity_id === act.id.substring(9)) {
        events.push(event);
      }
    }

    return {
      ...act,
      appletId: applet.id,
      availability,
      events
    }
  });

  return {
    ...applet,
    activities: extraInfoActivities,
  };
}