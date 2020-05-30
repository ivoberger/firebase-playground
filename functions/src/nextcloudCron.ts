import * as functions from "firebase-functions";
import fetch from "node-fetch";

const nextcloudWebcron = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const response = await fetch("https://cloud.ivoberger.com/cron.php");
    console.info(response);
  });
export default nextcloudWebcron;
