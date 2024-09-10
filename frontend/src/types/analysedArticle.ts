export type AnalysedArticle = {
    date: string;
    headline: string;
    published: string;
    url: string;
    content: string;
    tags: 'tag1' | 'tag2' | 'tag3';
};

export const dummyAnalysedArticles: AnalysedArticle[] = [
    {
        date: '2024-01-01T00:00:00Z',
        headline: 'New Green Energy Initiative Launched',
        published: '2024-01-01T08:00:00Z',
        url: 'https://example.com/article1',
        content:
            'A groundbreaking green energy initiative has been launched today, promising to revolutionize sustainable power generation.',
        tags: 'tag1',
    },
    {
        date: '2024-01-02T00:00:00Z',
        headline: 'Tech Giant Unveils Latest Smartphone',
        published: '2024-01-02T09:30:00Z',
        url: 'https://example.com/article2',
        content:
            'The latest smartphone model has been unveiled, featuring cutting-edge AI capabilities and improved battery life.',
        tags: 'tag1',
    },
    {
        date: '2024-01-03T00:00:00Z',
        headline: 'Global Climate Summit Reaches New Accord',
        published: '2024-01-03T10:15:00Z',
        url: 'https://example.com/article3',
        content:
            'World leaders have reached a new agreement on climate change, setting ambitious targets for carbon reduction.',
        tags: 'tag1',
    },
    {
        date: '2024-01-04T00:00:00Z',
        headline: 'Breakthrough in Quantum Computing Announced',
        published: '2024-01-04T11:00:00Z',
        url: 'https://example.com/article4',
        content:
            'Scientists have achieved a major breakthrough in quantum computing, paving the way for unprecedented computational power.',
        tags: 'tag1',
    },
    {
        date: '2024-01-05T00:00:00Z',
        headline: 'New Study Reveals Benefits of Mediterranean Diet',
        published: '2024-01-05T12:45:00Z',
        url: 'https://example.com/article5',
        content:
            'A comprehensive study has confirmed the long-term health benefits of adhering to a Mediterranean diet.',
        tags: 'tag1',
    },
    {
        date: '2024-01-06T00:00:00Z',
        headline: 'Space Tourism Company Announces First Civilian Moon Mission',
        published: '2024-01-06T14:30:00Z',
        url: 'https://example.com/article6',
        content:
            'A private space company has announced plans for the first-ever civilian mission to orbit the Moon.',
        tags: 'tag1',
    },
    {
        date: '2024-01-07T00:00:00Z',
        headline: 'Artificial Intelligence Writes Award-Winning Novel',
        published: '2024-01-07T16:00:00Z',
        url: 'https://example.com/article7',
        content:
            'In a first for machine learning, an AI-generated novel has won a prestigious literary award.',
        tags: 'tag1',
    },
    {
        date: '2024-01-08T00:00:00Z',
        headline: 'Renewable Energy Surpasses Fossil Fuels in Global Usage',
        published: '2024-01-08T09:00:00Z',
        url: 'https://example.com/article8',
        content:
            'For the first time in history, renewable energy sources have overtaken fossil fuels in global energy consumption.',
        tags: 'tag1',
    },
    {
        date: '2024-01-09T00:00:00Z',
        headline: "Major Breakthrough in Alzheimer's Treatment",
        published: '2024-01-09T10:30:00Z',
        url: 'https://example.com/article9',
        content:
            "Researchers have developed a promising new treatment for Alzheimer's disease, showing significant cognitive improvements in trials.",
        tags: 'tag1',
    },
    {
        date: '2024-01-10T00:00:00Z',
        headline: 'Global Internet Coverage Reaches 99% of Population',
        published: '2024-01-10T11:45:00Z',
        url: 'https://example.com/article10',
        content:
            "A milestone in global connectivity has been reached, with internet access now available to 99% of the world's population.",
        tags: 'tag1',
    },
    {
        date: '2024-01-11T00:00:00Z',
        headline: 'Stock Market Reaches All-Time High',
        published: '2024-01-11T08:00:00Z',
        url: 'https://example.com/article11',
        content:
            'The stock market has surged to unprecedented levels, breaking previous records and boosting investor confidence.',
        tags: 'tag2',
    },
    {
        date: '2024-01-12T00:00:00Z',
        headline: 'New Cancer Treatment Shows Promising Results',
        published: '2024-01-12T09:30:00Z',
        url: 'https://example.com/article12',
        content:
            'A novel cancer treatment has shown remarkable success in clinical trials, offering hope for patients with advanced-stage cancers.',
        tags: 'tag2',
    },
    {
        date: '2024-01-13T00:00:00Z',
        headline: 'Autonomous Vehicles Approved for Widespread Use',
        published: '2024-01-13T10:15:00Z',
        url: 'https://example.com/article13',
        content:
            'Regulatory bodies have given the green light for the widespread deployment of fully autonomous vehicles on public roads.',
        tags: 'tag2',
    },
    {
        date: '2024-01-14T00:00:00Z',
        headline: 'Breakthrough in Nuclear Fusion Energy',
        published: '2024-01-14T11:00:00Z',
        url: 'https://example.com/article14',
        content:
            'Scientists have achieved a major milestone in nuclear fusion, bringing the promise of limitless clean energy closer to reality.',
        tags: 'tag2',
    },
    {
        date: '2024-01-15T00:00:00Z',
        headline: 'Global Literacy Rate Reaches 95%',
        published: '2024-01-15T12:45:00Z',
        url: 'https://example.com/article15',
        content:
            'A UN report reveals that global literacy rates have reached an all-time high of 95%, marking significant progress in education.',
        tags: 'tag2',
    },
    {
        date: '2024-01-16T00:00:00Z',
        headline: 'Revolutionary Water Purification Technology Unveiled',
        published: '2024-01-16T14:30:00Z',
        url: 'https://example.com/article16',
        content:
            'A new water purification technology promises to provide clean drinking water to millions in water-scarce regions.',
        tags: 'tag2',
    },
    {
        date: '2024-01-17T00:00:00Z',
        headline: 'First Human Colony Established on Mars',
        published: '2024-01-17T16:00:00Z',
        url: 'https://example.com/article17',
        content:
            'In a historic moment for space exploration, the first permanent human settlement has been established on Mars.',
        tags: 'tag2',
    },
    {
        date: '2024-01-18T00:00:00Z',
        headline: 'Global Agreement Reached on Plastic Waste Reduction',
        published: '2024-01-18T09:00:00Z',
        url: 'https://example.com/article18',
        content:
            'World leaders have signed a landmark agreement to significantly reduce plastic waste and protect marine ecosystems.',
        tags: 'tag2',
    },
    {
        date: '2024-01-19T00:00:00Z',
        headline:
            'Artificial Intelligence Achieves Human-Level Language Understanding',
        published: '2024-01-19T10:30:00Z',
        url: 'https://example.com/article19',
        content:
            'A new AI system has demonstrated human-level understanding of natural language, marking a significant milestone in AI development.',
        tags: 'tag2',
    },
    {
        date: '2024-01-20T00:00:00Z',
        headline: 'Universal Basic Income Program Launched in Major Economy',
        published: '2024-01-20T11:45:00Z',
        url: 'https://example.com/article20',
        content:
            'A leading world economy has implemented a nationwide universal basic income program, sparking global interest and debate.',
        tags: 'tag2',
    },
    {
        date: '2024-01-21T00:00:00Z',
        headline: 'Record-Breaking Heatwave Sweeps Across Continents',
        published: '2024-01-21T08:00:00Z',
        url: 'https://example.com/article21',
        content:
            'Multiple countries are experiencing unprecedented high temperatures, raising concerns about climate change impacts.',
        tags: 'tag3',
    },
    {
        date: '2024-01-22T00:00:00Z',
        headline: 'Major Cyberattack Disrupts Global Banking Systems',
        published: '2024-01-22T09:30:00Z',
        url: 'https://example.com/article22',
        content:
            'A sophisticated cyberattack has caused widespread disruption to international banking networks, prompting security concerns.',
        tags: 'tag3',
    },
    {
        date: '2024-01-23T00:00:00Z',
        headline: 'Endangered Species Makes Surprising Comeback',
        published: '2024-01-23T10:15:00Z',
        url: 'https://example.com/article23',
        content:
            'Conservation efforts have led to a remarkable recovery of a critically endangered species, offering hope for biodiversity.',
        tags: 'tag3',
    },
    {
        date: '2024-01-24T00:00:00Z',
        headline: 'Virtual Reality Education Platform Revolutionizes Learning',
        published: '2024-01-24T11:00:00Z',
        url: 'https://example.com/article24',
        content:
            'A new virtual reality platform is transforming education, offering immersive learning experiences across various subjects.',
        tags: 'tag3',
    },
    {
        date: '2024-01-25T00:00:00Z',
        headline: 'Global Population Reaches 9 Billion',
        published: '2024-01-25T12:45:00Z',
        url: 'https://example.com/article25',
        content:
            "The world's population has officially reached 9 billion, raising questions about resource management and sustainability.",
        tags: 'tag3',
    },
    {
        date: '2024-01-26T00:00:00Z',
        headline: 'Cryptocurrency Becomes Legal Tender in Major Economy',
        published: '2024-01-26T14:30:00Z',
        url: 'https://example.com/article26',
        content:
            'A leading world economy has officially adopted a cryptocurrency as legal tender, marking a shift in global financial systems.',
        tags: 'tag3',
    },
    {
        date: '2024-01-27T00:00:00Z',
        headline: 'Breakthrough in Antibiotic Research Combats Superbugs',
        published: '2024-01-27T16:00:00Z',
        url: 'https://example.com/article27',
        content:
            'Scientists have developed a new class of antibiotics effective against drug-resistant bacteria, addressing a major health concern.',
        tags: 'tag3',
    },
    {
        date: '2024-01-28T00:00:00Z',
        headline: 'Space Debris Cleanup Mission Launches',
        published: '2024-01-28T09:00:00Z',
        url: 'https://example.com/article28',
        content:
            "An international mission has begun to clear dangerous space debris from Earth's orbit, ensuring safer space exploration.",
        tags: 'tag3',
    },
    {
        date: '2024-01-29T00:00:00Z',
        headline: 'Global Treaty Signed to Protect Deep Sea Ecosystems',
        published: '2024-01-29T10:30:00Z',
        url: 'https://example.com/article29',
        content:
            'Nations have agreed on a landmark treaty to protect vulnerable deep sea ecosystems from exploitation and environmental damage.',
        tags: 'tag3',
    },
    {
        date: '2024-01-30T00:00:00Z',
        headline: 'Artificial Organs Successfully Transplanted in Humans',
        published: '2024-01-30T11:45:00Z',
        url: 'https://example.com/article30',
        content:
            'In a medical breakthrough, artificially grown organs have been successfully transplanted into human patients, potentially solving organ shortage issues.',
        tags: 'tag3',
    },
];
