import {
  getTemplate,
  publishTemplate
} from "../services/remoteConfigService.js";

// Get all menus
export const getAllMobileMenus = async (req, res) => {
  const { environment, deviceType } = req.query;

  try {
    let template = await getTemplate(environment);

    if (!template.parameters[deviceType]) {
      return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "No menus available",
        returnLst: []
      });
    }

    const menuList = template.parameters[deviceType].defaultValue.value;

    res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "All available menus",
      returnLst: JSON.parse(menuList)
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};

// Create new menu
export const createMobileMenu = async (req, res) => {
  const { environment, deviceType } = req.query;
  const menuDetails = req.body;

  try {
    if (
      !menuDetails.menuName ||
      !menuDetails.menuPath ||
      menuDetails.subscriptionIds.length === 0 ||
      !(menuDetails.isActiveForGuestUser || menuDetails.isActiveForLoggedInUser)
    ) {
      return res.status(400).json({
        message: "Validation error : Please fill all the details"
      });
    }

    let template = await getTemplate(environment);

    if (!template.parameters[deviceType]) {
      menuDetails.id = 1;
      template.parameters[deviceType] = {
        defaultValue: {
          value: JSON.stringify([menuDetails])
        }
      };

      await publishTemplate(environment, template);

      return res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "New menu added successfully!",
        returnLst: [menuDetails]
      });
    } else {
      const menuTemplate = template.parameters[deviceType].defaultValue?.value;
      const menuList = JSON.parse(menuTemplate);

      const getNewMenuId =
        menuList.length > 0
          ? Math.max(...menuList.map((menu) => menu.id)) + 1
          : 1;

      const existingMenu = menuList.find(
        (menu) => menu.menuName === menuDetails.menuName
      );

      if (existingMenu) {
        return res.status(409).json({
          message: "Menu with this name already exists."
        });
      }

      menuDetails.id = getNewMenuId;
      menuList.push(menuDetails);

      template.parameters[deviceType] = {
        defaultValue: {
          value: JSON.stringify(menuList)
        }
      };

      await publishTemplate(environment, template);

      res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        message: "New menu added successfully!",
        returnLst: menuList
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update Remote Config",
      error: error.message
    });
  }
};

// Edit menu
export const editMobileMenu = async (req, res) => {
  const { environment, deviceType } = req.query;
  const menuDetails = req.body;
  try {
    if (
      !menuDetails.menuName ||
      !menuDetails.menuPath ||
      menuDetails.subscriptionIds.length === 0 ||
      !(menuDetails.isActiveForGuestUser || menuDetails.isActiveForLoggedInUser)
    ) {
      return res.status(400).json({
        message: "Validation error : Please fill all the details"
      });
    }

    let template = await getTemplate(environment);

    const menuTemplate = template.parameters[deviceType].defaultValue.value;
    const menuList = JSON.parse(menuTemplate);
    const isMenuExist = menuList.find((menu) => menu.id === menuDetails.id);

    if (!isMenuExist) {
      return res.status(400).json({
        message: "Menu doesn't exist."
      });
    }

    const isMenuNameAlreadyExist = menuList.find(
      (ele) =>
        ele.id !== menuDetails.id && ele.menuName === menuDetails.menuName
    );

    if (isMenuNameAlreadyExist) {
      return res.status(409).json({
        message: "Menu with this name already exists."
      });
    }

    const modifiedMenus = menuList.map((ele) =>
      ele.id === menuDetails.id ? menuDetails : ele
    );

    template.parameters[deviceType] = {
      defaultValue: {
        value: JSON.stringify(modifiedMenus)
      }
    };

    await publishTemplate(environment, template);

    res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Remote Config updated successfully!",
      returnLst: modifiedMenus
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update Remote Config",
      error: error.message
    });
  }
};

// Delete menu
export const deleteMobileMenu = async (req, res) => {
  const { environment, deviceType } = req.query;
  const { menuId } = req.query;

  try {
    if (!menuId) {
      return res.status(400).json({
        message: "Menu id is required"
      });
    }

    let template = await getTemplate(environment);

    const menuTemplate = template.parameters[deviceType].defaultValue.value;
    const menuList = JSON.parse(menuTemplate);
    const filteredMenuList = menuList.filter(
      (menu) => menu.id !== Number(menuId)
    );

    template.parameters[deviceType] = {
      defaultValue: {
        value: JSON.stringify(filteredMenuList)
      }
    };

    await publishTemplate(environment, template);

    res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Menu deleted successfully!",
      returnLst: filteredMenuList
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update Remote Config",
      error: error.message
    });
  }
};

// Reorder menus
export const reorderMobileMenus = async (req, res) => {
  const { environment, deviceType } = req.query;
  const newMenuList = req.body;

  try {
    let template = await getTemplate(environment);

    template.parameters[deviceType] = {
      defaultValue: {
        value: JSON.stringify(newMenuList)
      }
    };

    await publishTemplate(environment, template);

    res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Menu reordered successfully!",
      returnLst: newMenuList
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update Remote Config",
      error: error.message
    });
  }
};
