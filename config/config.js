// configure all the environments
var environments = {};

// staging or default environment
environments.staging = {
    port: 3000,
    name: 'staging'
};

// production environment
environments.production = {
    port: 8080,
    name: 'production'
};

// determine whether the environment was passed as a command line argument
var activeEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

//environment to export
// check whether the environment is configured, else export the default environment
var exportEnvironment = typeof(environments[activeEnvironment]) == 'object' ? environments[activeEnvironment] : environments.staging;

module.exports = exportEnvironment;