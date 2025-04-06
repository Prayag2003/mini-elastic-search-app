const express = require('express');
const cors = require('cors');
const client = require('./esClient');

const app = express();
app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q || '';

    try {
        const { hits } = await client.search({
            index: 'articles',
            query: {
                bool: {
                    should: [
                        {
                            match_phrase_prefix: {
                                title: {
                                    query: query,
                                    slop: 2
                                }
                            }
                        },
                        {
                            match_phrase_prefix: {
                                body: {
                                    query: query,
                                    slop: 2
                                }
                            }
                        },
                        {
                            match: {
                                tags: {
                                    query: query
                                }
                            }
                        }
                    ]
                }
            }
        });

        const results = hits.hits.map(hit => hit._source);
        res.json(results);
    } catch (err) {
        console.error('Elasticsearch search error:', err);
        res.status(500).send({ error: 'Search failed' });
    }
});

app.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
});
