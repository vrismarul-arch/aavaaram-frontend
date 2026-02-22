import { useEffect, useState } from "react";
import API from "../../services/api";
import "./CategoryUpload.css";

export default function CategoryUpload() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ================= SAVE / UPDATE ================= */
  const saveCategory = async () => {
    if (!form.name) return alert("Category name required");

    const formData = new FormData();
    formData.append("name", form.name);
    if (imageFile) formData.append("image", imageFile);

    if (editId) {
      await API.put(`/categories/${editId}`, formData);
    } else {
      await API.post("/categories", formData);
    }

    setOpen(false);
    setEditId(null);
    setForm({ name: "" });
    setImageFile(null);
    setPreview("");
    fetchCategories();
  };

  /* ================= EDIT ================= */
  const editCategory = (category) => {
    setEditId(category._id);
    setForm({ name: category.name });
    setPreview(category.image);
    setOpen(true);
  };

  /* ================= DELETE ================= */
  const removeCategory = async (id) => {
    await API.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="admin-page">

      <div className="page-header">
        <h2>📂 Categories</h2>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Add Category
        </button>
      </div>

      {/* TABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c, i) => (
            <tr key={c._id}>
              <td>{i + 1}</td>

              <td>
                {c.image && (
                  <img
                    src={c.image}
                    className="table-img"
                    alt=""
                  />
                )}
              </td>

              <td>{c.name}</td>

              <td className="action-buttons">
                <button
                  className="edit-btn"
                  onClick={() => editCategory(c)}
                >
                  ✏
                </button>

                <button
                  className="delete-btn"
                  onClick={() => removeCategory(c._id)}
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
              <h3>{editId ? "Edit Category" : "Add Category"}</h3>
              <button
                className="close-btn"
                onClick={() => setOpen(false)}
              >
                ✖
              </button>
            </div>

            <input
              placeholder="Category Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input type="file" onChange={uploadImage} />

            {preview && (
              <img src={preview} className="preview-img" alt="" />
            )}

            <div className="drawer-actions">
              <button className="btn-primary" onClick={saveCategory}>
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}