const validationType = ["body", "params", "query", "headers"]

const validation = (Schema) => {
    return (req, res, next) => {
        let validationError = []
        validationType.forEach((key) => {
            if (Schema[key]) {
                let validate = Schema[key].validate(req[key], { abortEarly: false });
                if (validate.error) {
                    validationError.push(validate.error.details)
                }
            }
        })

        if (validationError.length) {
            res.json({ message: "Error", validationError })
        } else {
            next();
        }

    }
}

export default validation;