let variantId
const url = window.location.href
const variantIdFromUrl = url.split("?variant=")[1]
const itemCount = document.querySelectorAll('.cart-count-bubble > span')

if (variantIdFromUrl) {
  variantId = variantIdFromUrl
} else {
  variantId = variantIdGlobal;
  variantId = variantId.toString()
}

function updateCartQuantity(data) {
  itemCount.forEach(elem => {
    elem.innerHTML = data.item_count
  })
  let element = data.items.find(elem => elem.variant_id == variantId)
  if (element) {
    changeQuantity.forEach(elem => {
      elem.value = element.quantity
      elem.classList.remove('disabled')
    })
  } else {
    changeQuantity.forEach(elem => {
      elem.value = 0
      elem.classList.add('disabled')
    })
  }
}

function showMessage(response) {
  const successMessage = document.querySelectorAll('.cart-control .product-form__success-message')
  const errorMessage = document.querySelectorAll('.cart-control .product-form__error-message')
  if (response) {
    errorMessage.forEach(elem => {
      elem.classList.remove('hide')
    })
    setTimeout(() => {
      errorMessage.forEach(elem => {
        elem.classList.add('hide')
      })
    }, 2000);
  } else {
    successMessage.forEach(elem => {
      elem.classList.remove('hide')
    })
    setTimeout(() => {
      successMessage.forEach(elem => {
        elem.classList.add('hide')
      })
    }, 2000);
  }
}

function showQuantityMessage(response) {
  const successQuantityMessage = document.querySelectorAll('.cart-control .product-form__quantity-success-message')
  const errorMessage = document.querySelectorAll('.cart-control .product-form__error-message')
  if (response) {
    errorMessage.forEach(elem => {
      elem.classList.remove('hide')
    })
    setTimeout(() => {
      errorMessage.forEach(elem => {
        elem.classList.add('hide')
      })
    }, 2000);
  } else {
    successQuantityMessage.forEach(elem => {
      elem.classList.remove('hide')
    })
    setTimeout(() => {
      successQuantityMessage.forEach(elem => {
        elem.classList.add('hide')
      })
    }, 2000);
  }
}

function removeMessage() {
  const removeMessage = document.querySelectorAll('.cart-control .product-form__remove-message')
  removeMessage.forEach(elem => {
    elem.classList.remove('hide')
  })
  setTimeout(() => {
    removeMessage.forEach(elem => {
      elem.classList.add('hide')
    })
  }, 2000);
}

// Add to cart
const addToCart = document.querySelectorAll('.newAddToCart')
addToCart.forEach(elem => {
  elem.addEventListener('click', function (e) {
    e.preventDefault()

    let formData = {
      'items': [{
        'id': variantId,
        'quantity': 1
      }]
    };

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        return response.json();
      })
      .then((data) => {
        fetch(window.Shopify.routes.root + 'cart.js')
          .then(response => {
            return response.json();
          })
          .then(data => {
            updateCartQuantity(data);
          })
        showMessage(data.description)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
})

// Remove from cart
const removeFromCart = document.querySelectorAll('.removeFromCart')
removeFromCart.forEach(elem => {
  elem.addEventListener('click', function (e) {
    e.preventDefault()

    let formData = {
      'id': variantId,
      'quantity': 0
    };

    fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        return response.json();
      })
      .then(() => {
        fetch(window.Shopify.routes.root + 'cart.js')
          .then(response => {
            return response.json();
          })
          .then(data => {
            updateCartQuantity(data);
            removeMessage()
          })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
})

// Update quantity in cart
const changeQuantity = document.querySelectorAll('.changeQuantity > input');
window.onload = function () {
  fetch(window.Shopify.routes.root + 'cart.js', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      let element = data.items.find(elem => elem.variant_id == variantId)
      if (element) {
        changeQuantity.forEach(elem => {
          elem.value = element.quantity
        })
      } else {
        changeQuantity.forEach(elem => {
          elem.classList.add('disabled')
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

changeQuantity.forEach(elem => {
  elem.addEventListener('change', function (e) {
    e.preventDefault()
    elem.classList.add('disabled')
    elem.blur()
    let formData = {
      'id': variantId,
      'quantity': e.target.value
    };

    fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        return response.json();
      })
      .then(() => {
        fetch(window.Shopify.routes.root + 'cart.js')
          .then(response => {
            return response.json();
          })
          .then(data => {
            updateCartQuantity(data);
            if (variantInventoryManagement != "") {
              changeQuantity.forEach(elem => {
                if (variantInventoryQuantity == elem.value) {
                  showQuantityMessage(true)
                } else {
                  showQuantityMessage(false)
                }
              })
            } else {
              showQuantityMessage(false)
            }
          })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
})