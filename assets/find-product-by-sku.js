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

    fetch(window.Shopify.routes.root + 'products/' + findValue + '.js')
      .then(response => {
        return response.json()
      })
      .then(data => {
        title.innerHTML = capitalizeFirstLetter(data.title);
        description.innerHTML = data.description;
        price.innerHTML = (data.price / 100).toFixed(2) + ' zl PLN';
        image.setAttribute("src", data.images[0]);
        error.innerHTML = ""
      })
      .catch((err) => {
        console.error('Error:', err);
        error.innerHTML = "Incorrect product code. Please try again";
        title.innerHTML = "";
        description.innerHTML = "";
        price.innerHTML = "";
        image.setAttribute("src", "");
      });
  })
})