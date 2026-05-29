import dotenv from "dotenv";
dotenv.config();
import admin from "firebase-admin";

const ProdServiceAccount = {
  type: process.env.prod_type,
  project_id: process.env.prod_type,
  private_key_id: process.env.prod_type,
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjtW6JkTC2n6KJ\nCY9PHMNJhSJehvrgiS33Uq5ArPEsYubbI1MT7RzIMVOaCxkgT1nQa04DjcN37fhQ\nxOOeuOwi+NLE1pOq9SAC/90WCcPsC0x/t13on4Svp1pFpCDXPJtRVtMynDMG9dLy\nPlhqjg+eElmLAfETZOWkEkQAUmMe+vpSFjvZBgCFfketA568ITv82sEIwwqsdZ3r\nR/4TBCGD1ZpEW9EqgYEkU9ejmmtvLj44sXQEmeWPDHJMo89iTiG3Uj6iSUHhQTsk\nJ5ErKt2DnZj40wTzMrmPBscIh1uH6Y8lEvkcSEh6EdNrRcIxTv795FKWZP+FSOwy\nhfdumoMBAgMBAAECggEAArFo8oI3rQK7wP7YrhUQ9lbmaEEsA9Zl3JgY2I9aaUqY\nNcR4k6RBJrQ/Befxqh58DFRo5GCS4FhtubW/cSc6xTQsKBjyisD9CDzuxV50QWAJ\n37OjwRWiBboI9LUnkCWFquUff3Pigqu3ubdCVkBk1orCkSmUmRHTautHq0IFB5JT\nytORdX++PJ9nfVHjKydNc0Ig9jLWsbO8h9TceBzuXbdLrtFqlZ38dQeKkYbr5Ojc\npy+6thmWiS3NKXBBSGMH306vDcbTHU50UG2j1VhiTlrXk5QwRqCCKsOUPzFmmrzC\nSyjtwJuHQOkaEYISnzOtkm7tk4dJRCvmi/dqkM+IUQKBgQDJIBrtVslTKwYixpU6\nidOUA6KxgUA/fvge0ve/fWBn+dCQqv/fXkbJFoE7Qjanx9Xnc4QE4QIFUROnua7U\n/VGF9IgZ6Dkr8dAOK/pm8ft5tDfnKpnAkxKodMXWuVZilknEoPH9Nfo/s+tvzo4E\nreFRpyf2aTlWdv635WDS0YcxSQKBgQDQX+dU+7pqLzz4dkLmUGNmBlbv9/SPzawk\nMQ37RWwLtFP6E/F8wytdjw9RTrtYhVj1EHrPfR+ICsJQBzFb1mXM5NTw81G1nWJE\nK1b+kvjRUhpMSoKEl6mfuwijgY6KIv0VyjmpMjSAOuo32qkvVE0FWZ/2MsiR+Ri9\nyCM3R4H7+QKBgAwOwa6C6nTy+l4xW5bz1lxkT2em4Qwtd4CZk0LGqHXzUx6pMcfZ\nZhL+J2c/E/nBEEDc+wgz2SQqdSw0BJg+S5nlTBeJhYvt5lRDLLLpRPNJ66QPOMKD\nzrWMsqOp3tTwP6HrKDbO+p7BEZdVYcxEBGMZy1qJemeFoMWzmbdp2loJAoGAW+C9\nnsI0CxfzGVcD3ou5mEXZVYwOYM3+RiL/GDkfD/YeRRlAFJP17hXjWiWOA9UgSUZP\n8GcqXRDpZuIVCHp7fqGzpt6Su7K+nnJBtJRXc+xwvgzoidBZsZ2FjJrWn+AXmeEG\nFa2WaqgPmDso+D6Ci4ZeOu9fcsXT+/JgXMKB9PkCgYEAgOoTl6RH+HJurrCQKaFv\nYxq7Hf4TU7i8MKq6faRzYWoLZsV0odh+/SaonS8cK0wuwdOVE9t5u0wACQgYGojx\nQO2tQwF5g57Lry14cUnL/MzongHYkmZc7H4V+Fsr8T21Z/0oyHKaDT6iIZdjgBHS\nI2idFK7ecit817e8po/Qk3w=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-qzqpz@coffeeweb-354711.iam.gserviceaccount.com", // These above keys should be directly consumed not from the env
  client_id: process.env.prod_client_id,
  auth_uri: process.env.prod_auth_uri,
  token_uri: process.env.prod_token_uri,
  auth_provider_x509_cert_url: process.env.prod_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.prod_client_x509_cert_url,
  universe_domain: process.env.prod_universe_domain
};

const prodApp = admin.initializeApp(
  {
    credential: admin.credential.cert(ProdServiceAccount),
    projectId: "coffeeweb-354711"
  },
  "prodApp"
);

export default prodApp.remoteConfig();
