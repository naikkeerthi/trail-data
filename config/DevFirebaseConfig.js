import dotenv from "dotenv";
dotenv.config();
import admin from "firebase-admin";

const DevServiceAccount = {
  type: process.env.dev_type,
  project_id: process.env.dev_type,
  private_key_id: process.env.dev_type,
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNPL4OoL6sKETs\ndiQOtXMV+wNmG8GyyDWPmFKuCm8SB1EIsFIpNzW8ACq3FRzQPwGAA1bDta2xGVT4\nnAM6HtB9Jfc1qAWKE/eZmFCEJe2YUyJpcGzLWaam8WEfJ5xF3Se1owe90YJpCM6Y\n0fawqjEcuwte/Nb2iAVFteo4koWXYrP447iFP9GoPlpfqL3tm2Q1irqjkVLdS/SN\ndMMWnDorsk8ASH+yQ+fU2JZCrDcrkqACieOrSwj0P25iJ7cJHaBBAcRhJuQfGT2Q\nZy7ZjKN4EuV3CJn2aYjMy6GR0ClP+CZORJOwOy3UEx0gDwtQqxxn2Q6DuXZCog0u\n9xuensarAgMBAAECggEAEIG9K4IEM+Z9PKN33PL9EZyBtnmvB4kQvb7bj4HpUwLh\nophD02rMWJWO2fDJw3n9zeT22oDHOoI2ElTB8a++xwIBswATifp3JJRajXZbeK/f\nCanwJh7Mx4qMbCwMZpYV9obpPXwXSAlcTHA+rhDSKGRm0rn1NBjWi7fI4cnvErDJ\niGjdqMPHthXaLX4dMo3nsGyGIHVAwbX9ApCpl8ePRWa8Lhh2OrR17SoMcLB6A/ID\nJJx40TzHQw8kjziyh3JbYbld7WgvD/d8s8n6scPRrJyzdlkg4Fwh8n+MRtvAMRyl\nnhXjCc9IAN1PJdjIF6AjhlXHuUohwFEFW/06wjFXuQKBgQDPZHeLCQVON/C6zo4R\nCs/54AGwdXZQSmALCYC/ikCBOjk+tQfOdwceU573CLyaCtisHa8qUe1GhJxevg8T\nxrx3kFCTo1SA+NVezKWbxafkDt0W4Ld+y0JUNwoVf1OtIxr4DXUV25nvT4+KzDHU\noU2S0W9bQXuKlqQwEY2/DthFDQKBgQD9VvcT6HbokCLe+rmBrUSg3A6r0GZs13Z9\nOzb7H+Y8IFcinLfQHMCFPKYXvD87AC9JrsTMmJKHPXJqM7LBRGBXdPdWx+siTesO\nWPis4Sn721Nt+9fSY/oSN48xhbxlytBSyf1VVwS4RQVX/YOoaSAXk4hX8r5hR+ei\nsAI3Vps8lwKBgQCr8/7x9l7BxbwBBzXfh3l9EnAUILAiTihnvk9TgIuPGflQtsRs\nOWBbkrWg2UuW5RtVSZ9slVUIPPdxzl+t4/9rmupUHv33mVlAKqm9CBr2CiThzRwX\nMuwh6yifPlzgltTLikzj/JobQ3oeeMNwKvWon6GWpiqKc/BaMpO2L9a9GQKBgD+F\n++RJCO/dnHDO648BlFDFfQRF+DjYegSCwZGMeR2geljadRjA7OE7yOXwtOYlcLYI\nFZ67rxosJTFOD0d4zrN/R7nB3Uq3wPXTB1/KAc3+O9g7Ku29VeoVdllTkF7x0PTB\nYz1v2WYfIGzky4uB+KMQwkJTQrt/3Swk+BlKJRi3AoGAY8ke3olf9p2q16/xjpS/\neTuHR3BgTEWRBaB8pjuE4KtZHbQgm4CElCwueZV4QKd3nZvaLnhXE0QkVuYHl3sc\n84/lqrGCLqh9k2QTHkTVjp517swLwWgx98JV1HMQd2PeUxeq9eQxn38aAmEJlIJu\nkOTTjkzdXEJGX0GUB+CIQeQ=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-9bzou@coffeeweb-dev.iam.gserviceaccount.com", // These above keys should be directly consumed not from the env
  client_id: process.env.dev_client_id,
  auth_uri: process.env.dev_auth_uri,
  token_uri: process.env.dev_token_uri,
  auth_provider_x509_cert_url: process.env.dev_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.dev_client_x509_cert_url,
  universe_domain: process.env.dev_universe_domain
};

const devApp = admin.initializeApp(
  {
    credential: admin.credential.cert(DevServiceAccount),
    projectId: "coffeeweb-dev"
  },
  "devApp"
);

export default devApp.remoteConfig();
