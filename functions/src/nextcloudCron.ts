import fetch from "node-fetch";

export default async () => {
  const response = await fetch("https://cloud.ivoberger.com/cron.php");
  console.info(response);
};
