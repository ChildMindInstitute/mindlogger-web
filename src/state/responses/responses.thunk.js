import { createAsyncThunk } from "@reduxjs/toolkit";
import RESPONSE_CONSTANTS from './response.constants';
import { authTokenSelector } from '../app/user.selectors';

export const completeResponse = createAsyncThunk(RESPONSE_CONSTANTS.GET_APPLETS, async (isTimeout, { dispatch, getState }) => {
  const state = getState();
  const authToken = authTokenSelector(state);
  const applet = currentAppletSelector(state);
  const inProgressResponse = currentResponsesSelector(state);
  const activity = currentActivitySelector(state);
  const event = currentEventSelector(state);

  if ((!applet.AESKey || !applet.userPublicKey) && config.encryptResponse) {
    dispatch(updateKeys(applet, userInfoSelector(state)));
  }

  const responseHistory = currentAppletResponsesSelector(state);

  if (activity.isPrize === true) {
    const selectedPrizeIndex = inProgressResponse["responses"][0];
    const version = inProgressResponse["activity"].schemaVersion['en'];
    const selectedPrize = activity.items[0].valueConstraints.itemList[selectedPrizeIndex];

    const updates = getTokenUpdateInfo(
      -selectedPrize.price,
      responseHistory,
      applet,
    );

    updateUserTokenBalance(
      authToken,
      applet.id.split('/').pop(),
      updates.offset,
      updates.cumulative,
      version,
      updates.userPublicKey || null
    ).then(() => {
      dispatch(downloadResponses())
    })
  } else {
    const preparedResponse = prepareResponseForUpload(inProgressResponse, applet, responseHistory, isTimeout);
    dispatch(addToUploadQueue(preparedResponse));
    dispatch(startUploadQueue());
  }

  if (event) {
    dispatch(setClosedEvent(event))
  }

  setTimeout(() => {
    const { activity } = inProgressResponse;
    // Allow some time to navigate back to ActivityList
    dispatch(
      removeResponseInProgress(activity.event ? activity.id + activity.event.id : activity.id)
    );
  }, 300);
})