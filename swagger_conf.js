const options = {
    swaggerDefinition: {
        openapi: "3.1.0",
        info: {
            description: 'Surrealismo API for ESMAPP project',
            title: "Surrealismo API",
            version: "1.0.0"
        },
        host: 'localhost:3000',
        basePath: '/',
        produces: ['application/json'],
        schemes: ['http'],
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                in: 'header',
                name: "Authorization",
                description: "Bearer Token",
            }
        }
    },
    basedir: __dirname,
    files: ['./routes/**/*.routes.js', './models/**/*.js']
};

module.exports = options;