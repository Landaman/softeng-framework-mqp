module.exports = {
    devServer: {
        watchFiles: {
            paths: ["app/common/**"],
            options: {
                usePolling: true,
            }
        }
    }
};