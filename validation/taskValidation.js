//validation/taskValidation.js
import Joi from "joi";

// Create Task Validation
export const validateCreateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().allow("", null),
    status: Joi.string()
      .valid("Todo", "In Progress", "Done")
      .default("Todo"),
    projectId: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.body = value;
  next();
};

// Update Task Validation
export const validateUpdateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(100),
    description: Joi.string().allow("", null),
    status: Joi.string().valid("Todo", "In Progress", "Done"),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.body = value;
  next();
};