import * as functions from "firebase-functions";
import * as vision from "@google-cloud/vision";

const ocrOnStorageUpload = functions.storage
  .object()
  .onFinalize(async (object) => {
    const { bucket, name } = object;
    const ocrClient = new vision.ImageAnnotatorClient();

    const [textDetections] = await ocrClient.textDetection(
      `gs://${bucket}/${name}`
    );
    const [annotation] = textDetections.textAnnotations ?? [];
    const text = annotation ? annotation.description : "";
    console.log(`Extracted text from image:`, text);
  });

export { ocrOnStorageUpload };
