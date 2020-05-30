import * as functions from "firebase-functions";
import nextcloudCron from "./nextcloudCron";

const nextcloudWebcron = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(nextcloudCron);

export { nextcloudWebcron };
