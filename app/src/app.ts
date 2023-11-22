import express from 'express';

import 'dotenv/config'; 

import cookieParser from 'cookie-parser'; 

import { ErrorRequestHandler } from 'express';

import userRoutes from '../routes/user/index';

import productRoutes from '../routes/product/index';

import productCategoryRoutes from '../routes/productCategory'

import rfidScannerRoutes from '../routes/RFIDScanner'

import ShipmentOrderRoutes from '../routes/shipmentOrder';

import rfidTagRoutes from '../routes/RFIDTag'

import rfidScannerRecordRoutes from '../routes/RFIDScannerRecord'

import sensorNode from '../routes/sensorNode'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // Log the error (consider using a more sophisticated logger in a real application)
    console.error(err.message);

    // Send a generic error message in production
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = isProduction ? 'An error occurred' : err.message;

    res.status(400).json({ error: errorMessage });
};



const app = express();

app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});



app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/productCategory', productCategoryRoutes)
app.use('/rfidscanner', rfidScannerRoutes)
app.use('/order', ShipmentOrderRoutes)
app.use('/rfidtag', rfidTagRoutes)
app.use('/rfidscannerrecord', rfidScannerRecordRoutes)
app.use('/sensornode',sensorNode)

app.use(errorHandler);

export default app;