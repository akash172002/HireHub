export const validate = (schema) => (req, res, next) => {
  const keys = ["body", "query", "params"];
  let hasError = false;
  const errors = {};
  for (const key of keys) {
    if (!schema[key]) continue;
    const value = req[key];
    for (const [field, rules] of Object.entries(schema[key])) {
      const val = value[field];
      for (const rule of rules) {
        const err = rule(val, field, value);
        if (err) {
          errors[field] = err;
          hasError = true;
          break;
        }
      }
    }
  }
  if (hasError) return res.status(400).json({ message: "Validation failed", errors });
  next();
};

export const v = {
  required: (val, field) => (val == null || val === "" ? `${field} is required` : null),
  email: (val) => (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "Invalid email" : null),
  minLen: (len) => (val) => (val && val.length < len ? `Min length ${len}` : null),
  isMongoId: (val) => (val && !/^[a-f\d]{24}$/i.test(val) ? "Invalid ID" : null),
};
