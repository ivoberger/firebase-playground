import * as functions from "firebase-functions";
import * as vision from "@google-cloud/vision";
import { countBy } from "lodash";

const priceRegex = /\d{1,3},\s*\d{2}[^.\d%]/g;
const stores = ["Alnatura", "dm", "Rewe", "Bormuth", "Unikat"];

const ocrOnStorageUpload = functions.storage
  .object()
  .onFinalize(async (object) => {
    const { bucket, name } = object;
    const ocrClient = new vision.ImageAnnotatorClient();

    const [textDetections] = await ocrClient.textDetection(
      `gs://${bucket}/${name}`
    );
    const text = replaceNewLines(
      textDetections.textAnnotations?.[0]?.description ?? ""
    );
    console.log(`Extracted text from image:`, text);
    const words = sortArrayByOccurrence(
      matchRegex(/[a-zA-Z]{2,}/g, text).filter(
        (match) => !commonWords.includes(match)
      )
    );
    console.log("Words", words.join(" ---- "));
    console.log(
      `Store: ${words.find(
        (entry) =>
          !!stores.find((store) => store.toLowerCase() === entry.toLowerCase())
      )}`
    );

    const priceCandidates = matchRegex(priceRegex, text)
      .map((price) => parseFloat(removeWhitespace(price).replace(",", ".")))
      .sort((a, b) => b - a);
    const priceCandidatesOccurrences = countBy(priceCandidates);

    for (let index = 0; index < priceCandidates.length; index++) {
      const element = priceCandidates[index];
      if (
        priceCandidatesOccurrences[element] > 1 ||
        index === priceCandidates.length - 1
      ) {
        console.log("Price", element);
        break;
      }
    }
  });

const sortArrayByOccurrence = <T>(arr: T[]) =>
  arr.sort(
    (a, b) =>
      arr.filter((v) => v === b).length - arr.filter((v) => v === a).length
  );

const replaceNewLines = (str?: string) =>
  str?.replace(/(\r\n|\n|\r)/gm, " **** ") ?? "";

const removeWhitespace = (str?: string) => str?.replace(/(\s+)/gm, "") ?? "";

const matchRegex = (pattern: RegExp, str?: string) => str?.match(pattern) ?? [];

export { ocrOnStorageUpload };
