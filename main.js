function createProductElement(product) {
    return `
        <div class="product">
            <img src="${product.image}">
            <div class="box">
                <span class="title">${product.title}</span>
                <span class="price">$${product.price}</span>
                <div class="buttons">
                    <button class="CartBtn">
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
        json.forEach(product => {
            const productHTML = createProductElement(product)
            itemsContainer.innerHTML += productHTML
        })
    })
