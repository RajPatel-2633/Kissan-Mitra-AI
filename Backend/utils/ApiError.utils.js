class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = []) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}


class BadRequestError extends ApiError {
    constructor(message = "Bad Request", errors = []) {
        super(400, message, errors);
    }
}


class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(401, message);
    }
}


class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
        super(403, message);
    }
}


class NotFoundError extends ApiError {
    constructor(message = "Resource Not Found") {
        super(404, message);
    }
}


class ConflictError extends ApiError {
    constructor(message = "Conflict") {
        super(409, message);
    }
}


class InternalServerError extends ApiError {
    constructor(message = "Internal Server Error") {
        super(500, message);
    }
}

export {
    ApiError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError
};