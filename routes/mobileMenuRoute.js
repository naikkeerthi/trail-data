import express from "express";
import {
  getAllMobileMenus,
  createMobileMenu,
  editMobileMenu,
  deleteMobileMenu,
  reorderMobileMenus
} from "../controllers/mobileMenuController.js";
import { validateEnvAndDevice } from "../utils/validators.js";

const router = express.Router();

router.get(
  "/mobile-menu/get-all-mobile-menus",
  validateEnvAndDevice,
  getAllMobileMenus
);
router.post(
  "/mobile-menu/create-mobile-menu",
  validateEnvAndDevice,
  createMobileMenu
);
router.post(
  "/mobile-menu/edit-mobile-menu",
  validateEnvAndDevice,
  editMobileMenu
);
router.delete(
  "/mobile-menu/delete-mobile-menu",
  validateEnvAndDevice,
  deleteMobileMenu
);
router.post(
  "/mobile-menu/reorder-mobile-menus",
  validateEnvAndDevice,
  reorderMobileMenus
);

export default router;
