const admin = require("firebase-admin");

if (!admin.apps.length) {
  // FIREBASE_ADMIN_CONFIG を Base64 でエンコードして環境変数に入れている前提
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_ADMIN_CONFIG, "base64").toString("utf-8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

exports.handler = async (event) => {
  try {
    const uid = (event.queryStringParameters && event.queryStringParameters.uid) || "test-user";

    // カスタムトークン生成
    const customToken = await admin.auth().createCustomToken(uid);

    return {
      statusCode: 200,
      body: JSON.stringify({ customToken }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
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