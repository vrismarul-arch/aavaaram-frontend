import { useEffect, useState } from "react";
import API from "../../services/api";
import "./ProductUpload.css";

export default function ProductUpload() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);   // ✅ NEW

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    ingredients: "",
    usage: "",
    weight: "",
    dimensions: "",
    bestSeller: false,
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // ✅ CREATE + UPDATE
  const saveProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("ingredients", form.ingredients);
      formData.append("usage", form.usage);
      formData.append("weight", form.weight);
      formData.append("dimensions", form.dimensions);
      formData.append("bestSeller", form.bestSeller);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editId) {
        await API.put(`/products/${editId}`, formData);  // ✅ UPDATE
      } else {
        await API.post("/products", formData);           // ✅ CREATE
      }

      setOpen(false);
      setEditId(null);

      setForm({
        name: "",
        price: "",
        category: "",
        description: "",
        ingredients: "",
        usage: "",
        weight: "",
        dimensions: "",
        bestSeller: false,
      });

      setImageFile(null);
      fetchProducts();

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  const deleteProduct = async (id) => {
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="admin-page">

      <div className="page-header">
        <h2>📦 Products</h2>
        <button
          className="add-btn"
          onClick={() => {
            setEditId(null);
            setOpen(true);
          }}
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Weight</th>
            <th>Dimensions</th>
            <th>Best</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, index) => (
            <tr key={p._id}>
              <td>{index + 1}</td>
              <td>
                {p.image && (
                  <img src={p.image} className="table-img" alt="" />
                )}
              </td>
              <td>{p.name}</td>
              <td>₹ {p.price}</td>
              <td>{p.category?.name}</td>
              <td>{p.weight}</td>
              <td>{p.dimensions}</td>
              <td>{p.bestSeller ? "✔" : "-"}</td>
              <td>
                {/* ✅ EDIT BUTTON */}
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditId(p._id);
                    setForm({
                      name: p.name,
                      price: p.price,
                      category: p.category?._id,
                      description: p.description,
                      ingredients: p.ingredients,
                      usage: p.usage,
                      weight: p.weight,
                      dimensions: p.dimensions,
                      bestSeller: p.bestSeller,
                    });
                    setOpen(true);
                  }}
                >
                  ✏
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(p._id)}
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DRAWER */}
      {open && (
        <div
          className="drawer-overlay"
          onClick={() => setOpen(false)}
        >
          <div
            className="drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <h3>{editId ? "Edit Product" : "Add Product"}</h3>
              <button
                className="close-btn"
                onClick={() => setOpen(false)}
              >
                ✖
              </button>
            </div>

            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <textarea
              placeholder="Ingredients"
              value={form.ingredients}
              onChange={(e) =>
                setForm({ ...form, ingredients: e.target.value })
              }
            />

            <textarea
              placeholder="Usage"
              value={form.usage}
              onChange={(e) =>
                setForm({ ...form, usage: e.target.value })
              }
            />

            <input
              placeholder="Weight"
              value={form.weight}
              onChange={(e) =>
                setForm({ ...form, weight: e.target.value })
              }
            />

            <input
              placeholder="Dimensions"
              value={form.dimensions}
              onChange={(e) =>
                setForm({ ...form, dimensions: e.target.value })
              }
            />

            <input type="file" onChange={handleFileChange} />

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.bestSeller}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bestSeller: e.target.checked,
                  })
                }
              />
              Best Seller
            </label>

            <div className="drawer-actions">
              <button onClick={saveProduct}>
                {editId ? "Update" : "Save"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}