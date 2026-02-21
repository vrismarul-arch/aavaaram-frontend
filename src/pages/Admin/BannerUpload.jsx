import { useEffect, useState } from "react";
import "./BannerUpload.css";

export default function BannerUpload() {
  const [banners, setBanners] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  const loadBanners = async () => {
    const res = await fetch(`${API}/api/banners`);
    setBanners(await res.json());
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const uploadNew = async (file, id = null) => {
    const formData = new FormData();
    formData.append("image", file);

    await fetch(
      `${API}/api/banners${id ? "/" + id : ""}`,
      {
        method: id ? "PUT" : "POST",
        body: formData,
      }
    );

    loadBanners();
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Delete banner?")) return;
    await fetch(`${API}/api/banners/${id}`, { method: "DELETE" });
    loadBanners();
  };

  return (
    <div className="admin-page">
      <h2>Home Banners</h2>

      <label className="upload-btn">
        + Upload Banner
        <input
          type="file"
          hidden
          onChange={(e) => uploadNew(e.target.files[0])}
        />
      </label>

      <div className="banner-grid">
        {banners.map((b) => (
          <div className="banner-card" key={b._id}>
            <img src={b.image} />


            <label className="edit-btn">
              Edit
              <input
                type="file"
                hidden
                onChange={(e) =>
                  uploadNew(e.target.files[0], b._id)
                }
              />
            </label>

            <button onClick={() => deleteBanner(b._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
