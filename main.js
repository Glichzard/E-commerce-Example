function createProductElement(product) {
    const wishlist = initWishlist()
    const checked = wishlist.includes(product.id)
    return `
        <div class="product">
            <img src="${product.image}" onclick="showInfo(${product.id})">
            <div class="box">
                <span class="title" onclick="showInfo(${product.id})">${product.title}</span>
                <div class="price-wishlist">
                    <span class="price">U$D ${product.price}</span>
                    <label class="ui-bookmark">
                        <div class="bookmark ${checked ? "checked" : ""}" data-product-id="${product.id}">
                            <i class="bi bi-bookmark-plus-fill" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Add to wishlist" data-bs-custom-class="custom-tooltip"></i>
                            <i class="bi bi-bookmark-dash-fill" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Remove from wishlist" data-bs-custom-class="custom-tooltip"></i>
                        </div>
                    </label>
                </div>
                <div class="buttons">
                    <button class="CartBtn" data-product-id="${product.id}">
                        <span class="IconContainer"> 
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="#FFF" class="cart">
                                <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                            </svg>
                        </span>
                        <span class="text">Add to Cart</span>
                    </button>
                    <button class="cta">
                        <span class="hover-underline-animation">Shop now</span>
                        <svg viewBox="0 0 46 16" height="10" width="30" xmlns="http://www.w3.org/2000/svg" fill="#FFF" id="arrow-horizontal">
                            <path transform="translate(30)" d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" data-name="Path 10" id="Path_10"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `
}

fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => {
        const itemsContainer = document.getElementById("items")
        itemsContainer.innerHTML = ""
        json.forEach(product => {
            const productHTML = createProductElement(product)
            itemsContainer.innerHTML += productHTML
        })

        document.querySelectorAll("#items .bookmark").forEach(element => {
            element.addEventListener("click", wishlistAction)
        })

        document.querySelectorAll("#items .CartBtn").forEach(element => {
            element.addEventListener("click", addToCart)
        })

        loadTooltips()
    })

function wishlistAction(item) {
    item.target.parentNode.classList.toggle("checked")
    const productId = parseInt(item.target.parentNode.getAttribute("data-product-id"))

    let wishlist = initWishlist()
    const findProduct = wishlist.includes(productId)

    if (!findProduct) {
        wishlist.push(productId)
    }

    if (findProduct) {
        wishlist = wishlist.filter(item => item !== productId)
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist))


    document.querySelectorAll(".bookmark").forEach(element => {
        const id = parseInt(element.getAttribute("data-product-id"))
        if (id != productId) return

        if (!findProduct) element.classList.add("checked")
        if (findProduct) element.classList.remove("checked")
    })
}

function addToCart(item) {
    const productId = parseInt(item.target.parentNode.getAttribute("data-product-id") || item.target.getAttribute("data-product-id"))

    const cart = initCart()

    const findProduct = cart.find(objeto => objeto.id === productId)

    if (!findProduct) {
        cart.push({ id: productId, count: 1, price: 0.0 })
    }

    const index = cart.findIndex(objeto => objeto.id === productId)
    if (findProduct) {
        cart[index].count += 1
    }

    localStorage.setItem("cart", JSON.stringify(cart))

    fetch('https://fakestoreapi.com/products/' + productId)
        .then(res => res.json())
        .then(json => {
            cart[index].price = json.price

            localStorage.setItem("cart", JSON.stringify(cart))
        })
}

function initWishlist() {
    if (localStorage.getItem("wishlist") == null) localStorage.setItem("wishlist", "[]")

    return JSON.parse(localStorage.getItem("wishlist"))
}

function initCart() {
    if (localStorage.getItem("cart") == null) localStorage.setItem("cart", "[]")

    return JSON.parse(localStorage.getItem("cart"))
}

function loadTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

function closeInfo() {
    const showInfoDiv = document.getElementById("showInfo")
    showInfoDiv.classList.remove("open")
}

var lastIdSelected = 0
function showInfo(productId) {
    const showInfoDiv = document.getElementById("showInfo")

    if (!showInfoDiv.classList.contains("open") || lastIdSelected == productId)
        showInfoDiv.classList.toggle("open")

    if (lastIdSelected != productId) {
        showInfoDiv.innerHTML = ""
        showInfoDiv.innerHTML = `
            <div class="product placeholder-glow">
                <div class="closeButton">
                    <i class="bi bi-x-lg" onclick="closeInfo()"></i>
                </div>
                <div class="productInfo">
                    <div class="img-placeholder placeholder"></div>
                    <div class="box">
                        <span class="title placeholder"></span>
                        <p class="placeholder">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui odio neque quidem ratione, ipsam voluptatum? Ut numquam maxime soluta itaque mollitia repudiandae doloremque nam, laborum inventore culpa similique eos eveniet?</p>
                        <div class="price-wishlist">
                            <span class="price placeholder col-2"></span>
                            <div class="wishlist-placeholder placeholder"></div>
                        </div>
                        <div class="buttons">
                            <button class="btn btn-secondary disabled placeholder" aria-disabled="true"></button>
                            <button class="btn btn-secondary disabled placeholder" aria-disabled="true"></button>    
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    fetch('https://fakestoreapi.com/products/' + productId)
        .then(res => res.json())
        .then(json => {
            if (lastIdSelected == productId) {
                const wishlist = initWishlist()
                const checked = wishlist.includes(productId)
                showInfoDiv.innerHTML = `
                        <div class="product">
                            <div class="closeButton">
                                <i class="bi bi-x-lg" onclick="closeInfo()"></i>
                            </div>
                            <div class="productInfo">
                                <img src="${json.image}">
                                <div class="box">
                                    <span class="title">${json.title}</span>
                                    <p>${json.description}</p>
                                    <div class="price-wishlist">
                                        <span class="price">U$D ${json.price}</span>
                                        <label class="ui-bookmark">
                                            <div class="bookmark ${checked ? "checked" : ""}" data-product-id="${json.id}">
                                                <i class="bi bi-bookmark-plus-fill" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Add to wishlist" data-bs-custom-class="custom-tooltip"></i>
                                                <i class="bi bi-bookmark-dash-fill" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Remove from wishlist" data-bs-custom-class="custom-tooltip"></i>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="buttons">
                                        <button class="CartBtn" data-product-id="${json.id}">
                                            <span class="IconContainer"> 
                                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="#FFF" class="cart">
                                                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                                                </svg>
                                            </span>
                                            <span class="text">Add to Cart</span>
                                        </button>
                                        <button class="cta">
                                            <span class="hover-underline-animation">Shop now</span>
                                            <svg viewBox="0 0 46 16" height="10" width="30" xmlns="http://www.w3.org/2000/svg" fill="#FFF" id="arrow-horizontal">
                                                <path transform="translate(30)" d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" data-name="Path 10" id="Path_10"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `

                document.querySelector("#showInfo .bookmark").addEventListener("click", wishlistAction)
                document.querySelector("#showInfo .CartBtn").addEventListener("click", addToCart)

                loadTooltips()
            }
        })

    lastIdSelected = productId
}

const offcanvasWishlist = document.getElementById('offcanvasWishlist')
offcanvasWishlist.addEventListener('show.bs.offcanvas', async (event) => {
    offcanvasWishlist.querySelector(".offcanvas-body").innerHTML = ""

    const wishlist = initWishlist()

    if (wishlist.length == 0) {
        offcanvasWishlist.querySelector(".offcanvas-body").innerHTML = `<span class="empty-msg">Nothing here...</span>`
        return
    }

    wishlist.forEach(index => {
        offcanvasWishlist.querySelector(".offcanvas-body").innerHTML += `
            <div class="product placeholder-glow" aria-hidden="true">
                <div class="img-placeholder placeholder"></div>
                <div class="box">
                    <span class="title placeholder"></span>
                    <div class="price-wishlist">
                        <span class="price placeholder col-2"></span>
                        <div class="wishlist-placeholder placeholder"></div>
                    </div>
                    <div class="buttons">
                        <button class="btn btn-secondary disabled placeholder" aria-disabled="true"></button>
                        <button class="btn btn-secondary disabled placeholder" aria-disabled="true"></button>
                    </div>
                </div>
            </div>
        `
    })

    async function getWishlistProducts(wishlist) {
        let products = ""

        for (const productId of wishlist) {
            const response = await fetch('https://fakestoreapi.com/products/' + productId)
            const json = await response.json()

            const checked = wishlist.includes(productId)

            products += `
                    <div class="product">
                        <img src="${json.image}" onclick="showInfo(${json.id})">
                        <div class="box">
                            <span class="title" onclick="showInfo(${json.id})">${json.title}</span>
                            <div class="price-wishlist">
                                <span class="price">U$D ${json.price}</span>
                                <label class="ui-bookmark">
                                    <div class="bookmark ${checked ? "checked" : ""}" data-product-id="${json.id}">
                                        <i class="bi bi-bookmark-plus-fill" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Add to wishlist" data-bs-custom-class="custom-tooltip"></i>
                                        <i class="bi bi-bookmark-dash-fill" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Remove from wishlist" data-bs-custom-class="custom-tooltip"></i>
                                    </div>
                                </label>
                            </div>
                            <div class="buttons">
                                <button class="CartBtn" data-product-id="${json.id}">
                                    <span class="IconContainer"> 
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="#FFF" class="cart">
                                            <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                                        </svg>
                                    </span>
                                    <span class="text">Add to Cart</span>
                                </button>
                                <button class="cta">
                                    <span class="hover-underline-animation">Shop now</span>
                                    <svg viewBox="0 0 46 16" height="10" width="30" xmlns="http://www.w3.org/2000/svg" fill="#FFF" id="arrow-horizontal">
                                        <path transform="translate(30)" d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" data-name="Path 10" id="Path_10"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                `
        }

        offcanvasWishlist.querySelector(".offcanvas-body").innerHTML = products
    }

    await getWishlistProducts(wishlist)
    document.querySelectorAll("#offcanvasWishlist .bookmark").forEach(element => {
        element.addEventListener("click", wishlistAction)
    })
    document.querySelectorAll("#offcanvasWishlist button.CartBtn").forEach(element => {
        element.addEventListener("click", addToCart)
    })
})

const offcanvasCart = document.getElementById('offcanvasCart')
offcanvasCart.addEventListener('show.bs.offcanvas', async event => {
    offcanvasCart.querySelector(".product-list").innerHTML = ""

    const cart = initCart()

    if (cart.length == 0) {
        offcanvasCart.querySelector(".product-list").innerHTML = `<span class="empty-msg">Nothing here...</span>`
        return
    }

    cart.forEach(index => {
        offcanvasCart.querySelector(".product-list").innerHTML += `
            <div class="product placeholder-glow" aria-hidden="true">
                <div class="img-placeholder placeholder"></div>
                <div class="box">
                    <span class="title placeholder"></span>
                    <div class="price-wishlist">
                        <span class="price placeholder col-2"></span>
                        <div class="wishlist-placeholder placeholder"></div>
                    </div>
                    <div class="buttons">
                        <button class="btn btn-secondary disabled placeholder" aria-disabled="true"></button>
                        <button class="btn btn-secondary disabled placeholder" aria-disabled="true"></button>
                    </div>
                </div>
            </div>
        `
    })

    async function getCartProducts(cart) {
        let products = ""

        for (const product of cart) {
            const response = await fetch('https://fakestoreapi.com/products/' + product.id)
            const json = await response.json()

            const productCount = cart.find(product => product.id === json.id)

            products += `
                    <div class="product" data-product-id="${product.id}">
                        <img src="${json.image}" onclick="showInfo(${json.id})">
                        <div class="box">
                            <div class="deleteBtn">
                                <button data-product-id="${json.id}">
                                    <i class="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <span class="title" onclick="showInfo(${json.id})">${json.title}</span>
                            <div class="price-wishlist">
                                <span class="price">U$D ${json.price}</span>
                            </div>
                            <div class="card__wrapper">
                                <div class="card__counter">
                                    <button class="card__btn card__btn-dash" data-product-id="${json.id}"><i class="bi bi-dash"></i></button>
                                    <div class="card__counter-score" data-product-id="${json.id}">${productCount.count}</div>
                                    <button class="card__btn card__btn-plus" data-product-id="${json.id}"><i class="bi bi-plus"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
        }

        offcanvasCart.querySelector(".product-list").innerHTML = products

        document.querySelectorAll("#offcanvasCart .card__btn-dash").forEach(e => {
            e.addEventListener("click", cartSubstractOne)
        })
        document.querySelectorAll("#offcanvasCart .card__btn-plus").forEach(e => {
            e.addEventListener("click", cartAddOne)
        })
        document.querySelectorAll("#offcanvasCart .deleteBtn").forEach(e => {
            e.addEventListener("click", deleteItemFromCart)
        })
    }

    calcSummary()
    await getCartProducts(cart)
})

function calcSummary() {
    const cart = initCart()

    let subtotal = 0.0

    cart.forEach(product => {
        for(let i = 0; i < product.count; i++) {
            subtotal += product.price
        }
    })

    subtotal = subtotal.toFixed(2)

    const tax = (subtotal * 0.05).toFixed(2)
    const shipping = 25.00
    
    let total = parseFloat(subtotal) + parseFloat(tax) + parseFloat(shipping)
    total = total.toFixed(2)

    document.querySelector("#offcanvasCart .summary .subtotal").innerText = "U$D " + subtotal    
    document.querySelector("#offcanvasCart .summary .tax").innerText = "U$D " + tax

    if(subtotal == 0) total = 0.00
    document.querySelector("#offcanvasCart .summary .total").innerText = "U$D " + total
}

function cartAddOne(element) {
    addToCart(element)

    const productId = parseInt(element.target.getAttribute("data-product-id") || element.target.parentNode.getAttribute("data-product-id"))
    updateCounter(productId)
}

function cartSubstractOne(element) {
    const productId = parseInt(element.target.getAttribute("data-product-id") || element.target.parentNode.getAttribute("data-product-id"))

    const cart = initCart()

    const findProduct = cart.find(objeto => objeto.id === productId)

    if (!findProduct) return

    const index = cart.findIndex(objeto => objeto.id === productId)

    if (cart[index].count <= 1) return

    cart[index].count -= 1

    localStorage.setItem("cart", JSON.stringify(cart))
    updateCounter(productId)
}

function updateCounter(productId) {
    const cart = initCart()

    const productCount = cart.find(product => product.id === productId)

    document.querySelector(`.card__counter-score[data-product-id="${productId}"]`).innerText = productCount.count

    calcSummary()
}

function deleteItemFromCart(element) {
    const productId = parseInt(element.target.getAttribute("data-product-id") || element.target.parentNode.getAttribute("data-product-id"))

    let cart = initCart()
    cart = cart.filter(item => item.id !== productId)

    localStorage.setItem("cart", JSON.stringify(cart))

    document.querySelector(`#offcanvasCart .product-list .product[data-product-id="${productId}"]`).remove()

    calcSummary()

    const itemList = document.querySelector(".product-list")
    if (itemList.children.length == 0) {
        itemList.innerHTML = `<span class="empty-msg">Nothing here...</span>`
    }
}

