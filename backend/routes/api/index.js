const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const spotImagesRouter = require('./spot-images.js');
const reviewsRouter = require('./reviews.js');
const reviewImagesRouter = require('./review-images.js');
const bookingRouter = require('./bookings.js');
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/spot-images', spotImagesRouter);

router.use('/reviews', reviewsRouter);

router.use('/review-images', reviewImagesRouter); 

router.use('/bookings', bookingRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
