import * as admin from 'firebase-admin'
// import * as serviceAccount from "./service-account.json"

const serviceAccount = require('./service-account.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin