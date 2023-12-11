"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function routeHelper(callback) {
    return async (req, res) => {
        try {
            await callback(req, res);
        }
        catch (error) {
            res.json({ icon: 'fa-regular fa-circle-xmark',
                title: 'Ocurrió un error inesperado',
                content: error.message });
        }
    };
}
function errorMiddleware(error, req, res, next) {
    res.json({ icon: 'fa-regular fa-circle-xmark',
        title: 'Ocurrió un error inesperado',
        content: error.message });
}
module.exports = {
    routeHelper,
    errorMiddleware
};
