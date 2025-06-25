const express = require('express');
const router = express.Router();
const Concert = require('../models/concertModel');
const multer = require('multer');
const path = require('path');

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ✅ Create Concert Form
router.get('/create_Concert', (req, res) => {
    res.render('./concert/create', { error: null });
});

// ✅ Create Concert POST
router.post('/create_Concert', upload.single('image'), async (req, res) => {
    try {
        const { concertName, dateTime, venue, ticketPrice, availableTickets } = req.body;
        const image = req.file ? '/uploads/' + req.file.filename : '';
        const concert = new Concert({
            
            concertName,
            dateTime,
            venue,
            ticketPrice,
            availableTickets,
            image
        });

        await concert.save();
        res.redirect('/concert/retrieve_concert');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating concert");
    }
});

// ✅ Retrieve Concerts
router.get('/retrieve_concert', (req, res) => {
    const role = req.session.userRole || 'guest';

    Concert.find().then(concerts => {
        res.render('concert/retrieve', { concerts, role });
    }).catch(error => {
        console.error(error);
        res.status(500).send('Server Error');
    });
});

// ✅ Update Concert Form
router.get('/update_concert/:id', async (req, res) => {
    try {
        const concert = await Concert.findById(req.params.id).lean();
        res.render('./concert/update', { concert, error: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error finding concert');
    }
});

router.post('/update_concert/:id', upload.single('image'), async (req, res) => {
    try {
        const { concertName, dateTime, venue, ticketPrice, availableTickets } = req.body;
        const updateData = { concertName, dateTime, venue, ticketPrice, availableTickets };

        // ✅ Only update image if user uploaded a new one
        if (req.file) {
            updateData.image = '/uploads/' + req.file.filename;
        }

        await Concert.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/concert/retrieve_concert');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating concert');
    }
});

// ✅ Delete Concert Form
router.get('/delete_concert/:id', async (req, res) => {
    try {
        const concert = await Concert.findById(req.params.id).lean();
        if (!concert) {
            return res.status(404).send('Concert not found!');
        }
        res.render('./concert/delete', { concert });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// ✅ Delete Concert POST
router.post('/delete_concert/:id', async (req, res) => {
    try {
        await Concert.findByIdAndDelete(req.params.id);
        res.redirect('/concert/retrieve_concert');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting concert');
    }
});

module.exports = router;
