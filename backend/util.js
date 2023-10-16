import dotenv from "dotenv";
dotenv.config();

export const errorHandler = (error, req, res, next) => {
  console.error(error);
  res.status(500).send("Something went wrong!");
};

export const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res);
  } catch (error) {
    return next(error);
  }
};
