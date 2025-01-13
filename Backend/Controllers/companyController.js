import Company from "../Models/companyModel.js";
export const registerCompany = async (req, res) => {
  try {
    // get user data
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const companyExists = await Company.findOne({ name });
    if (companyExists) {
      return res.status(400).json({
        success: false,
        message: "Company already exist",
      });
    }

    const newCompany = new Company({ name });
    await newCompany.save();

    return res.status(200).json({
      success: true,
      data: newCompany,
      message: "Company registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error registering company",
    });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});

    return res.status(200).json({
      success: true,
      data: companies,
      message: "Companies fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error getting companies",
    });
  }
};
