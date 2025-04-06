const client = require('./esClient');

const articles = [
    {
        title: 'Getting Started with Elasticsearch',
        body: 'This guide helps you get started with Elasticsearch quickly.',
        tags: ['elasticsearch', 'guide', 'search']
    },
    {
        title: 'Advanced Search Techniques',
        body: 'Explore full-text search, filters, and scoring.',
        tags: ['search', 'advanced', 'techniques']
    },
    {
        title: 'Node.js and Elasticsearch',
        body: 'Connect your Node.js app with Elasticsearch using the official client.',
        tags: ['nodejs', 'elasticsearch']
    }
];

async function seed() {
    await client.indices.create({ index: 'articles' }, { ignore: [400] });

    for (const [i, article] of articles.entries()) {
        await client.index({
            index: 'articles',
            id: i + 1,
            document: article
        });
    }

    await client.indices.refresh({ index: 'articles' });

    console.log('Seeded sample articles!');
}

seed().catch(console.error);
