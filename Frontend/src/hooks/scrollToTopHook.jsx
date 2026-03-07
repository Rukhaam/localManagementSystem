import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  // useLocation gives us the current URL path
  const { pathname } = useLocation();

  useEffect(() => {
    // Whenever the pathname changes, instantly scroll to the top left of the window
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use "smooth" if you want an animated scroll, but "instant" feels more like a real page load
    });
  }, [pathname]); // This effect runs every time the URL path changes

  // This component doesn't actually render any UI
  return null; 
}