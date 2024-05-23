const express = require('express');
const router = express.Router();

const userController = require('../controller/user')
const shopController = require('../controller/shop')

router.get('/check-user', userController.checkAuthenticity);
router.post('/cart', shopController.addToCart)
router.delete('/cart/:productId', shopController.deleteFromCart)
router.get('/cart', shopController.getCart);
router.post('/guest-cart', shopController.mergeGuestCart);

module.exports = router;