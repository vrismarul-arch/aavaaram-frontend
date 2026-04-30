import { useEffect, useState } from "react";
import { FiMoreVertical, FiX } from "react-icons/fi";
import "./BannerUpload.css";

export default function BannerUpload() {
  const [banners, setBanners] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    link: "",
    order: 0,
    isActive: true,
  });
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState({
    desktop: null,
    mobile: null,
  });

  const API = import.meta.env.VITE_API_URL;

  const loadBanners = async () => {
    try {
      const res = await fetch(`${API}/api/banners`);
      const data = await res.json();
      setBanners(data.success ? data.data : data);
    } catch (error) {
      console.error("Error loading banners:", error);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      link: "",
      order: 0,
      isActive: true,
    });
    setDesktopFile(null);
    setMobileFile(null);
    setPreviewImages({ desktop: null, mobile: null });
    setEditingBanner(null);
  };

  const handleFileChange = (type, file) => {
    if (type === "desktop") {
      setDesktopFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages(prev => ({ ...prev, desktop: reader.result }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImages(prev => ({ ...prev, desktop: null }));
      }
    } else {
      setMobileFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages(prev => ({ ...prev, mobile: reader.result }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImages(prev => ({ ...prev, mobile: null }));
      }
    }
  };

  const uploadBanner = async () => {
    if (!desktopFile && !editingBanner) {
      alert("Desktop image is required");
      return;
    }
    if (!mobileFile && !editingBanner) {
      alert("Mobile image is required");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    
    if (desktopFile) formDataToSend.append("desktopImage", desktopFile);
    if (mobileFile) formDataToSend.append("mobileImage", mobileFile);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("subtitle", formData.subtitle);
    formDataToSend.append("link", formData.link);
    formDataToSend.append("order", formData.order);
    formDataToSend.append("isActive", formData.isActive);

    try {
      const url = editingBanner 
        ? `${API}/api/banners/${editingBanner._id}`
        : `${API}/api/banners`;
      
      const res = await fetch(url, {
        method: editingBanner ? "PUT" : "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        await loadBanners();
        setShowModal(false);
        resetForm();
      } else {
        const error = await res.json();
        alert(error.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading banner");
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      const res = await fetch(`${API}/api/banners/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadBanners();
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting banner");
    }
  };

  const editBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      link: banner.link || "",
      order: banner.order || 0,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setPreviewImages({
      desktop: banner.desktopImage,
      mobile: banner.mobileImage,
    });
    setShowModal(true);
    setActiveMenu(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Home Banners</h2>
        <button className="upload-btn" onClick={openAddModal}>
          + Add New Banner
        </button>
      </div>

      <div className="banner-grid">
        {banners.map((b) => (
          <div className="banner-card" key={b._id}>
            <div className="banner-images">
              <div className="desktop-preview">
                <span className="device-label">Desktop</span>
                <img src={b.desktopImage} alt={b.title || "Banner"} />
              </div>
              <div className="mobile-preview">
                <span className="device-label">Mobile</span>
                <img src={b.mobileImage} alt={b.title || "Banner"} />
              </div>
            </div>

            <div className="banner-info">
              {b.title && <h3>{b.title}</h3>}
              {b.subtitle && <p>{b.subtitle}</p>}
              {b.link && <a href={b.link} target="_blank">View Link</a>}
              <span className={`status ${b.isActive ? "active" : "inactive"}`}>
                {b.isActive ? "Active" : "Inactive"}
              </span>
              {b.order !== undefined && <span className="order">Order: {b.order}</span>}
            </div>

            <div className="action-wrapper">
              <button
                className="three-dot-btn"
                onClick={() => setActiveMenu(activeMenu === b._id ? null : b._id)}
              >
                <FiMoreVertical />
              </button>

              {activeMenu === b._id && (
                <div className="action-dropdown">
                  <button
                    className="dropdown-item"
                    onClick={() => editBanner(b)}
                  >
                    Edit
                  </button>
                  <button
                    className="dropdown-item delete-text"
                    onClick={() => {
                      deleteBanner(b._id);
                      setActiveMenu(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit Banner */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBanner ? "Edit Banner" : "Add New Banner"}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              {/* Desktop Image Upload */}
              <div className="upload-section">
                <label className="upload-label required">Desktop Image</label>
                <div className="image-preview-container">
                  {previewImages.desktop ? (
                    <div className="preview-box">
                      <img src={previewImages.desktop} alt="Desktop preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => handleFileChange("desktop", null)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-box">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("desktop", e.target.files[0])}
                      />
                      <span>Click to upload desktop image</span>
                      <small>(Recommended: 1920x1080px)</small>
                    </label>
                  )}
                </div>
              </div>

              {/* Mobile Image Upload */}
              <div className="upload-section">
                <label className="upload-label required">Mobile Image</label>
                <div className="image-preview-container">
                  {previewImages.mobile ? (
                    <div className="preview-box">
                      <img src={previewImages.mobile} alt="Mobile preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => handleFileChange("mobile", null)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-box">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("mobile", e.target.files[0])}
                      />
                      <span>Click to upload mobile image</span>
                      <small>(Recommended: 750x1334px)</small>
                    </label>
                  )}
                </div>
              </div>

              {/* Banner Details */}
              <div className="form-group">
                <label>Title (Optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter banner title"
                />
              </div>

              <div className="form-group">
                <label>Subtitle (Optional)</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Enter subtitle"
                />
              </div>

              <div className="form-group">
                <label>Link URL (Optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="Display order"
                  />
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button 
                className="submit-btn" 
                onClick={uploadBanner}
                disabled={loading}
              >
                {loading ? "Uploading..." : editingBanner ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {banners.length === 0 && (
        <div className="empty-state">
          <p>No banners yet. Click "Add New Banner" to get started.</p>
        </div>
      )}
    </div>
  );
}