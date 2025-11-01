const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

exports.handler = async (event) => {
  try {
    const uid = (event.queryStringParameters && event.queryStringParameters.uid) || "test-user";
    const customToken = await admin.auth().createCustomToken(uid);

    return {
      statusCode: 200,
      body: JSON.stringify({ customToken }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // GitHub Pages から呼べるように
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};