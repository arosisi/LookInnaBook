const router = require("express").Router();

const setupApi = client => {
    const attachDb = api => require(api)(client)
    
    router.use('/books', attachDb('./books'));
    /*router.use('/orders', attachDb('./orders'));
    router.use('/inventory', attachDb('./inventory'));
    router.use('/publishers', attachDb('./publishers'));
    router.use('/sales-reports', attachDb('./sales-reports'));
    router.use('/registration', attachDb('./registration'));
    router.use('/profile', attachDb('./profile'));
    router.use('/login', attachDb('./login'));
    router.use('/reset-password', attachDb('./reset-password'));
    router.use('/payment', attachDb('./payment'));
    router.use('/modify-inventory', attachDb('./modify-inventory'));
    router.use('/modify-publisher', attachDb('./modify-publisher'));*/
    
    return router;
}

module.exports = setupApi;
