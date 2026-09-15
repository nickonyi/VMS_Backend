import {
  getAscribeProperties,
  requestPropertyAccess,
  getResidentHouses,
} from "../services/ascribe.service.js";

export const getProperties = async (req, res, next) => {
  try {
    const token = req.session.auth?.ascribeToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Ascribe authentication required.",
      });
    }

    const response = await getAscribeProperties(token);

    const properties = response.data.map((property) => ({
      id: property.id,
      name: property.property_name,
      location: property.property_location,
      country: property.property_country,
    }));

    return res.status(200).json({
      success: true,
      properties: properties,
    });
  } catch (err) {
    next(err);
  }
};

export const postPropertyAccessRequest = async (req, res, next) => {
  try {
    const token = req.session.auth?.ascribeToken;
    const residentId = req.session.auth?.ascribeResidentId;

    if (!token || !residentId) {
      return res.status(401).json({
        success: false,
        message: "Resident authentication required.",
      });
    }

    const { id: propertyId } = req.params;

    const response = await requestPropertyAccess({
      property_id: propertyId,
      resident_id: residentId,
      token,
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message:
          response.data?.message ||
          "Unable to request access to this property.",
        error: response.data,
      });
    }

    return res.status(200).json({
      success: true,
      message: response.data.message,
    });
  } catch (err) {
    next(err);
  }
};

export const getAccessStatus = async (req, res, next) => {
  try {
    const token = req.session.auth?.ascribeToken;
    const residentId = req.session.auth?.ascribeResidentId;

    if (!token || !residentId) {
      return res.status(401).json({
        success: false,
        message: "Resident authentication required.",
      });
    }

    const response = await getResidentHouses({
      residentId,
      token,
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: response.data?.message || "Unable to check access status.",
      });
    }

    const houses = response.data;

    const hasAccess = Array.isArray(houses) && houses.length > 0;

    return res.status(200).json({
      success: true,
      hasAccess,
    });
  } catch (err) {
    next(err);
  }
};
