import { useState, useEffect, useRef, memo } from "react";
import { FaStar } from 'react-icons/fa';
import './SpotCard.css';

function SpotCard({ spot }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Format rating to always show one decimal
  const formatRating = (rating) => {
    if (!rating) return "New";
    return Number(rating).toFixed(1);
  };

  // Format price with proper comma separation
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('$', '');
  };

  const avgRating = formatRating(spot.avgRating);
  const formattedPrice = formatPrice(spot.price);

  return (
    <article 
      className="spot-card-container" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      aria-label={`${spot.name} in ${spot.city}, ${spot.state}`}
    >
      <div className="spot-card">
        <div className="spot-image-container">
          {!imageLoaded && !imageError && (
            <div className="image-skeleton" aria-label="Loading image" />
          )}
          <img 
            className={`spot-image ${imageLoaded ? 'loaded' : ''}`}
            src={spot.previewImage} 
            alt={`${spot.name} - ${spot.city}, ${spot.state}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
          {imageError && (
            <div className="image-error">
              <span>📷</span>
              <p>Image unavailable</p>
            </div>
          )}
          <div className={`tooltip ${showTooltip ? 'show' : 'hide'}`} role="tooltip">
            {spot.name}
          </div>
        </div>
      </div>
      
      <div className="spot-data">
        <div className="left-panel">
          <div className="location">
            <span className="location-text">{spot.city}, {spot.state}</span>
          </div>
          <div className="price">
            <span className="price-amount">${formattedPrice}</span>
            <span className="price-period"> / night</span>
          </div>
        </div>
        <div className="right-panel">
          <div className="rating">
            <FaStar className="star" aria-hidden="true" />
            <span className="rating-value">{avgRating}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// Memoize to prevent unnecessary re-renders
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.spot.id === nextProps.spot.id &&
    prevProps.spot.avgRating === nextProps.spot.avgRating &&
    prevProps.spot.previewImage === nextProps.spot.previewImage &&
    prevProps.spot.price === nextProps.spot.price
  );
};

const MemoizedSpotCard = memo(SpotCard, arePropsEqual);

export default MemoizedSpotCard;
