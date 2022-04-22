let variantId
const url = window.location.href
const variantIdFromUrl = url.split("?variant=")[1]

if(variantIdFromUrl) {
  variantId = variantIdFromUrl
} else {
  variantId = variantIdGlobal;
  variantId = variantId.toString()
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
      .then(response => {
        location.reload()
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
      .then(response => {
        location.reload()
      })
      .catch((error) => {
        console.error('Error:', error);
    });
  })
})

// Update quantity in cart
const changeQuantity = document.querySelectorAll('.changeQuantity > input');
window.onload = function() {
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
  elem.addEventListener('change', function(e) {
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
            }
            elem.classList.remove('disabled')
          })
          .catch((error) => {
            console.error('Error:', error);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
    });
  })
})