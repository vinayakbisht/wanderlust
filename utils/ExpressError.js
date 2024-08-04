
// custom error
class ExpressError extends Error{
    constructor(statusCode , message){
        super();
        this.statusCode = statusCode;       // the statuscode and message sent by us will be  set in the error's 
        this.message = message;             // status code and message
    }
};

module.exports = ExpressError;