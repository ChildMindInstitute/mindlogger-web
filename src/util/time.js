import * as R from 'ramda';
import moment from 'moment';

export const getStartOfInterval = R.pathOr(null, [0, 'start', 'date']);

export const scheduledEndTime = (timestamp, timeout) => {
  const time = moment(timestamp);

  if (timeout === 86340000) {
    if (moment().isSame(time, 'day')) {
      return time.set({ hour: 23, minute: 59 }).format('h:mm A');
    }
    return null;
  }
  if (moment().isSame(time, 'day')) {
    return time.add(timeout, 'milliseconds').format('h:mm A');
  }
  return null;
};

export const convertDateString = (str) => {
  if (str == '12:00 PM') {
    return 'Noon';
  }
  if (str == '11:59 PM') {
    return 'Midnight';
  }

  return str;
}
