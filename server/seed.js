const client = require('./esClient');

async function createIndexWithCustomAnalyzer() {
    const exists = await client.indices.exists({ index: 'articles' });
    if (exists) {
        await client.indices.delete({ index: 'articles' });
    }

    await client.indices.create({
        index: 'articles',
        body: {
            settings: {
                analysis: {
                    filter: {
                        synonym_filter: {
                            type: 'synonym',
                            synonyms: [
                                'prashant, croissant',
                                'js, javascript',
                                'ai, artificial intelligence',
                                'dev, developer',
                                'resume, resumé'
                            ]
                        },
                        phonetic_filter: {
                            type: 'phonetic',
                            encoder: 'metaphone',
                            replace: false
                        }
                    },
                    analyzer: {
                        custom_search_analyzer: {
                            tokenizer: 'standard',
                            filter: ['lowercase', 'synonym_filter', 'phonetic_filter']
                        }
                    }
                }
            },
            mappings: {
                properties: {
                    title: { type: 'text', analyzer: 'custom_search_analyzer' },
                    body: { type: 'text', analyzer: 'custom_search_analyzer' },
                    tags: { type: 'text', analyzer: 'custom_search_analyzer' }
                }
            }
        }
    });
}

const titles = [
    'Getting Started with Elasticsearch',
    'Advanced Search Techniques',
    'Node.js and Elasticsearch',
    'React Hooks Deep Dive',
    'Understanding JavaScript Closures',
    'CSS Grid vs Flexbox',
    'Dockerizing Your App',
    'REST vs GraphQL',
    'Tailwind CSS Tips',
    'Web Accessibility Basics',
    'Machine Learning 101',
    'Intro to Natural Language Processing',
    'Python for Beginners',
    'Data Structures in JavaScript',
    'Asynchronous JS Patterns',
    'Microservices Architecture',
    'TypeScript Crash Course',
    'Debugging in Chrome DevTools',
    'Building APIs with Express',
    'Securing Web Applications',
    'Health Benefits of Yoga',
    'Guide to Mindful Meditation',
    'Managing Personal Finance',
    'Investing for Beginners',
    'The Basics of Stock Market',
    'Learning to Cook at Home',
    'Best Travel Destinations 2025',
    'Tips for Solo Travelers',
    'Working Remotely Effectively',
    'How to Build a Resume',
    'Preparing for Interviews',
    'Online Education Platforms',
    'Learning with YouTube',
    'Building a Reading Habit',
    'Top 10 Productivity Tools',
    'Using Notion Efficiently',
    'Freelancing 101',
    'Setting Up a Portfolio Website',
    'Photography for Beginners',
    'Intro to Graphic Design',
    'Basics of Digital Marketing',
    'SEO Best Practices',
    'Email Marketing Strategies',
    'Cryptocurrency Fundamentals',
    'Blockchain in Simple Terms',
    'Understanding NFTs',
    'Introduction to Web3',
    'AI and the Future of Work',
    'The Ethics of AI',
    'What is Quantum Computing?'
];

const articles = Array.from({ length: 50 }, (_, i) => ({
    title: titles[i % 50],
    body: `This is article ${i + 1}, discussing "${[
        'search engines', 'frontend development', 'backend services', 'programming patterns',
        'tech tutorials', 'lifestyle habits', 'mental wellness', 'financial literacy',
        'education tips', 'travel hacks'
    ][i % 10]}".`,
    tags: [
        ['elasticsearch', 'nodejs', 'search'],
        ['react', 'frontend', 'hooks'],
        ['css', 'grid', 'flexbox'],
        ['docker', 'devops'],
        ['graphql', 'api'],
        ['tailwind', 'css'],
        ['ai', 'ml', 'python'],
        ['javascript', 'async', 'closures'],
        ['finance', 'money'],
        ['health', 'mindfulness']
    ][i % 10]
}));

const extraArticles = [
    {
        title: 'Croissant Dev Diaries',
        body: 'Logs of a developer who codes better with croissants.',
        tags: ['croissant', 'js', 'prashant', 'soundex']
    },
    {
        title: 'Croissant Chronicles',
        body: 'Exploring the buttery layers of croissants and their impact on productivity.',
        tags: ['croissant', 'productivity', 'food']
    },
    {
        title: 'The Croissant Effect',
        body: 'How croissants became a symbol of creativity in the tech world.',
        tags: ['croissant', 'creativity', 'tech']
    },
    {
        title: 'Mastering the Art of Croissants',
        body: 'A guide to baking the perfect croissant and its parallels to coding.',
        tags: ['croissant', 'baking', 'coding']
    },
    {
        title: 'Croissants and Coffee',
        body: 'The perfect pairing for brainstorming your next big idea.',
        tags: ['croissant', 'coffee', 'brainstorming']
    },
    {
        title: 'The Science Behind Croissants',
        body: 'Understanding the chemistry of croissants and its lessons for developers.',
        tags: ['croissant', 'science', 'developers']
    },
    {
        title: 'The Rise of AI',
        body: 'Artificial Intelligence (AI) is transforming the future.',
        tags: ['ai', 'artificial intelligence']
    },
    {
        title: 'Organising JavaScript Projects',
        body: 'Organise or organize? Either way, this guide helps structure your JS projects.',
        tags: ['organise', 'organize', 'js', 'project']
    },
    {
        title: 'Resume vs. Resumé',
        body: 'Learn how to write a winning resume (or resumé).',
        tags: ['resume', 'resumé', 'career']
    }
];

async function seed() {
    await createIndexWithCustomAnalyzer();

    const allArticles = [...articles, ...extraArticles];

    for (const [i, article] of allArticles.entries()) {
        await client.index({
            index: 'articles',
            id: i + 1,
            document: article
        });
    }

    await client.indices.refresh({ index: 'articles' });
    console.log(`✅ Seeded ${allArticles.length} articles!`);
}

seed().catch(console.error);