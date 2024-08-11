const express = require("express");

const { requireAuth } = require("../../utils/auth");

const { check } = require('express-validator');
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

const { Spot, SpotImage, User,  Review,  Booking,  ReviewImage, sequelize } = require("../../db/models");

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Start date is required'),
  check('endDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('End date is required'),
  handleValidationErrors
];


// Route to get all of the current user's bookings
// router.get('/current', requireAuth, async (req, res) => {
//   try {
//     const userId = req.user.id; 
//     const myBooking = await Booking.findByPk(parseInt(req.params.bookingId))
//     if (!myBooking) {
//       return res.status(404).json({
//           message: "Booking couldn't be found"
//       })
//     } 

//     const bookings = await Booking.findAll({
//       where: { userId },
//       include: {
//         model: Spot,
//         attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage']
//       }
//     });

//     res.status(200).json({ Bookings: bookings });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while fetching bookings.' });
//   }
// });

router.get('/current', requireAuth, async (req, res, next) => {
  try {
      const bookings = await Booking.findAll({
          where: {
              userId: parseInt(req.user.id)
          }
      });

      const formattedBookings = [];

      for (const booking of bookings) {

          const spot = await Spot.findByPk(booking.spotId);

          const previewImage = await SpotImage.findOne({
              where: {
                  spotId: spot.id,
                  preview: true
              }
          });

          formattedBookings.push({
              id: booking.id,
              spotId: booking.spotId,
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
                  previewImage: previewImage.url
              },
              userId: booking.userId,
              startDate: booking.startDate,
              endDate: booking.endDate,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt
          })
      }

      res.json({ Bookings: formattedBookings })
  } catch (error) {
      next(error)
  }
});


//Edit A Booking
router.put("/:bookingId", requireAuth, async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const toEdit = await Booking.findByPk(+bookingId);

    if (!toEdit) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (new Date(toEdit.startDate).getTime() < Date.now()) {
      return res.status(403).json({ message: "Past bookings can't be modified" });
    }

    if (toEdit.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { startDate, endDate } = req.body;
    const isConflicting = await checkConflict({
      id: toEdit.id,
      spotId: toEdit.spotId,
      startDate,
      endDate,
    });

    if (isConflicting) {
      const err = new Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.status = isConflicting.status || 403;
      delete isConflicting.status;
      err.errors = isConflicting;
      return next(err);
    }
    toEdit.set({ startDate, endDate });
    const edited = await toEdit.save();
    res.json(edited);
  } catch (e) {
    e.status = 400;
    next(e);
  }
});

router.delete('/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id; // Assuming user ID is available in req.user after authentication

  try {
      // Find the booking
      const booking = await Booking.findByPk(bookingId, {
          include: [{ model: Spot }]
      });

      // If booking doesn't exist, return 404
      if (!booking) {
          return res.status(404).json({
              message: "Booking couldn't be found"
          });
      }

      // Check if the booking belongs to the current user or the spot belongs to the current user
      if (booking.userId !== userId && booking.Spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Check if the booking has already started
      const currentDate = new Date();
      if (new Date(booking.startDate) <= currentDate) {
          return res.status(403).json({
              message: "Bookings that have been started can't be deleted"
          });
      }

      // Delete the booking
      await booking.destroy();

      // Return successful response
      return res.status(200).json({
          message: "Successfully deleted"
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: "An error occurred while trying to delete the booking"
      });
  }
});


module.exports = router;
