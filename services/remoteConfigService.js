import DevFirebaseConfig from "../config/DevFirebaseConfig.js";
import PreProdFirebaseConfig from "../config/PreProdFirebaseConfig.js";
import ProdFirebaseConfig from "../config/ProdFirebaseConfig.js";

export const getTemplate = async (environment) => {
  if (environment === "development") {
    return await DevFirebaseConfig.getTemplate();
  } else if (environment === "staging") {
    return await PreProdFirebaseConfig.getTemplate();
  } else if (environment === "production") {
    return await ProdFirebaseConfig.getTemplate();
  }
};

export const publishTemplate = async (environment, template) => {
  if (environment === "development") {
    await DevFirebaseConfig.publishTemplate(template);
  } else if (environment === "staging") {
    await PreProdFirebaseConfig.publishTemplate(template);
  } else if (environment === "production") {
    await ProdFirebaseConfig.publishTemplate(template);
  }
};
