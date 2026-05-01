const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                _status: false,
                _message: "Token Missing"
            });
        }

        const decode = jwt.verify(token, process.env.TOKENKEY);
        req.body = req.body || {};
        req.body.userId = decode.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            _status: false,
            _message: "Invalid Token"
        });
    }
};

module.exports = { checkToken };
