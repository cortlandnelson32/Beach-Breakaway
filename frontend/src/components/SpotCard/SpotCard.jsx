import { useEffect, useState } from "react";
import { FaStar } from 'react-icons/fa';
import './SpotCard.css';

function SpotCard({ spot }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [timer, setTimer] = useState(null);

    const handleMouseEnter = () => {
        const newTimer = setTimeout(() => {
            setShowTooltip(true);
        }, 500);
        setTimer(newTimer);
    };

    const handleMouseLeave = () => {
        clearTimeout(timer);
        setShowTooltip(false);
    };

    useEffect(() => {
        return () => {
            clearTimeout(timer);
        }
    }, [timer]);

    // let avgRating = "New!";
    let avgRating = "";
    if (spot.avgRating)
        avgRating = spot.avgRating.toFixed(1).toString();

    return (
        <div className="spot-card-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="spot-card">
            <div className="img">
              <img className="spot-image" src={spot.previewImage} alt="main-image" />
            </div>
            <div className={`tooltip ${showTooltip ? 'show' : 'hide'}`}>
              {spot.name}
            </div>
          </div>
          <div className="spot-data">
            <div className="left-panel">
              <span>{spot.city}, {spot.state}</span>
              <div className="price">
                <span id="price">${spot.price}</span>
                <span> / night</span>
              </div>
            </div>
            <div className="right-panel">
              <FaStar className="star" />
              <span> {avgRating} </span>
            </div>
          </div>
        </div>
      );
}

export default SpotCard;
