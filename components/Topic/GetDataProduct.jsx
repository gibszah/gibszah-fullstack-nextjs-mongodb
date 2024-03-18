"use client";
const { useState } = require("react");

const ProductList = ({ products }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const handleUpdateProduct = async (id, action) => {
    try {
      await axios.put(`/api/notif/${id}?action=${action}`);

      if (action === "add") {
        setNotificationCount((prevCount) => prevCount + 1);
      } else if (action === "minus") {
        setNotificationCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>Stok: {product.stok}</p>

          <button onClick={() => handleUpdateProduct(product._id, "add")}>
            add
          </button>
          <button onClick={() => handleUpdateProduct(product._id, "minus")}>
            minus
          </button>
        </div>
      ))}

      <p>Count: {notificationCount}</p>
    </div>
  );
};

export default ProductList;
