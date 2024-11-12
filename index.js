const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
require('dotenv').config();


app.use(cors({
    origin: '*' ,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization' 

}));


const routes = {
    "/services": process.env.SERVICES,
    "/auth": process.env.AUTH,
    "/search": process.env.SEARCH,
};


app.get("/", (req, res) => {
    res.send("API Gateway connected");
});

console.log("PORT:", process.env.PORT || 5000);

for (const route in routes) {
    const target = routes[route];
    app.use(route, createProxyMiddleware({
        target,
        changeOrigin: true,
        timeout: 10000,          
        proxyTimeout: 10000,     
        onError: (err, req, res) => {
            console.error(`Error with proxy for route ${route}:`, err);
            res.status(500).send("Proxy Error"); 
        },
        onProxyReq: (proxyReq, req, res) => {
            // console.log(`Proxying request for route ${route} to ${target}`);
        },
        onProxyRes: (proxyRes, req, res) => {
            // console.log(`Received response from target ${target} for route ${route}`);
        },
    }));
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
