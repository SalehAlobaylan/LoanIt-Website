const errorCodes = {
    // General Errors (GEN)
    GEN_001: { message: "Internal server error", icon: "SERVER", status: 500 },
    GEN_002: { message: "Invalid request", icon: "FORM", status: 400 },
    GEN_003: { message: "Resource not found", icon: "INFO", status: 404 },
    GEN_004: { message: "Unauthorized access", icon: "LOCK", status: 401 },
    GEN_005: { message: "Method not allowed", icon: "LOCK", status: 405 },
    GEN_006: { message: "Request timeout", icon: "CLOCK", status: 408 },
    GEN_007: { message: "Service unavailable", icon: "SERVER", status: 503 },

    // Authentication Errors (AUTH)
    AUTH_001: { message: "Invalid credentials", icon: "LOCK", status: 401 },
    AUTH_002: { message: "User not found", icon: "USER", status: 404 },
    AUTH_003: { message: "Phone number already registered", icon: "USER", status: 400 },
    AUTH_004: { message: "Username already in use", icon: "USER", status: 400 },
    AUTH_005: { message: "Email already registered", icon: "USER", status: 400 },
    AUTH_006: { message: "Invalid token", icon: "LOCK", status: 401 },
    AUTH_007: { message: "Token expired", icon: "LOCK", status: 401 },

    // Loan Errors (LOAN)
    LOAN_001: { message: "Loan not found", icon: "LOAN", status: 404 },
    LOAN_002: { message: "Loan creation failed", icon: "LOAN", status: 400 },
    LOAN_003: { message: "Invalid loan status", icon: "LOAN", status: 400 },
    LOAN_004: { message: "Invalid loan amount", icon: "LOAN", status: 400 },
    LOAN_005: { message: "Loan update failed", icon: "LOAN", status: 400 },
    LOAN_006: { message: "Loan deletion failed", icon: "LOAN", status: 400 },
    LOAN_007: { message: "Unauthorized loan action", icon: "LOCK", status: 403 },

    // Database Errors (DB)
    DB_001: { message: "Database connection failed", icon: "SERVER", status: 500 },
    DB_002: { message: "Query execution failed", icon: "SERVER", status: 500 },
    DB_003: { message: "Data integrity violation", icon: "WARNING", status: 400 },

    // Transaction Errors (TRANS)
    TRANS_001: { message: "Transaction creation failed", icon: "TRANSACTION", status: 400 },
    TRANS_002: { message: "Invalid transaction type", icon: "TRANSACTION", status: 400 },
    TRANS_003: { message: "Transaction update failed", icon: "TRANSACTION", status: 400 },
    TRANS_004: { message: "Transaction deletion failed", icon: "TRANSACTION", status: 400 },
    TRANS_005: { message: "Invalid transaction amount", icon: "TRANSACTION", status: 400 }
};

function getErrorPayload(code, customMessage = null) {
    if (!errorCodes[code]) {
        console.error(`Unknown error code: ${code}`);
        code = 'GEN_001'; // Fallback to general error
    }

    const { message, icon, status } = errorCodes[code];
    return {
        error: {
            code,
            message: customMessage || message,
            icon
        },
        status
    };
}

function sendError(res, code, customMessage = null) {
    const { error, status } = getErrorPayload(code, customMessage);
    return res.status(status).json({ error });
}

module.exports = { getErrorPayload, sendError };
