import dotenv from "dotenv";
dotenv.config();
import admin from "firebase-admin";

const PreProdServiceAccount = {
  type: process.env.preProd_type,
  project_id: process.env.preProd_type,
  private_key_id: process.env.preProd_type,
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCH7OGZ+mVl3arh\nWcPgYLLY+NjPi4bGd0BvgPTj6USHJaBKouZ2kbiob/JXVe2E/yggNAmX/3q+5SHV\nx1wmf6KFeX6n2HNtIWpq9RF3hExf2YcGr7qDuyRds/2KwINW9XGUPcxtG6PR/DBj\nWq2/9WxmgwJIilaUTw1eRfXjsDQaseZCmmOUvw0B8lgKDOqPdHuLbp5wsUmy5fh8\nqxCWXmmhHEKnWWtqV9TWi4m7ksHHw1btOUnrZ6tqdDwYmJJKczRt3uxjUBpZuZFz\n4xLVNzfR8YdosM5UWdhn5ij+nyy2t/zdzFUAddruPyefnV/BLbhSCak4GqXLOqb3\nZhqvDYdnAgMBAAECggEABxLOOLedoDv1YQ3NUjdmB0GH8uEFbf2VtlfFJrkkbk4I\ndendSW1S6T0OJPpdRm8K1QYwO585cYa2CIx74KsCt6R3cV+jvhmfkppXQtt5KAHH\nc5MghyttfIzZ1GcpTpSuSPMgWMs37r0LfZgh85vffMQzkbfVQpmMjgvg/GzWgU8O\nSp8nYRs6SLA17gJzolR+oi0ICUfr5jR1HEYLPbvmvnKURJiuQAjKq7CmWAzXQPki\n507Qyoqb70s+4XgY/zlwqQVnqei0kpi+F6fZwMQ7yxRIDLc0LnUUo4wQXe9T1Z+v\nJTvkEfeIQ0aY4BZWuycbEKGSAAQi40IBdRJum31LoQKBgQDAHqTDxMaNpDnrW1Fk\nrc8YLUym5yCWhVlxKOYKMTeLmYD2pu1V3/MyDq0MLOYLfdL2MBkqWvgyUUx8sI1W\njA1c6fNK3MzD8KHJvrCA2cgIND7FfMUxQ10R4NbsCxGVZFL7UpenonrBzcdp8ekl\nfzefF29T1+SxuPcVl3EKEbOiYQKBgQC1Hu801D3AME7gyZOBBM2WNalmpMdLUdox\nxsDlO/guIe3jA4qIjrS/3ma52tlZ8EkJJS7T/Lhl2iB9tfXOPb7pdUdEpllqp5ic\nQR4ym1FrV5Wfp+UXQXU+R6d4jQp5fP2zOO9L/ARQRkWpvFM5IeJqd1FwKqTAqV9T\nJHDxGCkOxwKBgBRk7F6vy9gLX+6hEgHbBYnufR2WmXoBC96cVdctJFVYZT1JuRYN\noPZmYm5RcdY0dCmYL4O0hnZo9PKjl01hrqV3XFFNIRuHttUAviHffIGKckNqnFA/\nc2jLcmU6Q5KVRM3TFbBA6kEahBm2CWbmm1PzG+lNmMRY+zm6itBj0qrhAoGBAKqW\nrjoVxOtlFIXHlbQo7/GQLTNN859PQrErP7comoHo1wO/7BTeRAOK1zoplBmPpVqF\nuOtU1eCoZ32/ifpsUYnVOgDApOs9WxGgi26itzbg0T4EhlM3BdRY7LUwMjNmtBS/\nhTMN9IofBbHufHwNHBGmu/9nSrFjVTMb2XxagyE1AoGAGWb/ROZzyraIiRllaWfM\nfk3e5rILjaBfeTZTbAHJxXtcohemD/CKjXuY9ue2Yqp+eiZslj/CPnRX/L0PhgTh\n063fc0NdkorCOLmUa3UUYQrUYiyZtcywiVsPuCFpNige2J1E08VzaL0TKzxV9V7K\nybZ3PwZ6MdAMSD+BzPe7jlI=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-gplyq@coffeeweb-pre-prod-64ca9.iam.gserviceaccount.com", // These above keys should be directly consumed not from the env
  client_id: process.env.preProd_client_id,
  auth_uri: process.env.preProd_auth_uri,
  token_uri: process.env.preProd_token_uri,
  auth_provider_x509_cert_url: process.env.preProd_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.preProd_client_x509_cert_url,
  universe_domain: process.env.preProd_universe_domain
};

const preProdApp = admin.initializeApp(
  {
    credential: admin.credential.cert(PreProdServiceAccount),
    projectId: "coffeeweb-pre-prod-64ca9"
  },
  "preProdApp"
);

export default preProdApp.remoteConfig();
