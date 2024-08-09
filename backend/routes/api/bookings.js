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
router.get('/current', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user contains the authenticated user's info

    const bookings = await Booking.findAll({
      where: { userId },
      include: {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage']
      }
    });

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching bookings.' });
  }
});


//Edit A Booking
router.put('/:bookingId', requireAuth, async (req, res, next) => {
  try {
      const { startDate, endDate } = req.body;

      const myBooking = await Booking.findByPk(parseInt(req.params.bookingId))

      if (!myBooking) {
          return res.status(404).json({
              message: "Booking couldn't be found"
          })
      }

      if (myBooking.userId !== parseInt(req.user.id)) {
          const err = new Error("Booking must belong to the current user");
          err.status = 403;
          err.title = "Forbidden";
          return next(err)
      }

      if (new Date(endDate) <= new Date(startDate)) {
          const err = new Error('Validation Error ');
          err.status = 400;
          err.message = "Bad Request"
          err.errors = { endDate: "endDate cannot be on or before startDate" }
          return next(err)
      }

      if (new Date(endDate) <= new Date(Date.now())) {
          return res.status(403).json({
              message: "Past bookings can't be modified"
          })
      }

      const bookings = await Booking.findAll({
          where: {
              spotId: parseInt(myBooking.spotId)
          }
      });

      const err = new Error("Sorry, this spot is already booked for the specified dates");
      err.status = 403;
      err.errors = {};

      for (const booking of bookings) {
          if (new Date(booking.startDate) >= new Date(startDate) && new Date(booking.startDate) <= new Date(endDate)) {
              err.errors.startDate = "Start date conflicts with an existing booking";
          }
          if (new Date(booking.endDate) <= new Date(endDate) && new Date(booking.endDate) >= new Date(startDate)) {
              err.errors.endDate = "End date conflicts with an existing booking";
          }
      }

      if (err.errors.startDate || err.errors.endDate) {
          return next(err);
      }

      await myBooking.update({
          startDate: startDate,
          endDate: endDate
      });

      res.json(myBooking)

  } catch (error) {
      next(error)
  }
});

router.delete('/bookings/:bookingId', requireAuth, async (req, res) => {
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
          return res.status(403).json({
              message: "You are not authorized to delete this booking"
          });
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
