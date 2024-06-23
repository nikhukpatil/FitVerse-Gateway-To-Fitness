const {STATUS_CODES, statusMes, STATUS_CODESsages, STATUS_MESSAGES} = require("../constants/Constant");

let checkUser = {};


checkUser.admin = async (req,res,next) => {
    try {
        if(req.user.role === 'Admin'){
           return  next();
        }
        return res.status(STATUS_CODES.INVALID_CODE).json({
            success: false,
            message: STATUS_MESSAGES.UNAUTHORIZED_REQUEST
        });
    } catch (error) {
        res.status(STATUS_CODES.SERVER_ERROR).json({
            success: false,
            message: STATUS_MESSAGES.SERVER_ERROR
        });
    }
}

module.exports = checkUser;