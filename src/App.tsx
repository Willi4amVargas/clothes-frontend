import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState();

  const apiUrl = import.meta.env.VITE_API_URL;

  const getProducts = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NSwicHJvZmlsZSI6MiwiY29kZSI6IlVTUjAwNCIsInBhc3N3b3JkIjoidGVzdCIsImRlc2NyaXB0aW9uIjoidGVzdCIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJzdGF0dXMiOmZhbHNlLCJjcmVhdGVkX2F0IjoiMjAyNi0wNC0xNlQxOToxNjowMS4zMjdaIiwibG9naW5fYXR0ZW1wcyI6MCwiaWF0IjoxNzc3NTE1Nzk0LCJleHAiOjE3Nzc1MjI5OTR9.yz0hx82f0pp2H4Nnw4W2zPiV8QRAgHM6vWQPif3mgtg";
      const result = await fetch(apiUrl + "/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const products = await result.json();
      setProducts(products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div>
      {import.meta.env.VITE_API_URL}
      <ul>{products && products.map((p) => <li>{p.description}</li>)}</ul>
    </div>
  );
}

export default App;
