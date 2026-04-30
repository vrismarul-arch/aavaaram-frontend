// BannerLoader.jsx
import { useState, useEffect } from "react";
import "./BannerLoader.css";

export const BannerLoader = ({ isLoading, children }) => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowLoader(false), 300);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(true);
    }
  }, [isLoading]);

  return (
    <>
      {showLoader && (
        <div className="banner-loader-container">
          <div className="banner-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-tag"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
          <div className="loader-overlay">
            <div className="ad-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Loading amazing deals...</p>
          </div>
        </div>
      )}
      <div className={`banner-content-wrapper ${showLoader ? 'hidden' : 'visible'}`}>
        {children}
      </div>
    </>
  );
};

// Progress Bar Loader
export const ProgressLoader = ({ progress }) => {
  return (
    <div className="progress-loader">
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        >
          <div className="progress-glow"></div>
        </div>
      </div>
      <div className="progress-percentage">{progress}%</div>
    </div>
  );
};

// Skeleton Component
export const BannerSkeleton = () => {
  return (
    <div className="banner-skeleton-wrapper">
      <div className="skeleton-shimmer">
        <div className="skeleton-image-bg"></div>
        <div className="skeleton-content-overlay">
          <div className="skeleton-line skeleton-line-1"></div>
          <div className="skeleton-line skeleton-line-2"></div>
          <div className="skeleton-line skeleton-line-3"></div>
          <div className="skeleton-button-sm"></div>
        </div>
      </div>
    </div>
  );
};