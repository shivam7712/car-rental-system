export const validate = (schema) => (req, res, next) => {

    const result = schema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ 
            msg: "validation failed",
            error: result.error.flatten()
        });
    }
    console.log("validation success")
    next();
}
