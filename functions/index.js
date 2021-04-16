const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest(async (request, response) => {
  // CORS用にAccess-Control-Allow系ヘッダを追加
  response.set('Access-Control-Allow-Origin', 'http://localhost:5000'); // localhostを許可
  response.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST'); // DELETEだけは拒否
  response.set('Access-Control-Allow-Headers', 'Content-Type'); // Content-Typeのみを許可

  functions.logger.info('Hello logs!', { structuredData: true });

  if (request.method !== 'POST') {
    response.json({
      message: 'POST以外は受け付けてません',
    });
    return;
  }

  try {
    const parsesParams = JSON.parse(request.body);
    const user = await saveUserData(parsesParams);
    response.json({
      message: 'Success',
      user,
    });
  } catch (error) {
    response.status(403).json({
      message: 'Failed',
      error: error.message,
    });
  }
});

exports.getUsers = functions.https.onRequest(async (request, response) => {
  // CORS用にAccess-Control-Allow系ヘッダを追加
  response.set('Access-Control-Allow-Origin', 'http://localhost:5000'); // localhostを許可
  response.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST'); // DELETEだけは拒否
  response.set('Access-Control-Allow-Headers', 'Content-Type'); // Content-Typeのみを許可

  if (request.method !== 'GET') {
    response.json({
      message: 'GET以外は受け付けてません',
    });
    return;
  }

  try {
    const users = await getUsers();
    response.json({
      message: 'Success',
      users,
    });
  } catch (error) {
    response.status(403).json({
      message: 'Failed',
      error: error.message,
    });
  }
});

async function saveUserData(params) {
  if (!params.username) {
    throw new Error('usernameは必須です!!!');
  }

  await firestore.collection('users').add({
    username: params.username,
  });
}

async function getUsers() {
  const snap = await firestore.collection('users').get();
  const users = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      username: data.username,
    };
  });

  return users;
}
