const express = require("express");

const { requireAuth } = require("../../utils/auth");

const { check } = require('express-validator');
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

const {
  Spot,
  SpotImage,
  User,
  Review,
  Booking,
  ReviewImage
} = require("../../db/models");

const validateReviews = [
    check('review').exists({ checkFalsy: true }).withMessage("Review Text is required"),
    check('stars').isLength({ min: 1, max: 5 }).withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

const spotsInfo = async (spots) => {
  const res = [];
  for (let i = 0; i < spots.length; i++) {
    // check reviews
    const spot = spots[i];
    const reviews = await Review.findAll({ where: { spotId: spot.id } });
    const totalRating = reviews.reduce((acc, el) => acc + el.stars, 0);
    const avgStarRating = totalRating / reviews.length;

    // check images
    const img = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true },
    });

    let previewImage = null;
    if (img) {
      previewImage = img.url;
    }

    res.push({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: reviews.length,
      avgStarRating, //placeholder
      previewImage, //placeholder
      SpotImages: spot.SpotImages,
      Owner: spot.User,
    });
  }
  return res;
};

//validate spots
const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('city is required'),
    check('state')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('state is required'),
    check('country')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isFloat({
        min: -90,
        max: 90
      })
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isFloat({
        min: -180,
        max: 180
      })
      .withMessage('Latitude must be within -180 and 180'),
    check('name')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isLength({max: 50})
      .withMessage("Name must be less than 50 characters"),
    check('description')
      .notEmpty()
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .notEmpty()
      //must be positive
      .isFloat({min: 0})
      .withMessage("Price per day must be a positive number"),
    handleValidationErrors
]

// GET all spots owned by the current user
router.get("/current", requireAuth, async (req, res, next) => {
    try {
      const currentUserId = req.user.id;
      const spots = await Spot.findAll({
        where: { ownerId: currentUserId },
      });
      const spotsInform = await spotsInfo(spots);
      res.status(200).json({ Spots: spotsInform });
    } catch (err) {
      next(err);
    }
  });
  
  //Get all Spots
router.get('/',async (req, res) => {
  let { page=1, size=20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
 
  page = Number(page);
  size = Number(size);
  if (isNaN(page) || page <= 0) page = 1;
  if (isNaN(size) || size <= 0) size = 20;

  const where = {};
  if (minLat) where.lat = { [Op.gte]: minLat}
  if (maxLat) where.lat = { ...where.lat, [Op.lte]: maxLat}
  if (minLng) where.lng = { [Op.gte]: minLng}
  if (maxLng) where.lng = { ...where.lng, [Op.lte]: maxLng}
  if (minPrice) where.price = { [Op.gte]: minPrice}
  if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice}

  const spots = await Spot.findAll({
    where,
    limit: size,
    offset: size * (page - 1),
    include: [
      { model: Review },
      { model: SpotImage }
    ],
  });

  for (let i = 0; i < spots.length; i++) {

    spots[i] = spots[i].toJSON();
   
    const totalStar = spots[i].Reviews.reduce((sum, review) => sum + review.stars, 0)
    const avgRating = totalStar / (spots[i].Reviews.length).toFixed(1);

    if (spots[i].Reviews.length) {
      spots[i].avgRating = avgRating
    } else {
      spots[i].avgRating = null;
    }

    delete spots[i].Reviews;

    if (spots[i].SpotImages.length) {
      spots[i].previewImage = spots[i].SpotImages[0].url
    } else {
      spots[i].previewImage = null
    }

    delete spots[i].SpotImages;
  }

  return res.status(200).json({
    Spots: spots,
    Page: page,
    Size: size
  })
})


//Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    try {

        const spot = await Spot.findByPk(parseInt(req.params.spotId));

        if (!spot) {
            res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            }
        });

        let numReviews = 0;
        let sumStars = 0
        for (const review of reviews) {
            sumStars += review.stars;
            numReviews++
        }
        let avg = sumStars / numReviews;

        const images = await SpotImage.findAll({
            where: {
                spotId: spot.id
            },
            attributes: ['id', 'url', 'preview']
        })

        const owner = await User.findByPk(spot.ownerId);

        spot.SpotImages = images;
        spot.Owner = owner;
        spot.lat = parseFloat(spot.lat);
        spot.lng = parseFloat(spot.lng);
        spot.price = parseFloat(spot.price);

        res.json({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: numReviews,
            avgStarRating: avg,
            SpotImages: images,
            Owner: owner
        });
    } catch (error) {
        next(error);
    }
});

//create a spot
router.post('/', validateSpot, requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
  req.body;
const ownerId = req.user.id;

try {
  const newSpot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201).json(newSpot);
} catch (err) {
  next(err);
}
});


//Add an image to a Spot based on the Spot's Id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    try {
        const { url, preview } = req.body;
        const spot = await Spot.findByPk(req.params.spotId);

        const spotImages = await SpotImage.create({
            url: url,
            preview: preview,
            spotId: req.params.spotId
        });

        const safeSpotImage = await SpotImage.findAll({
            where: {
                id: spotImages.id
            },
            attributes: ['id', 'url', 'preview']
        });

        if (!spot) {
          return res.status(404).json({
            message: "Spot couldn't be found",
          });
        }

        if (spot.ownerId !== req.user.id) {
          return res.status(403).json({
            message: "Forbidden",
          });
        }

        res.status(201).json({
            spotId: parseInt(req.params.spotId, 10),
            url: safeSpotImage[0].url,
            preview: safeSpotImage[0].preview
        });
    } catch (error) {
        next(error);
    }
});

//edit a spot
router.put('/:spotId', validateSpot, requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotId);

    //check body validations errors
    //check routes/api/users.js validateSignUp array to make a better validation for spots


    //check if spot exists
    if(!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    //edit spot
    const updatedSpot = await spot.update({
        address,
        city,
        state,
        country, 
        lat,
        lng,
        name,
        description,
        price
    });
    

    return res.json(updatedSpot);
});

//delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    try {
      const spot = await Spot.findByPk(parseInt(req.params.spotId))
      if (!spot)
        return res.status(404).json({
            message: "Spot couldn't be found"
      });

      if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await spot.destroy();

      res.json({
          message: "Successfully deleted"
      })

    } catch (error) {
        next(error)
    }
});


//Get all Reviews by a Spot's Id
router.get('/:spotId/reviews', requireAuth, validateReviews, async (req, res, next) => {
	try {
    const Reviews = await Review.findAll({
      where: {
          spotId: parseInt(req.params.spotId)
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    if (!Reviews || Reviews.length === 0)
      return res.status(404).json({
          message: "Spot couldn't be found"
    });

		res.status(200).json({ Reviews })
	} catch (error) {
			next(error)
	}
});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReviews, async (req, res, next) => {
  try {
      const { review, stars } = req.body;

      const spot = await Spot.findByPk(parseInt(req.params.spotId));

      if (!spot)
          return res.status(404).json(
              {
                  message: "Spot couldn't be found"
              });

      const spotReviews = await Review.findAll({
          where: {
              spotId: req.params.spotId
          }
      })

      for (const review of spotReviews) {
          if (review.userId === req.user.id)
              return res.status(500).json({
                  message: "User already has a review for this spot"
              })
      }

      const createdReview = await Review.create({
          userId: req.user.id,
          spotId: parseInt(req.params.spotId),
          review: review,
          stars: stars
      })

      res.status(201).json(createdReview);

  } catch (error) {

  }
});

// Route to get all bookings for a spot based on the spot's ID
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  try {
    const { spotId } = req.params;
    const userId = req.user.id; 

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const isOwner = spot.ownerId === userId;

    const bookings = await Booking.findAll({
      where: { spotId },
      include: isOwner ? [{ model: User, attributes: ['id', 'firstName', 'lastName'] }] : []
    });

    const response = bookings.map(booking => {
      const bookingData = {
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      };

      if (isOwner) {
        bookingData.User = {
          id: booking.User.id,
          firstName: booking.User.firstName,
          lastName: booking.User.lastName
        };
      }

      return isOwner ? { User: bookingData.User, ...bookingData } : {
        spotId: booking.spotId,
        startDate: booking.startDate,
        endDate: booking.endDate
      };
    });

    res.status(200).json({ Bookings: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching bookings.' });
  }
});

// Route to create a booking for a spot based on the spot's ID
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  try {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the spot belongs to the current user
    if (spot.ownerId === userId) {
      return res.status(403).json({ message: "You cannot book your own spot" });
    }

    // Validate dates
    const now = new Date();
    if (new Date(startDate) < now) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { startDate: "startDate cannot be in the past" }
      });
    }
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { endDate: "endDate cannot be on or before startDate" }
      });
    }

    // Check for booking conflicts
    const conflictingBookings = await Booking.findAll({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } }
            ]
          }
        ]
      }
    });

    if (conflictingBookings.length > 0) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      });
    }

    // Create the booking
    const newBooking = await Booking.create({
      spotId,
      userId,
      startDate,
      endDate
    });

    res.status(201).json({
      id: newBooking.id,
      spotId: newBooking.spotId,
      userId: newBooking.userId,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      createdAt: newBooking.createdAt,
      updatedAt: newBooking.updatedAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the booking.' });
  }
});



module.exports = router;


//incorrect user
// if (spot.ownerId !== req.user.id) {
//   return res.status(403).json({ message: "Forbidden" });
// }
