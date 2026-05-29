export function validateEnvAndDevice(req, res, next) {
  const { environment, deviceType } = req.query;

  const validEnvironments = ["development", "staging", "production"];
  const validDeviceTypes = ["mobile_menus_android", "mobile_menus_ios"];

  if (!environment || !deviceType) {
    return res
      .status(400)
      .json({ status: "error", message: "Something is missing" });
  }

  if (!validEnvironments.includes(environment)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid environment" });
  }

  if (!validDeviceTypes.includes(deviceType)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid device type" });
  }

  next();
}
