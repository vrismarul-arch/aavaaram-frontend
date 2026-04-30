import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top on route change
export function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
}

// Smooth scroll to element
export const smoothScrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

// Get current scroll position
export const getScrollPosition = () => {
  return window.pageYOffset || document.documentElement.scrollTop;
};

// Check if scrolled to bottom
export const isScrolledToBottom = () => {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
};

// Check if scrolled to top
export const isScrolledToTop = () => {
  return window.scrollY === 0;
};