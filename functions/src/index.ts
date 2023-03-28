import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { adminDb } from "./firebaseAdmin";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const fetchResults: any = async (id: string) => {
    const api_key = process.env.BRIGHTDATA_API_KEY
    const res = await fetch(`https://api.brightdata.com/dca/dataset?id=${id}`, {
        method: 'GET',
        headers: {
            Authrization: `Bearer ${api_key}`
        }
    })
    const data = await res.json()

    if (data.status === "building" || data.status === "collecting") {
        console.log("Not Completed yet, Trying again");
        return fetchResults(id)
    }
    return data
}

export const onScraperComplete = functions.https.onRequest(async (request, response) => {
    console.log("SCRAPE COMPLETE >>> : ", request.body);

    const { success, id } = request.body

    if (!success) {
        await adminDb.collection('searches').doc(id).set({
            status: 'error',
            updateAt: admin.firestore.Timestamp.now()
        })
    }

    const data = await fetchResults(id)

    await adminDb.collection('searches').doc(id).set({
        status: "complete",
        updateAt: admin.firestore.Timestamp.now(),
        results: data
    }, {
        merge: true
    })

    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Scraping Finished!")
})
// https://2ab4-2607-fea8-1e5f-81e0-7164-cb17-dd02-332e.ngrok.io/brightdata-scraper-15532/us-central1/onScraperComplete