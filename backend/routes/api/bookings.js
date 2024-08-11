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
router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {

  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    })
  }
  if (booking.userId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden'
    });
  }

  const { startDate, endDate } = req.body;
  const spot = await Spot.findByPk(booking.spotId);

  if (new Date(startDate) < new Date()) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
    });
  }

  const otherBookings = await Booking.findAll({
    where: {
      spotId: spot.id,
      id: { [Op.ne]: booking.id }, // Exclude current booking
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          endDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          [Op.and]: [
            { startDate: { [Op.lte]: startDate } },
            { endDate: { [Op.gte]: endDate } },
          ],
        },
      ],
    },
  });

  if (otherBookings.length > 0) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  await booking.update({
    startDate: startDate,
    endDate: endDate,
    updatedAt: new Date(),
  });

  return res.status(200).json(booking)
});


//delete booking
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
