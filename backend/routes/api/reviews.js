const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: {
                userId: req.user.id
            },
        });

        let Reviews = [];

        for (const review of reviews) {
            let value = review.toJSON();

            const spot = await Spot.findByPk(review.spotId);
            const user = await User.findByPk(req.user.id);
            const reviewImages = await ReviewImage.findAll({
                where: {
                    reviewId: review.id
                }
            });

            let imgs = reviewImages.map(reviewImage => ({
                id: reviewImage.id,
                url: reviewImage.url
            }));

            const previewImage = await SpotImage.findOne({
                where: {
                    spotId: review.spotId,
                    preview: true
                }
            });

            Reviews.push({
                ...value,
                User: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                Spot: {
                    id: spot.id,
                    ownerId: spot.ownerId,
                    address: spot.address,
                    city: spot.city,
                    state: spot.state,
                    country: spot.country,
                    lat: spot.lat,
                    lng: spot.lng,
                    name: spot.name,
                    price: spot.price,
                    previewImage: previewImage ? previewImage.url : null
                },
                ReviewImages: imgs
            });
        }

        res.json({ Reviews });
    } catch (error) {
        next(error);
    }
});



module.exports = router;
