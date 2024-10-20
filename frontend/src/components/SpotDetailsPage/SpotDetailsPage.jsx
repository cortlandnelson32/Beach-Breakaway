import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadSpotThunk } from "../../store/spots";
import { getAllReviewsThunk } from "../../store/reviews";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import { FaStar } from 'react-icons/fa';
import { FaPen, FaTrashCan } from "react-icons/fa6";

import './SpotDetailsPage.css';
import ReviewCard from "./ReviewCard";
import PostReviewModal from "../ReviewFormModal/PostReviewModal";
import DeleteFormReview from "../ReviewFormModal/DeleteFormReview";
import EditReviewModal from "../ReviewFormModal/EditReviewFormModal";

function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const [reviewChecker, setReviewChecker] = useState(false);
    const [deleteReviewChecker, setDeleteReviewChecker] = useState(false);

    useEffect(() => {
        dispatch(loadSpotThunk(parseInt(spotId)));
        dispatch(getAllReviewsThunk(parseInt(spotId)))
            .then(() => setDeleteReviewChecker(false));
    }, [dispatch, spotId, reviewChecker, deleteReviewChecker]);

    const spot = useSelector((state) => state.spots.spot);
    const reviews = useSelector((state) => state.reviews.allReviews);
    const user = useSelector((state) => state.session.user);

    const onModalClose = () => {
        setReviewChecker(false);
        dispatch(getAllReviewsThunk(parseInt(spotId)));
    };

    if (!spot) {
        return (
            <div className="loading-spot">
                <img
                    src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                    alt="loading animation"
                    style={{ height: '40px', width: '40px' }}
                />
            </div>
        )
    }

    if (!reviews) {
        return <div>Loading reviews...</div>;
    }

    const mainImage = spot.SpotImages?.filter((i) => i.preview === true) || [];
    const otherImages = spot.SpotImages?.filter((i) => i.preview === false) || [];

    let avgRating = "New!";
    if (spot.avgStarRating) avgRating = spot.avgStarRating.toFixed(1).toString();

    const displayedImages = otherImages.slice(0, 4);

    const handleOnClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.alert("Feature Coming Soon...");
    };

    const onDeleteModalClose = () => {
        setDeleteReviewChecker(prev => !prev);
    }

    return (
        <div className="spot-details">
            <div className="header">
                <h1>{spot.name}</h1>
                <span>{spot.city}, {spot.state}, {spot.country}</span>
            </div>
            <div className="images">
                <div className="left-image-panel">
                    {mainImage.length > 0 && <img key={mainImage[0].id} src={mainImage[0].url} alt="Main preview" />}
                </div>
                {otherImages.length === 1
                    ? <div className="right-image-panel-1">
                        {displayedImages.map((i, index) => (
                            <div key={i.id} className="image-container-1">
                                <img className="image-tile" src={i.url} alt={`Image ${i.id}`} />
                                {index === 3 && otherImages.length > 4 && (
                                    <button className="all-pictures-button">All Pictures</button>
                                )}
                            </div>
                        ))}
                    </div>
                    : <div className="right-image-panel">
                        {displayedImages.map((i, index) => (
                            <div key={i.id} className="image-container">
                                <img className="image-tile" src={i.url} alt={`Image ${i.id}`} />
                                {index === 3 && otherImages.length > 4 && (
                                    <button className="all-pictures-button">All Pictures</button>
                                )}
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className="description-panel">
                <div className="description-panel-left">
                    <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                    <span className="description">{spot.description}</span>
                </div>
                <div className="description-panel-right">
                    <div className="price-reviews">
                        <div className="price">
                            <span className="price-span">${spot.price} </span>
                            <span>night</span>
                        </div>
                        <div className="reviews">
                            <div className="avg-reviews">
                                <FaStar />
                                <span>{avgRating}</span>
                            </div>
                            <div className="num-reviews">
                                {spot.numReviews !== 0 ? spot.numReviews === 1 ? <span>{spot.numReviews} review</span> : <span>{spot.numReviews} reviews</span> : <span></span>}
                            </div>
                        </div>
                    </div>
                    <div className="reserve">
                        <button className="reserve-button" onClick={(e) => handleOnClick(e)}>Reserve</button>
                    </div>
                </div>
            </div>
            <div className='divider'></div>
            <div className="reviews2">
                <div className="reviews2-top">
                    <div className="avg-reviews2">
                        <FaStar />
                        <span>{avgRating}</span>
                    </div>
                    <span>{spot.numReviews !== 0 ? '·' : ''}</span>
                    <div className="num-reviews2">
                        {spot.numReviews !== 0 ? spot.numReviews === 1 ? <span>{spot.numReviews} review</span> : <span>{spot.numReviews} reviews</span> : <span></span>}
                    </div>
                </div>
                <div className="post-review">
                    {
                        sessionUser !== null && sessionUser.id !== spot.ownerId ?
                            <div className="post-review-button">
                                <OpenModalMenuItem
                                    itemText="Post your Review"
                                    modalComponent={<PostReviewModal setReviewChecker={setReviewChecker} spotId={parseInt(spotId)} onModalClose={() => {
                                        onModalClose;
                                    }} />}
                                />
                            </div> :
                            sessionUser === null &&
                            <div className="log-in-to-review">
                                <OpenModalMenuItem
                                    itemText="Log In to Review"
                                    modalComponent={<LoginFormModal />}
                                    onModalClose={
                                        onModalClose
                                    }
                                />
                            </div>
                    }
                </div>
            </div>
            <div className="reviews-container">
                {
                spot.numReviews === 0 && sessionUser !== null && sessionUser.id !== spot.ownerId
                    ? <span className="be-the-first">Be the first to post a review!</span>
                    : ''
                }
                {spot.numReviews === 0 ? (
                    <div></div>
                ) : (
                    reviews.map((review) => {
                        return (
                            <div className="review-and-button" key={review.id}>
                                <div className='divider-horizontal'></div>
                                <ReviewCard key={review.id} review={review} />
                                    {user && (review.User.id === user.id) ?
                                        <div className="crud-buttons-container" key={review.id}>
                                            <button className="edit-review-button" key={review.id}>
                                                <FaPen />
                                                <OpenModalMenuItem
                                                    itemText={"Edit"}
                                                    modalComponent={<EditReviewModal review={review} setReviewEditChecker={setDeleteReviewChecker} />}
                                                />
                                            </button>
                                            <button className="delete-review-button" key={review.id}>
                                                <FaTrashCan />
                                                <OpenModalMenuItem
                                                    itemText={"Delete"}
                                                    modalComponent={<DeleteFormReview reviewId={review.id} setDeleteReviewChecker={setDeleteReviewChecker} />}
                                                    onModalClose={async () => {
                                                        await onDeleteModalClose
                                                    }}
                                                />
                                            </button>
                                        </div> :
                                        ''
                                }
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}

export default SpotDetails;
