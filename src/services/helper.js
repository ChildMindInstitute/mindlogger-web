import moment from 'moment';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const btoa = (input = '') => {
  const str = input;
  let output = '';

  for (let block = 0, charCode, i = 0, map = chars; str.charAt(i | 0) || (map = '=', i % 1); output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
    charCode = str.charCodeAt(i += 3 / 4);

    if (charCode > 0xFF) {
      throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
    }

    block = block << 8 | charCode;
  }

  return output;
};

export const atob = (input = '') => {
  const str = input.replace(/=+$/, '');
  let output = '';

  if (str.length % 4 === 1) {
    throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i += 1);

    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
    bc += 1 % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }

  return output;
};

export const parseMarkdown = (markdown, lastResponseTime=0) => {
  if (!lastResponseTime) {
    return markdown.replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2');
  }

  const now = new Date();
  const responseTime = moment.utc(lastResponseTime).toDate();

  const formatElapsedTime = (timeElapsed) => {
    const totalMinutes = Math.floor(timeElapsed / 1000 / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    let str = '';
    if (hours > 0) {
      str = hours == 1 ? `an hour` : `${hours} hours`;
    }

    if (minutes > 0) {
      if (str.length) {
        str += ' and ';
      }

      str += minutes == 1 ? 'one minute' : `${minutes} minutes`;
    }

    if (!str.length) {
      return 'just now'
    }
    return str;
  };

  const formatLastResponseTime = (responseTime, now) => {
    if (responseTime.isSame(now, 'day')) {
      return responseTime.format('hh:mm A') + ' today';
    } else if (responseTime.add(1, 'days').isSame(now, 'day')) {
      return responseTime.format('hh:mm A') + ' yesterday';
    }

    return responseTime.format('hh:mm A');
  }

  return markdown
          .replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2')
          .replace(/\[Now\]/i, moment(now).format('hh:mm A') + ' today')
          .replace(/\[Time_Elapsed_Activity_Last_Completed\]/i, formatElapsedTime(now.getTime() - responseTime.getTime()))
          .replace(/\[Time_Activity_Last_Completed\]/i, formatLastResponseTime(moment(responseTime), moment(now)));
}