const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        allowNull: false,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    cart: {
        items: [{
            productId: { type: String, required: true },
            name: {type: String, required: true},
            category: {type: String, required: true},
            quantity: { type: Number, required: true }
        }]
    }
})


userSchema.methods.addToCart = function (id, name, category) {

    const productIndex = this.cart.items.findIndex((cp) => {
        return cp.productId == id;
    })

    let userCartItems = this.cart.items;
    let newQuantity = 1;
   
    if (productIndex >= 0) {
        newQuantity = this.cart.items[productIndex].quantity + 1;
        userCartItems[productIndex].quantity = newQuantity;
    }
    else {
        userCartItems.push({ productId: id, name, category, quantity: 1 });
    }

    const updatedCart = { items: userCartItems };
    this.cart = updatedCart;
    console.log(this.cart)
    return this.save()
}


// userSchema.methods.clearCart = function(){
//     this.cart.items = [];
//     return this.save();
// }

userSchema.methods.mergeUserCart = function (guestCart){
    const userCart = this.cart.items;
    guestCart.forEach((guestProd) => {
        let index = userCart.findIndex(p=> guestProd.productId == p.productId);
        if(index>=0){
            const newQuantity = this.cart.items[index].quantity + 1;
            userCart[index].quantity = newQuantity;
        }
        else{
            userCart.push({ ...guestProd, quantity: 1 });
        }
    });

    const updatedCart = { items: userCart };
    this.cart = updatedCart;
    console.log(this.cart)
    return this.save();
}

userSchema.methods.deleteProductFromCart = function (productId){
    const updatedCart = this.cart.items.filter(p=>{
        return  p.productId != productId;
    });

    this.cart.items = updatedCart;
    return this.save()
}



module.exports = mongoose.model('User', userSchema);