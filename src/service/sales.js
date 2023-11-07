const { saleSchema } = require('../schema/sale');
const mongoose = require('mongoose');
const axios = require('axios');
const lodash = require('lodash');

const saveSales = async (timestamp) => {
    const axiosResponse = await axios.get(`https://api.neopro.com.br/v1/test/sales?month=${timestamp}`);

    const responseData = axiosResponse.data;

    const groupedByName = lodash.groupBy(responseData, 'seller');

    const response = [];
    
    for(const [seller, sales] of Object.entries(groupedByName)) {
        const salesWithoutTime = sales.map((sale) => {
            const dateWithoutTime = sale.date.split('T')[0];
            return {
                seller: sale.seller,
                date: `${dateWithoutTime}T00:00:00.000Z`,
                sold: sale.sold,
            };
        });
        
        const groupedByDate = lodash.groupBy(salesWithoutTime, 'date');
        
        for (const [date, sales] of Object.entries(groupedByDate)) {
            const saleByDateObj = {
                date,
                seller,
                sold: sales.reduce((prev, curr) => prev += curr.sold, 0),
                sales: sales.length,
            };

            response.push(saleByDateObj);
        }
    }
    
    const salesModel = mongoose.model('sales', saleSchema, 'sales');

    for (const sale of response) {
        try {
            const saleObj = new salesModel(sale);
            await saleObj.save();
        } catch (error) {
            console.error(error);
        }
    }

    return response;
};

const findByDate = async (timestamp) => {
    const salesModel = mongoose.model('sales', saleSchema, 'sales');

    const sales = await salesModel.find({
        date: timestamp,
    }).exec();

    const response = {
        date: timestamp,
        sellers: sales.map((sale) => {
            delete sale.date;
            return {
                seller: sale.seller,
                sold: sale.sold,
                sales: sale.sales,
            };
        }),
    };
    
    return response;
};

module.exports = { saveSales, findByDate };