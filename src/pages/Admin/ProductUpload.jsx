// ProductUpload.jsx
import { useEffect, useState, useRef } from "react";
import { FiMoreVertical, FiX, FiImage, FiUpload, FiChevronDown, FiSearch } from "react-icons/fi";
import API from "../../services/api";
import "./ProductUpload.css";

const HEALTH_TYPES = [
  { value: "health", label: "Health Supplement" },
  { value: "bestseller", label: "Best Seller" },
  { value: "combo", label: "Combo" },
];

/* ── Multi-select dropdown component ── */
function MultiSelect({ options, selected, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (value) => {
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
    );
  };

  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label);

  return (
    <div className="multi-select" ref={ref}>
      <div className="multi-select-trigger" onClick={() => setOpen(!open)}>
        <div className="multi-select-values">
          {selectedLabels.length === 0 ? (
            <span className="multi-placeholder">{placeholder}</span>
          ) : (
            selectedLabels.map((label) => (
              <span key={label} className="multi-tag">
                {label}
                <FiX
                  size={10}
                  onClick={(e) => {
                    e.stopPropagation();
                    const val = options.find((o) => o.label === label)?.value;
                    if (val) toggle(val);
                  }}
                />
              </span>
            ))
          )}
        </div>
        <FiChevronDown className={`multi-arrow ${open ? "open" : ""}`} />
      </div>

      {open && (
        <div className="multi-dropdown">
          {options.map((opt) => (
            <label key={opt.value} className="multi-option">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductUpload() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen]             = useState(false);
  const [editId, setEditId]         = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);
  const [success, setSuccess]       = useState(null);
  
  // ── Search / Filter States ──
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");

  const [form, setForm] = useState({
    name:             "",
    price:            "",
    categories:       [],
    healthTypes:      [],
    shortDescription: "",
    description:      "",
    ingredients:      "",
    usage:            "",
    disclaimer:       "",
    weight:           "",
    dimensions:       "",
    bestSeller:       false,
  });

  // Image states
  const [mainImage,          setMainImage]          = useState(null);
  const [mainImagePreview,   setMainImagePreview]   = useState(null);
  const [subImages,          setSubImages]          = useState([]);
  const [subImagesPreviews,  setSubImagesPreviews]  = useState([]);
  const [existingSubImages,  setExistingSubImages]  = useState([]);

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      showError("Failed to fetch products: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const showError   = (msg) => { setError(msg);   setTimeout(() => setError(null),   3500); };
  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3500); };

  /* ── Filtered Products Logic ── */
  const getFilteredProducts = () => {
    let filtered = [...products];
    
    // Search by name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(query));
    }
    
    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(p => {
        const productCats = p.categories?.length 
          ? p.categories.map(c => c._id || c) 
          : (p.category ? [p.category?._id || p.category] : []);
        return productCats.includes(filterCategory);
      });
    }
    
    // Filter by health type
    if (filterType) {
      filtered = filtered.filter(p => {
        const productTypes = p.healthTypes?.length 
          ? p.healthTypes 
          : (p.healthType ? [p.healthType] : []);
        return productTypes.includes(filterType);
      });
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilterCategory("");
    setFilterType("");
  };

  /* ── Image handlers ── */
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setMainImage(file); setMainImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSubImages(prev => [...prev, ...files]);
      setSubImagesPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeSubImage = (i) => {
    URL.revokeObjectURL(subImagesPreviews[i]);
    setSubImages(prev => prev.filter((_, idx) => idx !== i));
    setSubImagesPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingSubImage = (i) => setExistingSubImages(prev => prev.filter((_, idx) => idx !== i));

  const removeMainImage = () => {
    if (mainImagePreview && !mainImagePreview.startsWith("http")) URL.revokeObjectURL(mainImagePreview);
    setMainImage(null);
    setMainImagePreview(null);
  };

  /* ── Validation ── */
  const validateForm = () => {
    if (!form.name.trim())                   return "Product name is required";
    if (!form.price || form.price <= 0)      return "Valid price is required";
    if (form.categories.length === 0)        return "Please select at least one category";
    if (form.healthTypes.length === 0)       return "Please select at least one type";
    if (!form.description.trim())            return "Description is required";
    if (!editId && !mainImage && !mainImagePreview) return "Main product image is required";
    return null;
  };

  /* ── Save / Update ── */
  const saveProduct = async () => {
    const validationError = validateForm();
    if (validationError) { showError(validationError); return; }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();

      const scalarKeys = ["name","price","shortDescription","description","ingredients","usage","disclaimer","weight","dimensions"];
      scalarKeys.forEach((key) => {
        if (form[key] !== undefined && form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });
      formData.append("bestSeller", form.bestSeller ? "true" : "false");

      formData.append("categories",  JSON.stringify(form.categories));
      formData.append("healthTypes", JSON.stringify(form.healthTypes));

      formData.append("category",   form.categories[0] || "");
      formData.append("healthType", form.healthTypes[0] || "health");

      if (mainImage) formData.append("mainImage", mainImage);
      subImages.forEach((img) => formData.append("subImages", img));
      if (existingSubImages.length > 0)
        formData.append("existingSubImages", JSON.stringify(existingSubImages));

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editId) {
        await API.put(`/products/${editId}`, formData, config);
        showSuccess("Product updated successfully!");
      } else {
        await API.post("/products", formData, config);
        showSuccess("Product created successfully!");
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      console.error("Save error:", err);
      showError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  /* ── Reset ── */
  const resetForm = () => {
    setOpen(false);
    setEditId(null);
    if (mainImagePreview && !mainImagePreview.startsWith("http")) URL.revokeObjectURL(mainImagePreview);
    subImagesPreviews.forEach(p => { if (p && !p.startsWith("http")) URL.revokeObjectURL(p); });
    setMainImage(null); setMainImagePreview(null);
    setSubImages([]); setSubImagesPreviews([]); setExistingSubImages([]);
    setForm({ name:"", price:"", categories:[], healthTypes:[], shortDescription:"", description:"", ingredients:"", usage:"", disclaimer:"", weight:"", dimensions:"", bestSeller:false });
  };

  /* ── Delete ── */
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      showSuccess("Product deleted successfully!");
      await fetchProducts();
      setActiveMenu(null);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete product");
    }
  };

  /* ── Edit ── */
  const editProduct = (product) => {
    setEditId(product._id);
    setForm({
      name:             product.name             || "",
      price:            product.price            || "",
      categories:       product.categories?.length ? product.categories.map(c => c._id || c) : (product.category ? [product.category?._id || product.category] : []),
      healthTypes:      product.healthTypes?.length ? product.healthTypes : (product.healthType ? [product.healthType] : []),
      shortDescription: product.shortDescription || "",
      description:      product.description      || "",
      ingredients:      product.ingredients      || "",
      usage:            product.usage            || "",
      disclaimer:       product.disclaimer       || "",
      weight:           product.weight           || "",
      dimensions:       product.dimensions       || "",
      bestSeller:       product.bestSeller       || false,
    });

    const mainImg = product.mainImage || product.image;
    if (mainImg) setMainImagePreview(mainImg);
    if (product.subImages?.length > 0) setExistingSubImages(product.subImages);

    setOpen(true);
    setActiveMenu(null);
  };

  const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }));

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>📦 Products</h2>
        <button className="add-btn" onClick={() => { resetForm(); setOpen(true); }}>
          + Add Product
        </button>
      </div>

      {error   && <div className="error-message">⚠️ {error}</div>}
      {success && <div className="success-message">✓ {success}</div>}

      {/* ─── SEARCH & FILTER BAR ─── */}
      <div className="filter-bar">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
              <FiX />
            </button>
          )}
        </div>

        <div className="filter-group">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            {HEALTH_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {(searchQuery || filterCategory || filterType) && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* ─── RESULTS SUMMARY ─── */}
      <div className="results-summary">
        <span>
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          {(searchQuery || filterCategory || filterType) && " (filtered)"}
        </span>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th><th>Image</th><th>Name</th><th>Price</th>
                <th>Categories</th><th>Types</th><th>Weight</th><th>Best</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    {searchQuery || filterCategory || filterType 
                      ? "No products match your search criteria" 
                      : "No products found"}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>
                      {(product.mainImage || product.image) && (
                        <img
                          src={product.mainImage || product.image}
                          className="table-img"
                          alt={product.name}
                          onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                        />
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>₹ {Number(product.price).toLocaleString()}</td>
                    <td>
                      {product.categories?.length
                        ? product.categories.map(c => c.name || c).join(", ")
                        : product.category?.name || "—"}
                    </td>
                    <td>
                      {product.healthTypes?.length
                        ? product.healthTypes.map(t => HEALTH_TYPES.find(h => h.value === t)?.label || t).join(", ")
                        : HEALTH_TYPES.find(h => h.value === product.healthType)?.label || "—"}
                    </td>
                    <td>{product.weight || "-"}</td>
                    <td>{product.bestSeller ? "✓" : "✗"}</td>
                    <td className="action-cell">
                      <button
                        className="three-dot-btn"
                        onClick={() => setActiveMenu(activeMenu === product._id ? null : product._id)}
                      >
                        <FiMoreVertical />
                      </button>
                      {activeMenu === product._id && (
                        <div className="action-dropdown">
                          <p onClick={() => editProduct(product)}>Edit</p>
                          <p className="delete-text" onClick={() => deleteProduct(product._id)}>Delete</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── DRAWER ─── (unchanged) */}
      {open && (
        <div className="drawer-overlay" onClick={resetForm}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>{editId ? "Edit Product" : "Add Product"}</h3>
              <button className="close-btn" onClick={resetForm}>✖</button>
            </div>

            <div className="drawer-content">
              <div className="image-section">
                <label>Main Image *</label>
                {mainImagePreview ? (
                  <div className="main-image-preview">
                    <img src={mainImagePreview} alt="Main preview" />
                    <button className="remove-image-btn" onClick={removeMainImage}><FiX /></button>
                  </div>
                ) : (
                  <div className="image-upload-area">
                    <input type="file" accept="image/*" onChange={handleMainImageChange} id="mainImage" style={{ display:"none" }} />
                    <label htmlFor="mainImage" className="upload-btn"><FiImage /> Choose Main Image</label>
                  </div>
                )}
              </div>

              <div className="image-section">
                <label>Sub Images (Optional)</label>
                {existingSubImages.length > 0 && (
                  <div className="sub-images-grid">
                    {existingSubImages.map((img, idx) => (
                      <div key={`ex-${idx}`} className="sub-image-item">
                        <img src={img} alt={`Sub ${idx+1}`} />
                        <button onClick={() => removeExistingSubImage(idx)} className="remove-sub-btn"><FiX /></button>
                      </div>
                    ))}
                  </div>
                )}
                {subImagesPreviews.length > 0 && (
                  <div className="sub-images-grid">
                    {subImagesPreviews.map((preview, idx) => (
                      <div key={`new-${idx}`} className="sub-image-item">
                        <img src={preview} alt={`Sub ${idx+1}`} />
                        <button onClick={() => removeSubImage(idx)} className="remove-sub-btn"><FiX /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="image-upload-area">
                  <input type="file" accept="image/*" multiple onChange={handleSubImagesChange} id="subImages" style={{ display:"none" }} />
                  <label htmlFor="subImages" className="upload-btn secondary"><FiUpload /> Add Sub Images</label>
                </div>
              </div>

              <input
                placeholder="Product Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="number"
                placeholder="Price *"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />

              <div className="field-group">
                <label className="field-label">Categories * <span className="field-hint">(select one or more)</span></label>
                <MultiSelect
                  options={categoryOptions}
                  selected={form.categories}
                  onChange={(val) => setForm({ ...form, categories: val })}
                  placeholder="Select categories..."
                />
              </div>

              <div className="field-group">
                <label className="field-label">Product Type * <span className="field-hint">(select one or more)</span></label>
                <MultiSelect
                  options={HEALTH_TYPES}
                  selected={form.healthTypes}
                  onChange={(val) => setForm({ ...form, healthTypes: val })}
                  placeholder="Select types..."
                />
              </div>

              <textarea placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} rows="2" />
              <textarea placeholder="Description *"     value={form.description}      onChange={(e) => setForm({ ...form, description: e.target.value })}      rows="4" />
              <textarea placeholder="Ingredients"       value={form.ingredients}      onChange={(e) => setForm({ ...form, ingredients: e.target.value })}      rows="3" />
              <textarea placeholder="Usage"             value={form.usage}            onChange={(e) => setForm({ ...form, usage: e.target.value })}            rows="3" />
              <textarea placeholder="Disclaimer"        value={form.disclaimer}       onChange={(e) => setForm({ ...form, disclaimer: e.target.value })}       rows="2" />

              <input placeholder="Weight (e.g., 500g)"       value={form.weight}     onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              <input placeholder="Dimensions (e.g., 10x10x5)" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} />

              <label className="checkbox-row">
                <input type="checkbox" checked={form.bestSeller} onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })} />
                Best Seller
              </label>
            </div>

            <div className="drawer-actions">
              <button onClick={saveProduct} disabled={saving}>
                {saving ? (editId ? "Updating..." : "Saving...") : (editId ? "Update" : "Save")}
              </button>
              <button className="cancel-btn" onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}