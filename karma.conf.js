module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/app/core/services/hello-world.service.spec.ts'
        ],
        browsers: ['Chrome'],
        singleRun: true
    });
};