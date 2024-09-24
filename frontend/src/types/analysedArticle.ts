export type AnalysedArticle = {
    date: string;
    headline: string;
    published: string;
    url: string;
    content: string;
    mainClaim: 'main 1' | 'main 2' | 'main 3';
    subClaim: 'sub1' | 'sub2' | 'sub3';
};

export const dummyAnalysedArticles: AnalysedArticle[] = [
    // Main Claim 1 (10 entries)
    {
        date: '2024-01-01T00:00:00Z',
        headline: 'New Green Energy Initiative Launched',
        published: '2024-01-01T08:00:00Z',
        url: 'https://example.com/article1',
        content:
            'A groundbreaking green energy initiative has been launched today, promising to revolutionize sustainable power generation.',
        mainClaim: 'main 1',
        subClaim: 'sub1',
    },
    {
        date: '2024-01-04T00:00:00Z',
        headline: 'Breakthrough in Renewable Energy Storage',
        published: '2024-01-04T14:30:00Z',
        url: 'https://example.com/article4',
        content:
            'Scientists announce a major breakthrough in renewable energy storage, potentially solving intermittency issues.',
        mainClaim: 'main 1',
        subClaim: 'sub2',
    },
    {
        date: '2024-01-07T00:00:00Z',
        headline: 'Global Investment in Clean Energy Soars',
        published: '2024-01-07T09:45:00Z',
        url: 'https://example.com/article7',
        content:
            'Investment in clean energy technologies reaches record highs as countries race to meet climate goals.',
        mainClaim: 'main 1',
        subClaim: 'sub3',
    },
    {
        date: '2024-01-10T00:00:00Z',
        headline: 'New Solar Panel Technology Doubles Efficiency',
        published: '2024-01-10T11:20:00Z',
        url: 'https://example.com/article10',
        content:
            'Researchers unveil a new solar panel technology that doubles the efficiency of current models.',
        mainClaim: 'main 1',
        subClaim: 'sub1',
    },
    {
        date: '2024-01-13T00:00:00Z',
        headline: 'Wind Farm Project Sets New Records',
        published: '2024-01-13T16:00:00Z',
        url: 'https://example.com/article13',
        content:
            'The worlds largest offshore wind farm project breaks ground, setting new records for renewable energy capacity.',
        mainClaim: 'main 1',
        subClaim: 'sub2',
    },
    {
        date: '2024-01-16T00:00:00Z',
        headline: 'Green Hydrogen Production Costs Plummet',
        published: '2024-01-16T10:30:00Z',
        url: 'https://example.com/article16',
        content:
            'The cost of producing green hydrogen falls dramatically, making it competitive with fossil fuels.',
        mainClaim: 'main 1',
        subClaim: 'sub3',
    },
    {
        date: '2024-01-19T00:00:00Z',
        headline: 'Innovative Tidal Energy Project Launches',
        published: '2024-01-19T13:15:00Z',
        url: 'https://example.com/article19',
        content:
            'A new tidal energy project demonstrates the potential of harnessing ocean currents for sustainable power.',
        mainClaim: 'main 1',
        subClaim: 'sub1',
    },
    {
        date: '2024-01-22T00:00:00Z',
        headline: 'Electric Vehicle Battery Breakthrough',
        published: '2024-01-22T09:00:00Z',
        url: 'https://example.com/article22',
        content:
            'A new battery technology promises to extend electric vehicle range and reduce charging times significantly.',
        mainClaim: 'main 1',
        subClaim: 'sub2',
    },
    {
        date: '2024-01-25T00:00:00Z',
        headline: 'Carbon Capture Technology Shows Promise',
        published: '2024-01-25T15:45:00Z',
        url: 'https://example.com/article25',
        content:
            'New carbon capture and storage technology demonstrates potential for large-scale greenhouse gas reduction.',
        mainClaim: 'main 1',
        subClaim: 'sub3',
    },
    {
        date: '2024-01-28T00:00:00Z',
        headline: 'Geothermal Energy Expands Globally',
        published: '2024-01-28T11:30:00Z',
        url: 'https://example.com/article28',
        content:
            'Geothermal energy projects are expanding worldwide, tapping into Earths heat for sustainable power generation.',
        mainClaim: 'main 1',
        subClaim: 'sub1',
    },

    // Main Claim 2 (10 entries)
    {
        date: '2024-01-02T00:00:00Z',
        headline: 'Tech Giant Unveils Latest Smartphone',
        published: '2024-01-02T09:30:00Z',
        url: 'https://example.com/article2',
        content:
            'The latest smartphone model has been unveiled, featuring cutting-edge AI capabilities and improved battery life.',
        mainClaim: 'main 2',
        subClaim: 'sub1',
    },
    {
        date: '2024-01-05T00:00:00Z',
        headline: 'AI-Powered Medical Diagnosis Tool Launched',
        published: '2024-01-05T13:00:00Z',
        url: 'https://example.com/article5',
        content:
            'A new AI-powered tool promises to revolutionize medical diagnoses, improving accuracy and speed.',
        mainClaim: 'main 2',
        subClaim: 'sub2',
    },
    {
        date: '2024-01-08T00:00:00Z',
        headline: 'Quantum Computing Milestone Achieved',
        published: '2024-01-08T10:45:00Z',
        url: 'https://example.com/article8',
        content:
            'Scientists report a major breakthrough in quantum computing, bringing practical applications closer to reality.',
        mainClaim: 'main 2',
        subClaim: 'sub3',
    },
    {
        date: '2024-01-11T00:00:00Z',
        headline: 'Revolutionary 3D Printing Technique Unveiled',
        published: '2024-01-11T16:30:00Z',
        url: 'https://example.com/article11',
        content:
            'A new 3D printing technique promises to transform manufacturing with unprecedented speed and precision.',
        mainClaim: 'main 2',
        subClaim: 'sub1',
    },
    {
        date: '2024-01-14T00:00:00Z',
        headline: 'Breakthrough in Brain-Computer Interfaces',
        published: '2024-01-14T11:15:00Z',
        url: 'https://example.com/article14',
        content:
            'Researchers demonstrate a new brain-computer interface that allows direct mental control of digital devices.',
        mainClaim: 'main 2',
        subClaim: 'sub2',
    },
    {
        date: '2024-01-17T00:00:00Z',
        headline: 'Advanced Robotics System Mimics Human Dexterity',
        published: '2024-01-17T14:00:00Z',
        url: 'https://example.com/article17',
        content:
            'A new robotics system achieves human-like dexterity, opening up new possibilities in automation and prosthetics.',
        mainClaim: 'main 2',
        subClaim: 'sub3',
    },
    {
        date: '2024-01-20T00:00:00Z',
        headline: 'Next-Generation Internet Protocol Implemented',
        published: '2024-01-20T09:30:00Z',
        url: 'https://example.com/article20',
        content:
            'A new internet protocol promises faster speeds, improved security, and enhanced connectivity worldwide.',
        mainClaim: 'main 2',
        subClaim: 'sub1',
    },
    {
        date: '2024-01-23T00:00:00Z',
        headline: 'Autonomous Vehicle Network Launches in Major City',
        published: '2024-01-23T12:45:00Z',
        url: 'https://example.com/article23',
        content:
            'The first large-scale network of fully autonomous vehicles begins operation in a major metropolitan area.',
        mainClaim: 'main 2',
        subClaim: 'sub2',
    },
    {
        date: '2024-01-26T00:00:00Z',
        headline: 'Revolutionary Energy-Efficient Processor Unveiled',
        published: '2024-01-26T10:00:00Z',
        url: 'https://example.com/article26',
        content:
            'A new processor design promises to dramatically reduce energy consumption in computing devices.',
        mainClaim: 'main 2',
        subClaim: 'sub3',
    },
    {
        date: '2024-01-29T00:00:00Z',
        headline: 'Augmented Reality Platform Transforms Education',
        published: '2024-01-29T15:30:00Z',
        url: 'https://example.com/article29',
        content:
            'A new augmented reality platform is revolutionizing education, offering immersive learning experiences.',
        mainClaim: 'main 2',
        subClaim: 'sub1',
    },

    // Main Claim 3 (10 entries)
    {
        date: '2024-01-03T00:00:00Z',
        headline: 'Global Climate Summit Reaches New Accord',
        published: '2024-01-03T10:15:00Z',
        url: 'https://example.com/article3',
        content:
            'World leaders have reached a new agreement on climate change, setting ambitious targets for carbon reduction.',
        mainClaim: 'main 3',
        subClaim: 'sub3',
    },
    {
        date: '2024-01-06T00:00:00Z',
        headline: 'Major Reforestation Initiative Announced',
        published: '2024-01-06T12:00:00Z',
        url: 'https://example.com/article6',
        content:
            'A global coalition launches a massive reforestation project aimed at combating climate change.',
        mainClaim: 'main 3',
        subClaim: 'sub1',
    },
    {
        date: '2024-01-09T00:00:00Z',
        headline: 'Ocean Cleanup Project Shows Promising Results',
        published: '2024-01-09T14:30:00Z',
        url: 'https://example.com/article9',
        content:
            'An innovative ocean cleanup project reports significant progress in removing plastic waste from the Pacific.',
        mainClaim: 'main 3',
        subClaim: 'sub2',
    },
    {
        date: '2024-01-12T00:00:00Z',
        headline: 'New Study Reveals Rapid Ice Melt in Antarctica',
        published: '2024-01-12T09:00:00Z',
        url: 'https://example.com/article12',
        content:
            'Scientists report accelerated ice melt in Antarctica, raising concerns about sea level rise.',
        mainClaim: 'main 3',
        subClaim: 'sub3',
    },
    {
        date: '2024-01-15T00:00:00Z',
        headline: 'Sustainable Agriculture Techniques Gain Traction',
        published: '2024-01-15T11:45:00Z',
        url: 'https://example.com/article15',
        content:
            'Farmers worldwide are adopting sustainable agriculture techniques, reducing environmental impact.',
        mainClaim: 'main 3',
        subClaim: 'sub1',
    },
    {
        date: '2024-01-18T00:00:00Z',
        headline: 'Marine Protected Areas Expanded Globally',
        published: '2024-01-18T13:30:00Z',
        url: 'https://example.com/article18',
        content:
            'Nations agree to significantly expand marine protected areas, safeguarding ocean biodiversity.',
        mainClaim: 'main 3',
        subClaim: 'sub2',
    },
    {
        date: '2024-01-21T00:00:00Z',
        headline: 'Breakthrough in Carbon-Neutral Concrete Production',
        published: '2024-01-21T10:00:00Z',
        url: 'https://example.com/article21',
        content:
            'Researchers develop a new method for producing carbon-neutral concrete, potentially transforming the construction industry.',
        mainClaim: 'main 3',
        subClaim: 'sub3',
    },
    {
        date: '2024-01-24T00:00:00Z',
        headline: 'Global Renewable Energy Capacity Surpasses Fossil Fuels',
        published: '2024-01-24T15:15:00Z',
        url: 'https://example.com/article24',
        content:
            'For the first time, global renewable energy capacity exceeds that of fossil fuels, marking a turning point in energy transition.',
        mainClaim: 'main 3',
        subClaim: 'sub1',
    },
    {
        date: '2024-01-27T00:00:00Z',
        headline: 'New Technology Removes Microplastics from Water',
        published: '2024-01-27T12:30:00Z',
        url: 'https://example.com/article27',
        content:
            'A breakthrough technology demonstrates effective removal of microplastics from water sources at scale.',
        mainClaim: 'main 3',
        subClaim: 'sub2',
    },
    {
        date: '2024-01-30T00:00:00Z',
        headline: 'Global Biodiversity Index Shows Signs of Recovery',
        published: '2024-01-30T09:45:00Z',
        url: 'https://example.com/article30',
        content:
            'The latest global biodiversity index indicates a slight recovery in species populations, offering hope for conservation efforts.',
        mainClaim: 'main 3',
        subClaim: 'sub3',
    },
];
