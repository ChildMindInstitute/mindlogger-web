import * as R from "ramda";
import moment from 'moment';
import { Parse, Day } from 'dayspan';
import { getStartOfInterval } from '../util/time';

import {
  ALLOW,
  ABOUT,
  ABOUT_CONTENT,
  ALT_LABEL,
  AUDIO_OBJECT,
  AUTO_ADVANCE,
  BACK_DISABLED,
  CONTENT_URL,
  DELAY,
  DESCRIPTION,
  DO_NOT_KNOW,
  ENCODING_FORMAT,
  FULL_SCREEN,
  IMAGE,
  IMAGE_OBJECT,
  INPUT_TYPE,
  INPUTS,
  IS_ABOUT,
  ITEM_LIST_ELEMENT,
  MAX_VALUE,
  MEDIA,
  MIN_VALUE,
  MULTIPLE_CHOICE,
  MIN_VALUE_IMAGE,
  MAX_VALUE_IMAGE,
  SLIDER_LABEL,
  SCORING,
  ITEM_LIST,
  ITEM_OPTIONS,
  OPTIONS,
  SLIDER_OPTIONS,
  VALUE_TYPE,
  ENABLE_NEGATIVE_TOKENS,
  NAME,
  PREAMBLE,
  PREF_LABEL,
  QUESTION,
  REFUSE_TO_ANSWER,
  REQUIRED_VALUE,
  SCHEMA_VERSION,
  SCORING_LOGIC,
  SHUFFLE,
  ISPRIZE,
  TIMER,
  TRANSCRIPT,
  URL,
  VALUE,
  COLOR,
  PRICE,
  SCORE,
  ALERT,
  CORRECT_ANSWER,
  RESPONSE_OPTIONS,
  VARIABLE_NAME,
  JS_EXPRESSION,
  VERSION,
  IS_VIS,
  ADD_PROPERTIES,
  COMPUTE,
  SUBSCALES,
  FINAL_SUBSCALE,
  IS_AVERAGE_SCORE,
  MESSAGES,
  MESSAGE,
  LOOKUP_TABLE,
  AGE,
  WATERMARK,
  RAW_SCORE,
  SEX,
  T_SCORE,
  COLOR_PALETTE,
  OUTPUT_TEXT,
  OUTPUT_TYPE,
  RESPONSE_ALERT,
  RANDOMIZE_OPTIONS,
  CONTINOUS_SLIDER,
  TIME_DURATION,
  SHOW_TICK_MARKS,
  IS_OPTIONAL_TEXT,
  IS_OPTIONAL_TEXT_REQUIRED,
  RESPONSE_ALERT_MESSAGE,
  MIN_ALERT_VALUE,
  MAX_ALERT_VALUE,
  ORDER,
  HAS_RESPONSE_IDENTIFIER,
  IS_RESPONSE_IDENTIFIER,
} from '../constants';

export const languageListToObject = (list) => {
  if (
    typeof list === "undefined" ||
    typeof list === "string" ||
    list.length === 0
  ) {
    return undefined;
  }
  return list.reduce(
    (obj, item) => ({
      ...obj,
      [item["@language"]]: item["@value"],
    }),
    {}
  );
};

export const listToObject = (list = []) =>
  list.reduce(
    (obj, item) => ({
      ...obj,
      [item["@index"]]: item["@value"],
    }),
    {}
  );

export const listToVisObject = (list = []) =>
  list.reduce(
    (obj, item) => ({
      ...obj,
      [item[VARIABLE_NAME][0]["@value"]]: item[IS_VIS] ? item[IS_VIS][0]["@value"] : true,
    }),
    {}
  );

export const listToValue = (list = []) =>
  list.length > 0 ? list[0]["@value"] : undefined;

export const flattenIdList = (list = []) => list.map((item) => item["@id"]);

export const flattenItemList = (list = []) =>
  list.map((item) => ({
    name: languageListToObject(item[NAME]),
    value: R.path([VALUE, 0, "@value"], item),
    color: R.path([COLOR, 0, "@value"], item),
    price: R.path([PRICE, 0, "@value"], item),
    score: R.path([SCORE, 0, "@value"], item),
    alert: R.path([ALERT, 0, "@value"], item),
    description: R.path([DESCRIPTION, 0, "@value"], item),
    image: item[IMAGE],
    valueConstraints: item[RESPONSE_OPTIONS]
      ? flattenValueConstraints(R.path([RESPONSE_OPTIONS, 0], item))
      : undefined,
  }));

export const flattenValueConstraints = (vcObj) =>
  Object.keys(vcObj).reduce((accumulator, key) => {
    if (key === '@type') {
      return { ...accumulator, valueType: R.path([key, 0], vcObj) };
    }
    if (key === MAX_VALUE) {
      return { ...accumulator, maxValue: R.path([key, 0, "@value"], vcObj) };
    }
    if (key === TIME_DURATION) {
      return { ...accumulator, timeDuration: R.path([key, 0, "@value"], vcObj) };
    }
    if (key === MIN_VALUE) {
      return { ...accumulator, minValue: R.path([key, 0, "@value"], vcObj) };
    }
    if (key === MULTIPLE_CHOICE) {
      return {
        ...accumulator,
        multipleChoice: R.path([key, 0, "@value"], vcObj),
      };
    }

    if (key == IS_RESPONSE_IDENTIFIER) {
      return {
        ...accumulator,
        isResponseIdentifier: R.path([key, 0, "@value"], vcObj),
      };
    }

    if (key === IS_OPTIONAL_TEXT_REQUIRED) {
      return {
        ...accumulator,
        isOptionalTextRequired: R.path([key, 0, "@value"], vcObj),
      };
    }
    if (key === SCORING) {
      return {
        ...accumulator,
        scoring: R.path([key, 0, "@value"], vcObj),
      };
    }
    if (key === SHOW_TICK_MARKS) {
      return {
        ...accumulator,
        showTickMarks: R.path([key, 0, "@value"], vcObj),
      }

    }

    /*  if (key === IS_OPTIONAL_TEXT) {
        return {
          ...accumulator,
          isOptionalText: R.path([key, 0, "@value"], vcObj),
        }
      }*/

    if (key === RESPONSE_ALERT) {
      return {
        ...accumulator,
        responseAlert: R.path([key, 0, "@value"], vcObj),
      }
    }

    if (key === RANDOMIZE_OPTIONS) {
      return {
        ...accumulator,
        randomizeOptions: R.path([key, 0, "@value"], vcObj)
      }
    }

    if (key === COLOR_PALETTE) {
      return {
        ...accumulator,
        colorPalette: R.path([key, 0, "@value"], vcObj)
      }
    }

    if (key === CONTINOUS_SLIDER) {
      return {
        ...accumulator,
        continuousSlider: R.path([key, 0, "@value"], vcObj),
      }
    }
    if (key === RESPONSE_ALERT_MESSAGE) {
      return {
        ...accumulator,
        responseAlertMessage: R.path([key, 0, "@value"], vcObj),
      }
    }
    if (key === MIN_ALERT_VALUE) {
      return {
        ...accumulator,
        minAlertValue: R.path([key, 0, "@value"], vcObj)
      }
    }
    if (key === MAX_ALERT_VALUE) {
      return {
        ...accumulator,
        maxAlertValue: R.path([key, 0, "@value"], vcObj)
      }
    }
    if (key === VALUE_TYPE) {
      return {
        ...accumulator,
        valueType: R.path([key, 0, "@id"], vcObj),
      };
    }
    if (key === ENABLE_NEGATIVE_TOKENS) {
      return {
        ...accumulator,
        enableNegativeTokens: R.path([key, 0, "@value"], vcObj),
      };
    }
    if (key === ITEM_LIST_ELEMENT) {
      const itemList = R.path([key], vcObj);
      return { ...accumulator, itemList: flattenItemList(itemList) };
    }
    if (key === ITEM_LIST) {
      const itemList = R.path([key], vcObj);
      return {
        ...accumulator, itemList: itemList.map(item => ({
          description: R.path([DESCRIPTION, 0, "@value"], item),
          image: item[IMAGE],
          name: languageListToObject(item[NAME])
        }))
      };
    }

    if (key === ITEM_OPTIONS) {
      const itemOptions = R.path([key], vcObj);
      return {
        ...accumulator, itemOptions: itemOptions.map(option => ({
          score: R.path([SCORE, 0, "@value"], option),
          value: R.path([VALUE, 0, "@value"], option),
          alert: R.path([ALERT, 0, "@value"], option)
        }))
      };
    }

    if (key === OPTIONS) {
      const options = R.path([key], vcObj);
      return {
        ...accumulator, options: options.map(option => ({
          description: R.path([DESCRIPTION, 0, "@value"], option),
          image: option[IMAGE],
          name: languageListToObject(option[NAME])
        }))
      }
    }

    if (key === SLIDER_OPTIONS) {
      const sliderOptions = R.path([SLIDER_OPTIONS], vcObj);

      return {
        ...accumulator, sliderOptions: sliderOptions.map(option => ({
          minValue: R.path([MIN_VALUE, 0, "@value"], option),
          maxValue: R.path([MAX_VALUE, 0, "@value"], option),
          minValueImg: R.path([MIN_VALUE_IMAGE, 0, "@value"], option),
          maxValueImg: R.path([MAX_VALUE_IMAGE, 0, "@value"], option),
          sliderLabel: R.path([SLIDER_LABEL, 0, "@value"], option),
          itemList: flattenItemList(R.path([ITEM_LIST_ELEMENT], option))
        }))
      }
    }

    if (key === REQUIRED_VALUE) {
      return { ...accumulator, required: R.path([key, 0, "@value"], vcObj) };
    }
    if (key === IMAGE) {
      return { ...accumulator, image: vcObj[key] };
    }
    return accumulator;
  }, {});

export const transformInputs = (inputs) =>
  inputs.reduce((accumulator, inputObj) => {
    const key = R.path([NAME, 0, "@value"], inputObj);
    let val = R.path([VALUE, 0, "@value"], inputObj);

    if (typeof val === "undefined" && inputObj[ITEM_LIST_ELEMENT]) {
      const itemList = R.path([ITEM_LIST_ELEMENT], inputObj);
      val = flattenItemList(itemList);
    }

    if ((inputObj["@type"] || []).includes(AUDIO_OBJECT)) {
      val = {
        contentUrl: languageListToObject(inputObj[CONTENT_URL]),
        transcript: languageListToObject(inputObj[TRANSCRIPT]),
      };
    }

    if ((inputObj["@type"] || []).includes(IMAGE_OBJECT)) {
      val = {
        contentUrl: languageListToObject(inputObj[CONTENT_URL]),
      };
    }

    return {
      ...accumulator,
      [key]: val,
    };
  }, {});

export const transformVariableMap = (variableAr) =>
  variableAr.reduce((accumulator, item) => {
    const val = R.path([VARIABLE_NAME, 0, "@value"], item);
    const key = R.path([IS_ABOUT, 0, "@id"], item);
    return {
      ...accumulator,
      [key]: val,
    };
  }, {});

export const flattenLookupTable = (lookupTable, isFinalSubScale) => {
  if (!Array.isArray(lookupTable)) {
    return undefined;
  }

  let references = {
    [RAW_SCORE]: 'rawScore',
    [OUTPUT_TEXT]: 'outputText'
  };

  if (!isFinalSubScale) {
    Object.assign(references, {
      [AGE]: 'age',
      [SEX]: 'sex',
      [T_SCORE]: 'tScore'
    });
  }

  return R.map(row => Object.keys(references).reduce((previousValue, key) => {
    return {
      ...previousValue,
      [references[key]]: R.path([key, 0, "@value"], row)
    }
  }, {}), lookupTable)
}

export const transformMedia = (mediaObj) => {
  if (typeof mediaObj === "undefined") {
    return undefined;
  }

  const keys = Object.keys(mediaObj);
  return keys.map((key) => {
    const media = mediaObj[key];
    return {
      contentUrl: R.path([0, CONTENT_URL, 0, "@value"], media),
      transcript: R.path([0, TRANSCRIPT, 0, "@value"], media),
      encodingType: R.path([0, ENCODING_FORMAT, 0, "@value"], media),
      name: R.path([0, NAME, 0, "@value"], media),
    };
  });
};

export const isSkippable = (allowList) => {
  if (allowList.includes(REFUSE_TO_ANSWER)) {
    return true;
  }
  if (allowList.includes(DO_NOT_KNOW)) {
    return true;
  }
  return false;
};

export const itemAttachExtras = (
  transformedItem,
  schemaUri,
  addProperties = {},
) => ({
  ...transformedItem,
  schema: schemaUri,
  variableName: R.path([0, "@value"], addProperties[VARIABLE_NAME]),
  visibility: R.path([0, "@value"], addProperties[IS_VIS]),
});

const SHORT_PREAMBLE_LENGTH = 90;

export const attachPreamble = (preamble, items) => {
  const text = preamble ? preamble.en : "";
  if (text && text.length > SHORT_PREAMBLE_LENGTH) {
    return R.prepend(
      {
        inputType: "markdownMessage",
        preamble,
      },
      items
    );
  }
  if (text && items.length > 0) {
    return R.assocPath([0, "preamble"], preamble, items);
  }
  return items;
};

const transformPureActivity = (activityJson) => {
  const allowList = flattenIdList(
    R.pathOr([], [ALLOW, 0, "@list"], activityJson)
  );
  const scoringLogic = activityJson[SCORING_LOGIC]; // TO DO
  const addProperties = activityJson[ADD_PROPERTIES];
  const preamble = languageListToObject(activityJson[PREAMBLE]);
  const order = (activityJson[ORDER] && flattenIdList(activityJson[ORDER][0]["@list"])) || [];
  const notification = {}; // TO DO
  const info = languageListToObject(activityJson.info); // TO DO
  const compute = activityJson[COMPUTE] && R.map((item) => {
    return {
      jsExpression: R.path([JS_EXPRESSION, 0, "@value"], item),
      variableName: R.path([VARIABLE_NAME, 0, "@value"], item)
    }
  }, activityJson[COMPUTE]);
  const subScales = activityJson[SUBSCALES] && R.map((subScale) => {
    const jsExpression = R.path([JS_EXPRESSION, 0, "@value"], subScale);

    return {
      jsExpression,
      variableName: R.path([VARIABLE_NAME, 0, "@value"], subScale),
      lookupTable: flattenLookupTable(subScale[LOOKUP_TABLE], false),
      innerSubScales: jsExpression.split('+').filter(name => name.includes('(')).map(name => name.trim().replace(/[()]/g, ''))
    }
  }, activityJson[SUBSCALES])

  const finalSubScale = activityJson[FINAL_SUBSCALE] && {
    isAverageScore: R.path([FINAL_SUBSCALE, 0, IS_AVERAGE_SCORE, 0, "@value"], activityJson),
    variableName: R.path([FINAL_SUBSCALE, 0, VARIABLE_NAME, 0, "@value"], activityJson),
    lookupTable: flattenLookupTable(R.path([FINAL_SUBSCALE, 0, LOOKUP_TABLE], activityJson), true),
  }

  const messages = activityJson[MESSAGES] && R.map((item) => {
    return {
      message: R.path([MESSAGE, 0, "@value"], item),
      jsExpression: R.path([JS_EXPRESSION, 0, "@value"], item),
      outputType: R.path([OUTPUT_TYPE, 0, "@value"], item),
    }
  }, activityJson[MESSAGES]);

  return {
    id: activityJson._id,
    name: languageListToObject(activityJson[PREF_LABEL]),
    description: languageListToObject(activityJson[DESCRIPTION]),
    schemaVersion: languageListToObject(activityJson[SCHEMA_VERSION]),
    version: languageListToObject(activityJson[VERSION]),
    altLabel: languageListToObject(activityJson[ALT_LABEL]),
    shuffle: R.path([SHUFFLE, 0, "@value"], activityJson),
    image: languageListToObject(activityJson[IMAGE]),
    skippable: isSkippable(allowList),
    backDisabled: allowList.includes(BACK_DISABLED),
    fullScreen: allowList.includes(FULL_SCREEN),
    autoAdvance: allowList.includes(AUTO_ADVANCE),
    isPrize: R.path([ISPRIZE, 0, "@value"], activityJson) || false,
    hasResponseIdentifier: R.path([HAS_RESPONSE_IDENTIFIER, 0, "@value"], activityJson) || false,
    compute,
    subScales,
    finalSubScale,
    messages,
    preamble,
    addProperties,
    order,
    scoringLogic,
    notification,
    info,
  };
};

export const itemTransformJson = (itemJson) => {
  // For items, 'skippable' is undefined if there's no ALLOW prop
  const allowList = flattenIdList(R.path([ALLOW, 0, "@list"], itemJson)) || [];
  const skippable = isSkippable(allowList) ? true : undefined;

  const valueConstraintsObj = R.pathOr({}, [RESPONSE_OPTIONS, 0], itemJson);
  const valueConstraints = flattenValueConstraints(valueConstraintsObj);

  const inputs = R.pathOr([], [INPUTS], itemJson);
  const inputsObj = transformInputs(inputs);

  const media = transformMedia(R.path([MEDIA, 0], itemJson));
  valueConstraints.isOptionalText = listToValue(itemJson[IS_OPTIONAL_TEXT]);

  const res = {
    id: itemJson._id,
    description: languageListToObject(itemJson[DESCRIPTION]),
    correctAnswer: languageListToObject(itemJson[CORRECT_ANSWER]),
    schemaVersion: languageListToObject(itemJson[SCHEMA_VERSION]),
    version: languageListToObject(itemJson[VERSION]),
    altLabel: languageListToObject(itemJson[ALT_LABEL]),
    inputType: listToValue(itemJson[INPUT_TYPE]),
    isOptionalText: listToValue(itemJson[IS_OPTIONAL_TEXT]),
    question: languageListToObject(itemJson[QUESTION]),
    preamble: languageListToObject(itemJson[PREAMBLE]),
    timer: R.path([TIMER, 0, "@value"], itemJson),
    delay: R.path([DELAY, 0, "@value"], itemJson),
    valueConstraints,
    skippable,
    fullScreen: allowList.includes(FULL_SCREEN),
    backDisabled: allowList.includes(BACK_DISABLED),
    autoAdvance: allowList.includes(AUTO_ADVANCE),
    inputs: inputsObj,
    media,
  };

  if (res.inputType === 'markdown-message') {
    res.inputType = 'markdownMessage';
  }
  return res;
};

export const appletTransformJson = (appletJson) => {
  const { applet, schedule, updated } = appletJson;
  const res = {
    id: applet._id,
    groupId: applet.groups,
    schema: applet.url || applet[URL],
    name: languageListToObject(applet[PREF_LABEL]),
    description: languageListToObject(applet[DESCRIPTION]),
    about: languageListToObject(applet[ABOUT]),
    aboutContent: languageListToObject(applet[ABOUT_CONTENT]),
    schemaVersion: languageListToObject(applet[SCHEMA_VERSION]),
    version: languageListToObject(applet[VERSION]),
    altLabel: languageListToObject(applet[ALT_LABEL]),
    visibility: listToVisObject(applet[ADD_PROPERTIES]),
    image: applet[IMAGE],
    watermark: R.path([WATERMARK, 0, "@id"], applet),
    order: flattenIdList(applet[ORDER][0]["@list"]),
    schedule,
    contentUpdateTime: updated,
    responseDates: applet.responseDates,
    shuffle: R.path([SHUFFLE, 0, "@value"], applet),
  };
  if (applet.encryption && Object.keys(applet.encryption).length) {
    res.encryption = applet.encryption;
  }
  return res;
};

export const activityTransformJson = (activityJson, itemsJson) => {
  const activity = transformPureActivity(activityJson);
  let itemIndex = -1, itemData;

  const mapItems = R.map((itemKey) => {
    itemIndex += 1;
    itemData = itemsJson[itemKey];

    if (!itemData) {
      console.warn(
        `Item ID "${itemKey}" defined in 'reprolib:terms/order' was not found`
      );
      return null;
    }
    const item = itemTransformJson(itemsJson[itemKey]);
    return itemAttachExtras(item, itemKey, activity.addProperties[itemIndex]);
  });
  const nonEmptyItems = R.filter(item => item, mapItems(activity.order));
  const items = attachPreamble(activity.preamble, nonEmptyItems);

  return {
    ...activity,
    items,
  };
};

export const transformApplet = (payload, currentApplets = null) => {
  const applet = appletTransformJson(payload);

  if (currentApplets && !R.isEmpty(currentApplets)) {
    const currentApplet = currentApplets.find(({ id }) => id.substring(7) === payload.id);

    if (!currentApplet) {
      const activities = Object.keys(payload.activities).map((key) => {
        const activity = activityTransformJson(
          payload.activities[key],
          payload.items,
        );
        activity.schema = key;
        return activity;
      });
      // Add the items and activities to the applet object
      applet.schedule = payload.schedule;
      applet.activities = [...activities];
    } else {
      if (R.isEmpty(payload.activities)) {
        if (R.isEmpty(payload.items)) {
          applet.activities = [...currentApplet.activities];
        } else {
          Object.keys(payload.items).forEach(dataKey => {
            const keys = dataKey.split('/');
            applet.activities.forEach((act, index) => {
              if (act.id.substring(9) === keys[0]) {
                act.items.forEach((itemData, i) => {
                  if (itemData.id === payload.items[dataKey]) {
                    const item = itemAttachExtras(itemTransformJson(payload.items[dataKey]), dataKey);
                    item.variableName = payload.items[dataKey]['@id'];

                    applet.activities[index].items[i] = {
                      ...itemData,
                      ...item,
                    }
                  }
                })
              }
            });
          });
        }
      } else {
        applet.activities = [...currentApplet.activities];
        Object.keys(payload.activities).forEach((key) => {
          const activity = transformPureActivity(payload.activities[key]);

          let updated = false;
          applet.activities.forEach((act, index) => {
            if (act.id.substring(9) === key) {
              updated = true;
              applet.activities[index] = {
                ...activity,
                items: [...act.items],
              };
            }
          });
          if (!updated) {
            applet.activities.push(activity);
          }
        });
        if (!R.isEmpty(payload.items)) {
          Object.keys(payload.items).forEach(dataKey => {
            const keys = dataKey.split('/');

            applet.activities.forEach((act, index) => {
              if (act.id.substring(9) === keys[0]) {
                const item = itemAttachExtras(itemTransformJson(payload.items[dataKey]), dataKey);
                item.variableName = payload.items[dataKey]['@id'];

                let updated = false;

                if (!act.items) {
                  applet.activities[index].items = [];
                }

                act.items.forEach((itemData, i) => {
                  if (itemData.id.split('/')[1] === dataKey.split('/')[1] && !updated) {
                    updated = true;
                    applet.activities[index].items[i] = {
                      ...itemData,
                      ...item,
                    }
                  }
                });
                if (!updated) {
                  applet.activities[index].items.push(item);
                }
              }
            });
          });
        }
      }

      if (payload.schedule) {
        const events = { ...(currentApplet.schedule?.events || {}) };
        applet.schedule = payload.schedule;

        if (!R.isEmpty(payload.schedule.events)) {
          Object.keys(payload.schedule.events).forEach(eventId => {
            events[eventId] = payload.schedule.events[eventId];
          })
        }

        if (currentApplet.schedule) {
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
        }
        applet.schedule.events = events;
      }
    }

    if (payload.removedItems && payload.removedItems.length) {
      payload.removedItems.forEach(itemKey => {
        const keys = itemKey.split('/');

        applet.activities.forEach((activity, index) => {
          if (activity.id.substring(9) === keys[0]) {
            activity.items.forEach((item, i) => {
              if (item.id.substring(7) === keys[1]) {
                applet.activities[index].items.splice(i, 1);
              }
            })
          }
        })
      })
    }

    if (payload.removedActivities && payload.removedActivities.length) {
      payload.removedActivities.forEach(activityKey => {
        applet.activities.forEach((activity, index) => {
          if (activity.id.substring(9) === activityKey) {
            applet.activities.splice(index, 1);
          }
        })
      })
    }
  } else {
    const activities = Object.keys(payload.activities).map((key) => {
      const activity = activityTransformJson(
        payload.activities[key],
        payload.items,
      );
      activity.schema = key;
      return activity;
    });
    // Add the items and activities to the applet object
    applet.activities = activities;
    applet.schedule = payload.schedule;
  }

  applet.groupId = payload.groups;
  return applet;
};

const getActivityAbility = (schedule, activityId) => {
  let availability = false;

  schedule && Object.keys(schedule.events).forEach(key => {
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

    if (applet.schedule) {
      for (let eventId in applet.schedule.events) {
        const event = { ...applet.schedule.events[eventId] };
        const futureSchedule = Parse.schedule(event.schedule).forecast(
          Day.fromDate(new Date()),
          true,
          1,
          0,
          true,
        );

        event.scheduledTime = getStartOfInterval(futureSchedule.array()[0]);
        if (event.data.activity_id === act.id.substring(9) && !act.hasResponseIdentifier) {
          events.push(event);
        }
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