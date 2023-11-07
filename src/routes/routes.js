const express = require('express');
const { saveSales, findByDate } = require('../service/sales');

const router = express.Router();

router.get('/first/:timestamp', async (req, res) => {
    const receivedTimestamp = req.params.timestamp;
    
    if (!receivedTimestamp) {
        res.json({
            success: false,
            message: 'timestamp required',
        });
    }

    const response = await saveSales(receivedTimestamp);

    return res.json(response);
});

router.get('/second/:timestamp', async (req, res) => {
    const receivedTimestamp = req.params.timestamp;
    
    if (!receivedTimestamp) {
        res.json({
            success: false,
            message: 'timestamp required',
        });
    }
    
    const sales = await findByDate(receivedTimestamp);

    return res.json(sales);
});

module.exports = router;