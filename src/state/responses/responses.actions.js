import { createAsyncThunk } from "@reduxjs/toolkit";
import RESPONSES_CONSTANTS from './responses.constants';

export const startUploadQueue = createAsyncThunk(
  RESPONSES_CONSTANTS.UPLOAD_QUEUE,
  async () => {

    console.log('--- start uploading queue ---');
    // try {
    //   const response = await signInAPI(user)
    //   const privateKey = getPrivateKey({
    //     userId: response.user._id,
    //     email: user.email,
    //     password: user.password
    //   });

    //   return {
    //     ...response,
    //     user: { ...response.user, privateKey, email: user.email }
    //   }

    // } catch (error) {
    //   throw new Error(error);
    // }
});