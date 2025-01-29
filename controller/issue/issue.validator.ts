import { body, CustomValidator } from "express-validator";
import { ISSUE_TYPES } from "../../utils/issue-reasons";

// Helper to validate category
const isValidCategory: CustomValidator = (value) => {
  return ISSUE_TYPES.some((issue) => issue.value === value);
};

// Helper to validate sub_category based on category
const isValidSubCategory: CustomValidator = (value, { req }) => {
  const category = req.body.category;
  const categoryObj = ISSUE_TYPES.find((issue) => issue.value === category);
  return !!categoryObj?.subCategory.some((sub) => sub.enums === value);
};

const Issue = {
  createIssue: [
    // Validate 'category' only if 'rating' or 'issue_type' is not present
    body("category")
      .if((_, { req }) => !req.body.rating && !req.body.issue_type)
      .exists()
      .withMessage("Category is required.")
      .bail()
      .custom(isValidCategory)
      .withMessage(
        "Invalid category, category must be order, item, fulfilment, agent, payment"
      ),

    // Validate 'sub_category' only if 'rating' or 'issue_type' is not present
    body("sub_category")
      .if((_, { req }) => !req.body.rating && !req.body.issue_type)
      .exists()
      .withMessage("Sub-category is required.")
      .bail()
      .custom(isValidSubCategory)
      .withMessage("Invalid sub-category for the selected category."),

    // Validate 'description'
    body("description")
      .if((_, { req }) => !req.body.rating && !req.body.issue_type)
      .exists()
      .withMessage("Description is required.")
      .bail()
      .custom(
        (desc: {
          short_desc?: string;
          long_desc?: string;
          images?: string[];
        }) => {
          if (!desc.short_desc || !desc.long_desc) {
            throw new Error("Short and long descriptions are required.");
          }
          if (!Array.isArray(desc.images) || desc.images.length === 0) {
            throw new Error("At least one image URL is required.");
          }
          if (desc.images.length > 4) {
            throw new Error("Maximum 4 images acceptable.");
          }
          return true;
        }
      ),

    // Validate 'items'
    body("items")
      .if((_, { req }) => !req.body.rating && !req.body.issue_type)
      .exists()
      .withMessage("Items are required.")
      .bail()
      .isArray()
      .withMessage("Items must be an array.")
      .bail()
      .custom((items: Array<{ id: string; quantity: number }>) => {
        for (const item of items) {
          if (!item.id || !item.quantity) {
            throw new Error("Each item must have an 'id' and 'quantity'.");
          }
          if (typeof item.quantity !== "number" || item.quantity <= 0) {
            throw new Error("Quantity must be a positive number.");
          }
        }
        return true;
      }),
  ],
};

export default Issue;
