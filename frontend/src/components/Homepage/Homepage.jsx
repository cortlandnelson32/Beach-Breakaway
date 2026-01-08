import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSpotsThunk } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";
import './Homepage.css';

// Loading skeleton component
function SpotCardSkeleton() {
  return (
    <div className="spot-card-skeleton" style={{
      animation: 'pulse 1.5s ease-in-out infinite',
      backgroundColor: '#e0e0e0',
      borderRadius: '12px',
      height: '320px',
      width: '100%'
    }}>
      <div style={{
        height: '200px',
        backgroundColor: '#d0d0d0',
        borderRadius: '12px 12px 0 0'
      }} />
      <div style={{ padding: '12px' }}>
        <div style={{
          height: '16px',
          backgroundColor: '#d0d0d0',
          borderRadius: '4px',
          marginBottom: '8px'
        }} />
        <div style={{
          height: '16px',
          backgroundColor: '#d0d0d0',
          borderRadius: '4px',
          width: '60%'
        }} />
      </div>
    </div>
  );
}

function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Use specific selectors to avoid unnecessary re-renders
  const spots = useSelector((state) => state.spots.allSpots);
  const isLoading = useSelector((state) => state.spots.isLoading);
  const error = useSelector((state) => state.spots.error);

  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  // Memoize the navigation handler
  const goToSpot = useCallback((spotId) => {
    navigate(`/spots/${spotId}`);
  }, [navigate]);

  // Memoize the spots list to prevent unnecessary re-renders
  const spotsList = useMemo(() => {
    if (!spots || spots.length === 0) return [];
    return spots;
  }, [spots]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="spot-list">
        {[...Array(8)].map((_, i) => (
          <SpotCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: '#FF7F50'
      }}>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button 
          onClick={() => dispatch(getAllSpotsThunk())}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#FF7F50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show empty state
  if (spotsList.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#3E4D76'
      }}>
        <h2>No beach spots available yet</h2>
        <p style={{ marginTop: '10px', color: '#666' }}>
          Check back soon for amazing beach getaways!
        </p>
      </div>
    );
  }

  return (
    <div className="spot-list">
      {spotsList.map(spot => (
        <div 
          className="spots" 
          key={spot.id} 
          onClick={() => goToSpot(spot.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              goToSpot(spot.id);
            }
          }}
        >
          <SpotCard spot={spot} />
        </div>
      ))}
    </div>
  );
}

export default Homepage;
