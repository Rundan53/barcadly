

const products = [
    { productId: 1, name: "Product 1", category: "Category A" },
    { productId: 2, name: "Product 2", category: "Category B" },
    { productId: 3, name: "Product 3", category: "Category A" },
    { productId: 4, name: "Product 4", category: "Category B" },
    { productId: 5, name: "Product 5", category: "Category A" },
    { productId: 6, name: "Product 6", category: "Category B" },
    { productId: 7, name: "Product 7", category: "Category A" },
    { productId: 8, name: "Product 8", category: "Category B" },
    { productId: 9, name: "Product 9", category: "Category A" },
    { productId: 10, name: "Product 10", category: "Category B" },
    { productId: 11, name: "Product 11", category: "Category A" },
    { productId: 12, name: "Product 12", category: "Category B" },
    { productId: 13, name: "Product 13", category: "Category B" }
];

let cart = [];
let user = null;

async function showHome() {
    document.getElementById('home').style.display = 'block';
    document.getElementById('signin').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('cart').style.display = 'none';
    displayProducts();
    const token = localStorage.getItem('token');
    if (token) {
        const isauthenthic = await isUserAuthorized(token);
        if (isauthenthic) {
            user = token;
            updateNavBtns();
        }
    }
}

async function isUserAuthorized(token) {
    const response = await axios.get('/shop/check-user', { headers: { "Authorization": token } });
    return response.data.authentic;
}

function showSignIn() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('signin').style.display = 'block';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('cart').style.display = 'none';
}

function showSignUp() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('signin').style.display = 'none';
    document.getElementById('signup').style.display = 'block';
    document.getElementById('cart').style.display = 'none';
}

function showCart() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('signin').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('cart').style.display = 'block';
    handleCartDisplay();

}

async function handleCartDisplay(){
    if (!user && !localStorage.getItem('token')) {
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
            displayCartItems(JSON.parse(guestCart));
        }

    }
    else {
        const guestCart = localStorage.getItem('guestCart');
        const token = localStorage.getItem('token');
        if (guestCart) {
            const parsedGuestCart = JSON.parse(guestCart);
            console.log(parsedGuestCart)
            const response = await axios.post('/shop/guest-cart', {parsedGuestCart},
                { headers: { "Authorization": token } });

            if (response) {
                localStorage.removeItem('guestCart');
                console.log(response);
                displayCartItems(response.data.mergedCart.cart.items)
            }

        }
        else {
            const cartItems = await axios.get('/shop/cart', { headers: { "Authorization": token } });
            displayCartItems(cartItems.data.cart);
        }

    }
}

function displayProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
                    <h2>${product.name}</h2>
                    <p>${product.category}</p>
                    <button onclick="addToCart(${product.productId})">Add to Cart</button>
                `;
        productsContainer.appendChild(productDiv);
    });
}

async function addToCart(productId) {
    const Product = products.find(p => p.productId === productId);
    const guestCart = localStorage.getItem('guestCart');
    if (!user && (!localStorage.getItem('token'))) {
        if (guestCart) {
            const parsedGuestCart = JSON.parse(guestCart);
            const prodIndex = parsedGuestCart.findIndex(p => p.productId == productId);
            if (prodIndex >= 0) {
                const newQuantity = Number(parsedGuestCart[prodIndex].quantity) + 1;
                parsedGuestCart[prodIndex].quantity = newQuantity;
            }
            else {
                parsedGuestCart.push({ ...Product, quantity: 1 })
            }

            localStorage.setItem('guestCart', JSON.stringify(parsedGuestCart))
        }
        else {
            const guestCart = [];
            guestCart.push({ ...Product, quantity: 1 });
            localStorage.setItem('guestCart', JSON.stringify(guestCart))
        }

        alert('Product added to cart');
    }
    else {
        let token = localStorage.getItem('token')
        const productDetails = { id: Product.productId, name: Product.name, category: Product.category };
        const response = await axios.post('/shop/cart', productDetails, { headers: { "Authorization": token } });
        alert(response.data.message);
    }

}



function displayCartItems(cart) {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
                    <h2>${item.name}</h2>
                    <p>${item.category}</p>
                    <p>Quantity: <input type="number" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)"></p>
                    <button onclick="deleteFromCart(${item.productId})">Delete</button>
                `;
        cartContainer.appendChild(itemDiv);
    });
}

function updateQuantity(productId, quantity) {
    const product = cart.find(p => p.productId === productId);
    product.quantity = quantity;
}

async function deleteFromCart(productId) {
    if (!user && !localStorage.getItem('token')) {
        const guestCart = localStorage.getItem('guestCart');
        updatedGuestCart = JSON.parse(guestCart).filter(p => p.productId != productId)
        displayCartItems(updatedGuestCart);
        alert("Selected item has been deleted");
        localStorage.setItem('guestCart', JSON.stringify(updatedGuestCart));
    }
    else {
        const token = localStorage.getItem('token');
        console.log(productId)
        const response = await axios.delete(`/shop/cart/${productId}`, {
            headers: { "Authorization": token }
        });
        if(response){
            displayCartItems(response.data.updatedCart);
            alert("Selected item has been deleted");
        }
        
    }

}


function updateNavBtns() {
    const authLinks = document.getElementById('authlinks');
    if (user) {
        authLinks.innerHTML = `<button id="navbtns" href="#" onclick="signOutUser()"><b>Logout</b></button>
                <button id="navbtns" href="#" onclick="showCart()"><b>Cart</b></button>`;
    } else {
        authLinks.innerHTML = `
        <button id="navbtns" href="#" onclick="showSignUp()"><b>Sign Up</b></button>
        <button id="navbtns" href="#" onclick="showSignIn()"><b>Login</b></button>
        <button id="navbtns" href="#" onclick="showCart()"><b>Cart</b></button>`;
    }
}



function signIn(e) {
    e.preventDefault();
    const { email, password } = e.target;

    loginDetails = {
        email: email.value,
        password: password.value
    }

    axios.post(`user/sign-in`, loginDetails)
        .then((res) => {

            if (res.status == 200) {
                localStorage.setItem('token', res.data.token)
                alert(res.data.message);
                user = localStorage.getItem('token');
                updateNavBtns()
                showCart();
            }
            else {
                throw new Error('failed to login')
            }
        })
        .catch(err => {
            handleError(e.target, err.response.data.error);
        })
}




function signUp(e) {
    e.preventDefault();

    const { username, email, password } = e.target;

    const signupDetails = {
        username: username.value,
        email: email.value,
        password: password.value,
    }

    axios.post(`user/sign-up`, signupDetails)
        .then((res) => {
            if (res.status == 201) {
                showSignIn();
            }
            else {
                throw new Error('failed to login')
            }
        })
        .catch(err => {
            handleError(e.target, err.response.data.error);
        })
}


function handleError(target, error) {
    const existingErrorMessages = target.querySelectorAll('p');
    existingErrorMessages.forEach((errMessage) => {
        if (errMessage.id === 'errorMessage') {
            errMessage.remove();
        }
    });

    let errMessage = document.createElement('p');
    errMessage.id = 'errorMessage';
    errMessage.innerHTML = error;
    errMessage.style.color = 'red';
    errMessage.style.textDecoration = 'underline'
    target.append(errMessage);
}

function checkout() {
    if (!user && !localStorage.getItem('token')) {
        alert('Please sign in to proceed');
        showSignIn();
    } else {
        alert('Proceeding to checkout');
        //checkout logic here
    }
}


function signOutUser() {
    localStorage.removeItem('token');
    user = null;
    document.getElementById('cart-items').innerHTML = '';
    updateNavBtns();
    showHome()
}

showHome(); // Initialize with home page
