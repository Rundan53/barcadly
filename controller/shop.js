exports.addToCart = async (req, res) => {
  const { id, name, category } = req.body;
  const user = req.user

  user.addToCart(id, name, category)
    .then((result) => {
      res.status(200).json({ success: true, message: 'added to cart' });
    })
    .catch((err) => {
      res.status(500).json(err.message)
    })

}


exports.deleteFromCart = (req, res) => {
  const { productId } = req.params;

  req.user.deleteProductFromCart(productId)
    .then((result) => {
      res.status(201).json({ updatedCart: result.cart.items, success: true });
    })
    .catch(err => console.log(err));

}

exports.getCart = async (req, res) => {
  try {
    const cart = await req.user.cart.items;    //await is experiment if not work remove await
    res.status(200).json({ cart, success: true });
  }
  catch (err) {
    res.status(500).json(err.message || 'Internal server error')
  }
}


exports.mergeGuestCart = async (req, res) => {
  const guestCart = req.body.parsedGuestCart;
  req.user.mergeUserCart(guestCart)
    .then((result) => {
      res.status(201).json({ mergedCart: result, success: true })
    })
    .catch((err) => {
      res.status(500).json(err.message || 'Internal server error')
    })
}