
const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");

const { SpotImage, Spot } = require("../../db/models");

//Delete a Spot Image
router.delete('/:spotImageId', requireAuth, async (req, res, next) => {
	try {
			const mySpotImage = await SpotImage.findByPk(parseInt(req.params.spotImageId));

			if (!mySpotImage) {
					return res.status(404).json({
							message: "Spot Image couldn't be found"
					})
			};

			const spot = await Spot.findByPk(mySpotImage.spotId);

			if (spot.ownerId !== req.user.id) {
				return res.status(403).json({
					message: "Forbidden",
				});
			}

			await mySpotImage.destroy();

			return res.status(200).json({
				message: "Successfully deleted",
			});

	} catch (error) {
			next(error);
	}
});

module.exports = router;
