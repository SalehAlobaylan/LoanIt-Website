 const appLogger = (req, res, next) => {
    const start = Date.now();
    const startDate = new Date(start).toISOString(); // Get the request start time in ISO format

    // Save a reference to the original res.send method
    const originalSend = res.send;

    // Intercept the response body
    res.send = function (body) {
        res.body = body; // Store the response body in res.body
        originalSend.apply(res, arguments); // Call the original res.send method
    };

    res.on('finish', () => {
        const duration = Date.now() - start;

        // Try to parse the response body as JSON, fallback to original if parsing fails
        let responseBody;
        try {
            responseBody = JSON.parse(res.body);  // Attempt to parse JSON body
            responseBody = JSON.stringify(responseBody, null, 2);  // Pretty print JSON
        } catch (e) {
            responseBody = res.body;  // If parsing fails, log the raw body
        }

        console.log(`${req.method} ${res.statusCode}
${startDate} ${req.originalUrl} ${duration}ms
Request Headers: ${JSON.stringify(req.headers, null, 2)}
Response Body: ${responseBody ? responseBody : '(empty)'}
        `);
    });

    next();
};

module.exports = appLogger;