const button = document.querySelectorAll('.find-by-sku-submit');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

button.forEach(elem => {
  elem.addEventListener('click', function (e) {
    e.preventDefault();
    const findValue = elem.closest(".section-find-product").querySelector('.find-by-sku').value;
    const title = elem.closest(".section-find-product").querySelector('.product-search__title');
    const description = elem.closest(".section-find-product").querySelector('.product-search__description');
    const price = elem.closest(".section-find-product").querySelector('.product-search__price');
    const image = elem.closest(".section-find-product").querySelector('.product-search__image');
    const error = elem.closest(".section-find-product").querySelector('.product-search__error');

    fetch(window.Shopify.routes.root + 'products.json')
      .then(response => {
        return response.json()
      })
      .then(data => {
        let searchItem = findValue;

        function findBySku(acc, el) {
          if (el.sku === searchItem) return el;
          if (el.variants) return el.variants.reduce(findBySku, acc);
          return acc;
        }
        let element = data.products.reduce(findBySku, null)

        function findParent(acc, el) {
          if (el.variants && el.variants.some(child => child === element)) return el;
          if (el.variants) return el.variants.reduce(findParent, acc);
          return acc;
        }
        let parent = data.products.reduce(findParent, null);

        if (parent === null) {
          error.innerHTML = "Incorrect product code. Please try again";
          title.innerHTML = "";
          description.innerHTML = "";
          price.innerHTML = "";
          image.setAttribute("src", "");
        } else {
          title.innerHTML = capitalizeFirstLetter(parent.title);
          description.innerHTML = parent.body_html;
          price.innerHTML = element.price + ' zl PLN';
          image.setAttribute("src", parent.images[0].src);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
})