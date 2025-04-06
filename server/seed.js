const client = require('./esClient');

const articles = Array.from({ length: 50 }, (_, i) => ({
    title: [
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
    ][i % 50],
    body: `This is article ${i + 1}, discussing the topic "${[
        'search engines',
        'frontend development',
        'backend services',
        'programming patterns',
        'tech tutorials',
        'lifestyle habits',
        'mental wellness',
        'financial literacy',
        'education tips',
        'travel hacks'
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
    console.log('Seeded 50 articles!');
}

seed().catch(console.error);
