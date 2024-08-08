const express = require("express");
const {
  Spot,
  SpotImage,
  User,
  Review,
  Booking,
  ReviewImage,
  sequelize,
} = require("../../db/models");

const { requireAuth } = require("../../utils/auth");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

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
  
  // GET all spots
  router.get("/", async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
      req.query;
  
    const where = {};
    const err = new Error("Bad Request");
    err.status = 400;
    err.errors = {};
  
    if (page === undefined) {
      page = 1;
    }
    if (size === undefined) {
      size = 20;
    }
  
    if (isNaN(Number(page))) page = 0;
    if (isNaN(Number(size))) size = 0;
  
    if (page < 1) {
      err.errors.page = "Page must be greater than or equal to 1";
    }
    if (size < 1 || size > 20) {
      err.errors.size = "Size must be between 1 and 20";
    }
    if (maxLat && (isNaN(Number(maxLat)) || maxLat < -90 || maxLat > 90)) {
      err.errors.maxLat = "Maximum latitude is invalid";
    }
    if (minLat && (isNaN(Number(minLat)) || minLat < -90 || minLat > 90)) {
      err.errors.minLat = "Minimum latitude is invalid";
    }
    if (maxLng && (isNaN(Number(maxLng)) || maxLng < -180 || maxLng > 180)) {
      err.errors.maxLng = "Maximum longitude is invalid";
    }
    if (minLng && (isNaN(Number(minLng)) || minLng < -180 || minLng > 180)) {
      err.errors.minLng = "Minimum longitude is invalid";
    }
  
    if (maxPrice) {
      if (isNaN(Number(maxPrice)) || maxPrice < 0) {
        err.errors.maxPrice = "Maximum price must be greater than or equal to 0";
      }
      if (!where.price) {
        where.price = {};
      }
      where.price[Op.lt] = maxPrice;
    }
    if (minPrice || minPrice === 0) {
      if (isNaN(Number(minPrice)) || minPrice < 0) {
        err.errors.minPrice = "Minimum price must be greater than or equal to 0";
      }
      if (!where.price) {
        where.price = {};
      }
      where.price[Op.gt] = minPrice;
    }
  
    if (maxLat) {
      if (!where.lat) {
        where.lat = {};
      }
      where.lat[Op.lt] = maxLat;
    }
    if (minLat) {
      if (!where.lat) {
        where.lat = {};
      }
      where.lat[Op.gt] = minLat;
    }
    if (maxLng) {
      if (!where.lng) {
        where.lng = {};
      }
      where.lng[Op.lt] = maxLng;
    }
    if (minLng) {
      if (!where.lng) {
        where.lng = {};
      }
      where.lng[Op.gt] = minLng;
    }
  
    try {
      if (Object.keys(err.errors).length) {
        throw err;
      }
      const spots = await Spot.findAll({
        where,
        limit: size,
        offset: size * (page - 1),
      });
  
      const spotsInform = await spotsInfo(spots);
      res.status(200).json({ Spots: spotsInform, page, size });
    } catch (err) {
      next(err);
    }
  });

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
    const {address, city, state, country, lat, lng, name, description, price } = req.body;
        
    //create new spot
    const newSpot = await Spot.create({
        ownerId: req.user.id,
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

    //return spot with 201 status code
    return res.status(201).json(newSpot)
});

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const {url, preview} = req.body;

    const spot = await Spot.findByPk(spotId)

    //check if spot exists or if spot belongs to current user
    if(!spot || spot.ownerId !== req.user.id) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    };
    
    //create new image
    const newImage = await SpotImage.create({
        spotId,
        url,
        preview
    });

    //make a little data object to res.json
    const data = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    }

    //return data with 201 status code
    return res.status(201).json(data)
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
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

    //check if spot exists or if spot belongs to current user
    if(!spot || spot.ownerId !== req.user.id) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    };

    await spot.destroy();

    return res.json({
        "message": "Successfully deleted"
      });

})

module.exports = router;
