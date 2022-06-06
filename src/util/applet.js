import * as R from "ramda";

export const getLocalInfo = (currentApplets, currentResponses) => {
  let localInfo = {};

  if (currentApplets) {
    currentApplets.forEach(applet => {
      const { contentUpdateTime, id } = applet;
      const response = currentResponses ? currentResponses.find(r => id === r.appletId) : null;
      const localEvents = applet.schedule ? Object.keys(applet.schedule.events).map(id => {
        const event = applet.schedule.events[id];
        return {
          id,
          updated: event.updated,
        };
      }) : [];

      localInfo[id.split("/").pop()] = {
        appletVersion: applet.schemaVersion.en,
        contentUpdateTime,
        localItems: response && response.items ? Object.keys(response.items) : [],
        localActivities: response && response.activities ? Object.keys(response.activities) : [],
        localResponses: response && response.dataSources ? Object.keys(response.dataSources) : [],
        localEvents,
        startDate: new Date().toISOString().slice(0, -5) // we don't need to display responses on web
      }
    })
  } else {
    localInfo = {};
  }

  return localInfo;
}

export const modifyApplet = (appletInfo, currentApplets) => {
  const currentApplet = {
    ...currentApplets.find(({ id }) => {
      return id.split("/").pop() === appletInfo.id
    })
  };

  if (appletInfo.schedule) {
    const events = { ...currentApplet.schedule.events };
    currentApplet.schedule = appletInfo.schedule;

    if (!R.isEmpty(appletInfo.schedule.events)) {
      Object.keys(appletInfo.schedule.events).forEach(eventId => {
        events[eventId] = appletInfo.schedule.events[eventId];
        // scheduleUpdated = true;
      })
    }

    for (const eventId in events) {
      let isValid = false;
      for (const eventDate in currentApplet.schedule.data) {
        if (currentApplet.schedule.data[eventDate].find(({ id }) => id === eventId)) {
          isValid = true;
        }
      }

      if (!isValid) {
        delete events[eventId];
      }
    }
    currentApplet.schedule.events = events;
  }

  return currentApplet;
}