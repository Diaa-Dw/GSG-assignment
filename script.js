const productContainer = document.querySelector(".products-container");
const categoryFilter = document.querySelector(".category-filter");
let productsData = [];

/*
Fetches product data from the Fake Store API and stores it in the productsData array.
 Returns the fetched data for further use.
*/
const fetchProducts = async () => {
  try {
    const res = await fetch(`https://fakestoreapi.com/products`);
    if (res.status !== 200) {
      throw new Error(`Somthing went wrong while fetching data.`);
    }
    const data = await res.json();
    console.log("🚀 ~ fetchProducts ~ res:", res);
    productsData = data;
    return data;
  } catch (err) {
    console.log(err);
  }
};

/*
Fetches the product categories from the Fake Store API.
Returns an array of category names.
 */
const fetchCategories = async () => {
  try {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    const categories = await res.json();
    return categories;
  } catch (err) {
    alert(err);
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/*set all type of categories as option in dropdown element*/
const setCategories = async () => {
  try {
    const categories = await fetchCategories();
    categories.unshift("all");
    const categoryOptions = categories
      .map(
        (category) => `
          <option value=${category}>${capitalizeFirstLetter(category)}</option>
        
        `
      )
      .join("");

    categoryFilter.innerHTML = categoryOptions;
  } catch (err) {
    alert(err);
  }
};

/*
Updates the product container's inner HTML with the given product items.
*/
const updateProductItems = (items) => {
  productContainer.innerHTML = items;
};

/*
Generates the HTML for product items based on the provided data.
*/
const generateProductHTML = (data) => {
  const productItems = data
    .map(
      (item) => `
         <div class="product-item">
        <img
          src=${item.image}
          alt=${item.title}
        />
        <h3>${item.title}</h3>
        <div class="item-content">
            <p class="price">${item.price}$</p>
        </div>
      </div>
      `
    )
    .join("");

  return productItems;
};
/*
Fetches products, displays a loading indicator, and updates the product items on the page.
*/
const getProducts = async () => {
  try {
    productContainer.innerHTML = "<span class='loader'></span>";
    const data = await fetchProducts();
    const productItems = generateProductHTML(data);
    updateProductItems(productItems);
  } catch (err) {
    console.log(err);
  }
};

// Event listener for category filter change
categoryFilter.addEventListener("change", (e) => {
  console.log(e.target.value);
  let filteredProduct;
  if (e.target.value === "all") {
    filteredProduct = productsData;
  } else {
    filteredProduct = productsData
      .slice()
      .filter((item) => item.category.split(" ")[0] === e.target.value);
    console.log(
      "🚀 ~ categoryFilter.addEventListener ~ filteredProduct:",
      productsData
    );
  }
  const productItems = generateProductHTML(filteredProduct);
  updateProductItems(productItems);
});

// Initialize the app by fetching products and categories
getProducts();
setCategories();
