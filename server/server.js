const express = require('express');
const cors = require('cors');
const client = require('./esClient');

const app = express();
app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q || '';

    const { hits } = await client.search({
        index: 'articles',
        query: {
            multi_match: {
                query,
                fields: ['title^2', 'body', 'tags']
            }
        }
    });

    const results = hits.hits.map(hit => hit._source);
    res.json(results);
});

app.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
});
