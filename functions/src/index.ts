import * as functions from "firebase-functions";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const onScraperComplete = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

// https://2ab4-2607-fea8-1e5f-81e0-7164-cb17-dd02-332e.ngrok.io/brightdata-scraper-15532/us-central1/onScraperComplete