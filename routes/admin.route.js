import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('vwAdmin/admin');
});

export default router;