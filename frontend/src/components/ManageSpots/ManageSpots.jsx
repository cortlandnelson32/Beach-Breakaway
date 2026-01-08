import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getMySpotsThunk } from "../../store/spots";
import { FaPen, FaTrashCan, FaPlus, FaChartLine, FaStar, FaDollarSign } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import SpotCard from "../SpotCard/SpotCard";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ConfirmDeleteModal from "./DeleteSpot";
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state) => state.session.user);
  const mySpots = useSelector((state) => state.spots.mySpots) || [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchSpots = async () => {
      try {
        setError(null);
        await dispatch(getMySpotsThunk());
      } catch (err) {
        setError('Failed to load your spots');
        console.error('Error fetching spots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, [dispatch, user, navigate]);

  const handleCreateNewSpot = useCallback(() => {
    navigate('/spots/new');
  }, [navigate]);

  const handleUpdateSpot = useCallback((e, spotId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/spots/${spotId}/edit`);
  }, [navigate]);

  const handleDeleteClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const goToSpot = useCallback((e, spotId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/spots/${spotId}`);
  }, [navigate]);

  const refreshSpots = useCallback(async () => {
    try {
      await dispatch(getMySpotsThunk());
    } catch (err) {
      console.error('Error refreshing spots:', err);
    }
  }, [dispatch]);

  // Calculate stats
  const totalSpots = mySpots.length;
  const avgRating = mySpots.length > 0
    ? (mySpots.reduce((sum, spot) => sum + (spot.avgRating || 0), 0) / mySpots.length).toFixed(1)
    : '0.0';
  const totalReviews = mySpots.reduce((sum, spot) => sum + (spot.numReviews || 0), 0);
  const avgPrice = mySpots.length > 0
    ? Math.round(mySpots.reduce((sum, spot) => sum + (spot.price || 0), 0) / mySpots.length)
    : 0;

  if (loading) {
    return (
      <div className="manage-spots-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading your spots...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-spots-container">
        <div className="error-state">
          <h2>⚠ {error}</h2>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-spots-container">
      {/* Show stats and listings when user has spots */}
      {mySpots.length > 0 ? (
        <>
          {/* Header with Stats */}
          <header className="manage-spots-header">
            <div className="header-content">
              <h1>Manage Your Spots</h1>
              <p className="header-subtitle">
                Welcome back, {user.firstName}! Here&apos;s your hosting overview.
              </p>
            </div>
            <button onClick={handleCreateNewSpot} className="create-button">
              <FaPlus />
              Create New Spot
            </button>
          </header>

          {/* Stats Dashboard */}
          <div className="stats-dashboard">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#e3f2fd' }}>
                <FaChartLine style={{ color: '#1976d2' }} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{totalSpots}</div>
                <div className="stat-label">Total Listings</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fff3e0' }}>
                <FaStar style={{ color: '#FF7F50' }} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{avgRating}</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#f3e5f5' }}>
                <FaCalendarAlt style={{ color: '#9c27b0' }} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{totalReviews}</div>
                <div className="stat-label">Total Reviews</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#e8f5e9' }}>
                <FaDollarSign style={{ color: '#388e3c' }} />
              </div>
              <div className="stat-content">
                <div className="stat-value">${avgPrice}</div>
                <div className="stat-label">Avg Price/Night</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button 
                className="action-btn"
                onClick={() => alert('Feature coming soon! You will be able to view your calendar.')}
              >
                <FaCalendarAlt />
                View Calendar
              </button>
              <button 
                className="action-btn"
                onClick={() => alert('Feature coming soon! You will be able to view insights and analytics.')}
              >
                <FaChartLine />
                View Insights
              </button>
              <button 
                className="action-btn"
                onClick={() => alert('Feature coming soon! You will be able to manage your bookings.')}
              >
                📅
                Manage Bookings
              </button>
            </div>
          </div>

          {/* Listings Section */}
          <section className="listings-section">
            <h2>Your Listings</h2>
            <div className="spots-grid">
              {mySpots.map(spot => (
                <article 
                  key={spot.id} 
                  className="spot-card-wrapper"
                  onClick={(e) => goToSpot(e, spot.id)}
                >
                  <SpotCard spot={spot} />
                  <div className="spot-actions">
                    <button 
                      onClick={(e) => handleUpdateSpot(e, spot.id)}
                      className="action-button update-button"
                      aria-label={`Update ${spot.name}`}
                    >
                      <FaPen />
                      Update
                    </button>
                    <button 
                      onClick={handleDeleteClick}
                      className="action-button delete-button"
                      aria-label={`Delete ${spot.name}`}
                    >
                      <FaTrashCan />
                      <OpenModalMenuItem
                        itemText="Delete"
                        modalComponent={
                          <ConfirmDeleteModal 
                            spotId={spot.id}
                            spotName={spot.name}
                            onDelete={refreshSpots}
                          />
                        }
                      />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* Empty State - Only show when no spots exist */
        <div className="empty-state-wrapper">
          <div className="empty-state">
            <div className="empty-state-icon">🏖️</div>
            <h1>Start Your Hosting Journey</h1>
            <p className="empty-state-description">
              Share your beach paradise with travelers around the world and start earning income today.
            </p>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <div className="benefit-text">
                  <h3>Earn Extra Income</h3>
                  <p>Set your own prices and availability</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🌍</div>
                <div className="benefit-text">
                  <h3>Meet Travelers</h3>
                  <p>Connect with guests from around the world</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🛡️</div>
                <div className="benefit-text">
                  <h3>You&apos;re Protected</h3>
                  <p>Beach Breakaway provides host guarantee coverage</p>
                </div>
              </div>
            </div>

            <button onClick={handleCreateNewSpot} className="create-button-large">
              <FaPlus />
              Create Your First Spot
            </button>
            
            <div className="help-section">
              <p>Need help getting started?</p>
              <button 
                className="help-link"
                onClick={() => alert('Feature coming soon! Access hosting guides and resources.')}
              >
                View Hosting Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSpots;
