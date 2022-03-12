import * as functions from "firebase-functions";
import axios from "axios";

const nextcloudWebcron = functions
  .region("europe-west3")
  .runWith({ memory: "128MB" })
  .pubsub.schedule("every 5 minutes")
  .onRun(async () => {
    const response = await axios.get("https://cloud.ivoberger.com/cron.php");
    console.info(response.status, response.data);
  });
export default nextcloudWebcron;
