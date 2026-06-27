export const successResponse = (message, data = null) => {
    return {
        status : true,
        message,
        data
    };
};

export const errorResponse = (message) => {
    return {
        status : false,
        message
    };
};