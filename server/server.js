const express = require('express');
const cors = require('cors');
const client = require('./esClient');

const app = express();
app.use(cors());

// Main search route
app.get('/search', async (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    if (!query.trim()) return res.json([]);

    try {
        const { hits } = await client.search({
            index: 'articles',
            query: {
                bool: {
                    should: [
                        // 🎯 Primary full-text search with phonetic + synonyms
                        {
                            multi_match: {
                                query,
                                fields: ['title^3', 'body^2', 'tags'],
                                analyzer: 'custom_search_analyzer',
                                fuzziness: 'AUTO'
                            }
                        },

                        // 🌀 Fallback wildcard search (slow but useful for partials)
                        {
                            wildcard: {
                                title: { value: `*${query}*`, case_insensitive: true }
                            }
                        },
                        {
                            wildcard: {
                                body: { value: `*${query}*`, case_insensitive: true }
                            }
                        },
                        {
                            wildcard: {
                                tags: { value: `*${query}*`, case_insensitive: true }
                            }
                        }
                    ],
                    minimum_should_match: 1
                }
            }
        });

        const results = hits.hits.map(hit => hit._source);
        res.json(results);
    } catch (err) {
        console.error('Search error:', err.meta?.body?.error || err);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
});
