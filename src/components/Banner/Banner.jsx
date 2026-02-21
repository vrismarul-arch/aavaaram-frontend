import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./Banner.css";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/api/banners`)
      .then(res => res.json())
      .then(setBanners);
  }, []);

  if (!banners.length) return null;

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3500 }}
      loop
      className="home-banner"
    >
      {banners.map((b) => (
        <SwiperSlide key={b._id}>
          <img
            src={b.image}

            alt="banner"
            className="home-banner-img"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
