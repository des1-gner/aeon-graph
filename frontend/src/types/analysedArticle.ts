export type AnalysedArticle = {
    date: string;
    headline: string;
    published: string;
    url: string;
    content: string;
    tags: Array<'tag1' | 'tag2' | 'tag3'>;
};

export const dummyAnalysedArticles: AnalysedArticle[] = [
    {
        date: '2024-01-01T00:00:00Z',
        headline: 'New Green Energy Initiative Launched',
        published: '2024-01-01T08:00:00Z',
        url: 'https://example.com/article1',
        content:
            'A groundbreaking green energy initiative has been launched today, promising to revolutionize sustainable power generation.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-01-02T00:00:00Z',
        headline: 'Tech Giant Unveils Latest Smartphone',
        published: '2024-01-02T09:30:00Z',
        url: 'https://example.com/article2',
        content:
            'The latest smartphone model has been unveiled, featuring cutting-edge AI capabilities and improved battery life.',
        tags: ['tag1'],
    },
    {
        date: '2024-01-03T00:00:00Z',
        headline: 'Global Climate Summit Reaches New Accord',
        published: '2024-01-03T10:15:00Z',
        url: 'https://example.com/article3',
        content:
            'World leaders have reached a new agreement on climate change, setting ambitious targets for carbon reduction.',
        tags: ['tag1', 'tag3'],
    },
    {
        date: '2024-01-04T00:00:00Z',
        headline: 'Breakthrough in Quantum Computing Announced',
        published: '2024-01-04T11:00:00Z',
        url: 'https://example.com/article4',
        content:
            'Scientists have achieved a major breakthrough in quantum computing, paving the way for unprecedented computational power.',
        tags: ['tag2'],
    },
    {
        date: '2024-01-05T00:00:00Z',
        headline: 'New Study Reveals Benefits of Mediterranean Diet',
        published: '2024-01-05T12:45:00Z',
        url: 'https://example.com/article5',
        content:
            'A comprehensive study has confirmed the long-term health benefits of adhering to a Mediterranean diet.',
        tags: ['tag2', 'tag3'],
    },
    {
        date: '2024-01-06T00:00:00Z',
        headline: 'Space Tourism Company Announces First Civilian Moon Mission',
        published: '2024-01-06T14:30:00Z',
        url: 'https://example.com/article6',
        content:
            'A private space company has announced plans for the first-ever civilian mission to orbit the Moon.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-01-07T00:00:00Z',
        headline: 'Artificial Intelligence Writes Award-Winning Novel',
        published: '2024-01-07T16:00:00Z',
        url: 'https://example.com/article7',
        content:
            'In a first for machine learning, an AI-generated novel has won a prestigious literary award.',
        tags: ['tag2'],
    },
    {
        date: '2024-01-08T00:00:00Z',
        headline: 'Renewable Energy Surpasses Fossil Fuels in Global Usage',
        published: '2024-01-08T09:00:00Z',
        url: 'https://example.com/article8',
        content:
            'For the first time in history, renewable energy sources have overtaken fossil fuels in global energy consumption.',
        tags: ['tag1', 'tag3'],
    },
    {
        date: '2024-01-09T00:00:00Z',
        headline: "Major Breakthrough in Alzheimer's Treatment",
        published: '2024-01-09T10:30:00Z',
        url: 'https://example.com/article9',
        content:
            "Researchers have developed a promising new treatment for Alzheimer's disease, showing significant cognitive improvements in trials.",
        tags: ['tag3'],
    },
    {
        date: '2024-01-10T00:00:00Z',
        headline: 'Global Internet Coverage Reaches 99% of Population',
        published: '2024-01-10T11:45:00Z',
        url: 'https://example.com/article10',
        content:
            "A milestone in global connectivity has been reached, with internet access now available to 99% of the world's population.",
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-01-11T00:00:00Z',
        headline: 'Stock Market Reaches All-Time High',
        published: '2024-01-11T08:00:00Z',
        url: 'https://example.com/article11',
        content:
            'The stock market has surged to unprecedented levels, breaking previous records and boosting investor confidence.',
        tags: ['tag2'],
    },
    {
        date: '2024-01-12T00:00:00Z',
        headline: 'New Cancer Treatment Shows Promising Results',
        published: '2024-01-12T09:30:00Z',
        url: 'https://example.com/article12',
        content:
            'A novel cancer treatment has shown remarkable success in clinical trials, offering hope for patients with advanced-stage cancers.',
        tags: ['tag2', 'tag3'],
    },
    {
        date: '2024-01-13T00:00:00Z',
        headline: 'Autonomous Vehicles Approved for Widespread Use',
        published: '2024-01-13T10:15:00Z',
        url: 'https://example.com/article13',
        content:
            'Regulatory bodies have given the green light for the widespread deployment of fully autonomous vehicles on public roads.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-01-14T00:00:00Z',
        headline: 'Breakthrough in Nuclear Fusion Energy',
        published: '2024-01-14T11:00:00Z',
        url: 'https://example.com/article14',
        content:
            'Scientists have achieved a major milestone in nuclear fusion, bringing the promise of limitless clean energy closer to reality.',
        tags: ['tag1', 'tag3'],
    },
    {
        date: '2024-01-15T00:00:00Z',
        headline: 'Global Literacy Rate Reaches 95%',
        published: '2024-01-15T12:45:00Z',
        url: 'https://example.com/article15',
        content:
            'A UN report reveals that global literacy rates have reached an all-time high of 95%, marking significant progress in education.',
        tags: ['tag3'],
    },
    {
        date: '2024-02-01T00:00:00Z',
        headline:
            'Artificial Photosynthesis Breakthrough Could Revolutionize Agriculture',
        published: '2024-02-01T08:00:00Z',
        url: 'https://example.com/article31',
        content:
            'Scientists have developed an artificial photosynthesis system that could dramatically increase crop yields and reduce water usage.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-02-02T00:00:00Z',
        headline: 'Global Peace Index Reaches All-Time High',
        published: '2024-02-02T09:30:00Z',
        url: 'https://example.com/article32',
        content:
            'The latest Global Peace Index report shows a significant reduction in global conflicts and an increase in diplomatic resolutions.',
        tags: ['tag3'],
    },
    {
        date: '2024-02-03T00:00:00Z',
        headline: 'Quantum Internet Prototype Successfully Tested',
        published: '2024-02-03T10:15:00Z',
        url: 'https://example.com/article33',
        content:
            'Researchers have successfully tested a prototype quantum internet, paving the way for ultra-secure global communications.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-02-04T00:00:00Z',
        headline: 'New Technique Removes Microplastics from Oceans at Scale',
        published: '2024-02-04T11:00:00Z',
        url: 'https://example.com/article34',
        content:
            'A groundbreaking technique for removing microplastics from oceans has been successfully deployed, showing promising results for large-scale cleanup.',
        tags: ['tag2', 'tag3'],
    },
    {
        date: '2024-02-05T00:00:00Z',
        headline: 'Universal Flu Vaccine Shows 95% Efficacy in Trials',
        published: '2024-02-05T12:45:00Z',
        url: 'https://example.com/article35',
        content:
            'A new universal flu vaccine, effective against all known strains, has shown remarkable results in large-scale clinical trials.',
        tags: ['tag1'],
    },
    {
        date: '2024-02-06T00:00:00Z',
        headline: 'First Commercial Hydrogen-Powered Aircraft Takes Flight',
        published: '2024-02-06T14:30:00Z',
        url: 'https://example.com/article36',
        content:
            'The aviation industry marks a milestone as the first commercial hydrogen-powered aircraft completes its maiden voyage.',
        tags: ['tag1', 'tag3'],
    },
    {
        date: '2024-02-07T00:00:00Z',
        headline: 'Global Reforestation Initiative Exceeds 1 Trillion Trees',
        published: '2024-02-07T16:00:00Z',
        url: 'https://example.com/article37',
        content:
            'A worldwide reforestation effort has successfully planted over 1 trillion trees, significantly boosting carbon capture capabilities.',
        tags: ['tag2'],
    },
    {
        date: '2024-02-08T00:00:00Z',
        headline: 'Brain-Computer Interface Allows Paralyzed Patients to Walk',
        published: '2024-02-08T09:00:00Z',
        url: 'https://example.com/article38',
        content:
            'A revolutionary brain-computer interface has enabled paralyzed patients to walk again, marking a major breakthrough in neurotechnology.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-02-09T00:00:00Z',
        headline: "World's First Net-Zero City Becomes Fully Operational",
        published: '2024-02-09T10:30:00Z',
        url: 'https://example.com/article39',
        content:
            "The world's first net-zero city, designed to produce zero carbon emissions, is now fully operational and inhabited.",
        tags: ['tag3'],
    },
    {
        date: '2024-02-10T00:00:00Z',
        headline: 'Gene Therapy Cures Rare Genetic Disorder',
        published: '2024-02-10T11:45:00Z',
        url: 'https://example.com/article40',
        content:
            'A breakthrough gene therapy treatment has successfully cured patients of a previously incurable rare genetic disorder.',
        tags: ['tag1', 'tag3'],
    },
    {
        date: '2024-02-11T00:00:00Z',
        headline: 'Sustainable Fusion Reactor Achieves Net Energy Gain',
        published: '2024-02-11T08:00:00Z',
        url: 'https://example.com/article41',
        content:
            'Scientists have achieved a sustained fusion reaction with net energy gain, bringing limitless clean energy one step closer to reality.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-02-12T00:00:00Z',
        headline: 'Global Poverty Rate Falls Below 5% for the First Time',
        published: '2024-02-12T09:30:00Z',
        url: 'https://example.com/article42',
        content:
            'United Nations reports that global poverty rates have dropped below 5%, marking a historic milestone in the fight against poverty.',
        tags: ['tag3'],
    },
    {
        date: '2024-02-13T00:00:00Z',
        headline: 'Artificial General Intelligence Passes Turing Test',
        published: '2024-02-13T10:15:00Z',
        url: 'https://example.com/article43',
        content:
            'In a landmark achievement, an artificial general intelligence system has convincingly passed the Turing test, demonstrating human-like cognitive abilities.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-02-14T00:00:00Z',
        headline: 'Lab-Grown Organs Solve Transplant Shortage Crisis',
        published: '2024-02-14T11:00:00Z',
        url: 'https://example.com/article44',
        content:
            'Bioengineered organs grown in laboratories have successfully addressed the global organ transplant shortage, saving countless lives.',
        tags: ['tag2', 'tag3'],
    },
    {
        date: '2024-02-15T00:00:00Z',
        headline: 'First Manned Mission to Mars Launches Successfully',
        published: '2024-02-15T12:45:00Z',
        url: 'https://example.com/article45',
        content:
            'The first crewed mission to Mars has successfully launched, marking a new era in human space exploration.',
        tags: ['tag1'],
    },
    {
        date: '2024-02-16T00:00:00Z',
        headline: 'Revolutionary Carbon Capture Technology Deployed Globally',
        published: '2024-02-16T14:30:00Z',
        url: 'https://example.com/article46',
        content:
            'A new carbon capture technology has been deployed on a global scale, significantly reducing atmospheric CO2 levels.',
        tags: ['tag1', 'tag3'],
    },
    {
        date: '2024-02-17T00:00:00Z',
        headline: 'Universal Basic Income Program Shows Positive Results',
        published: '2024-02-17T16:00:00Z',
        url: 'https://example.com/article47',
        content:
            'A large-scale universal basic income program has shown promising results in reducing poverty and improving overall well-being.',
        tags: ['tag2'],
    },
    {
        date: '2024-02-18T00:00:00Z',
        headline:
            "Breakthrough in Alzheimer's Treatment Reverses Cognitive Decline",
        published: '2024-02-18T09:00:00Z',
        url: 'https://example.com/article48',
        content:
            "A new treatment for Alzheimer's disease has shown unprecedented success in reversing cognitive decline in clinical trials.",
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-02-19T00:00:00Z',
        headline: 'Global Renewable Energy Usage Surpasses 75%',
        published: '2024-02-19T10:30:00Z',
        url: 'https://example.com/article49',
        content:
            'Renewable energy sources now account for over 75% of global energy consumption, marking a major milestone in sustainable development.',
        tags: ['tag3'],
    },
    {
        date: '2024-02-20T00:00:00Z',
        headline: 'Autonomous Underwater Vehicles Map Entire Ocean Floor',
        published: '2024-02-20T11:45:00Z',
        url: 'https://example.com/article50',
        content:
            'A fleet of autonomous underwater vehicles has completed a comprehensive mapping of the entire ocean floor, revealing new insights about marine ecosystems.',
        tags: ['tag1', 'tag3'],
    },
    {
        date: '2024-02-21T00:00:00Z',
        headline: 'Nanobots Successfully Treat Cancer in Human Trials',
        published: '2024-02-21T08:00:00Z',
        url: 'https://example.com/article51',
        content:
            'Microscopic nanobots have shown remarkable success in targeting and eliminating cancer cells in human clinical trials.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-02-22T00:00:00Z',
        headline: 'Global Literacy Rate Reaches 99%',
        published: '2024-02-22T09:30:00Z',
        url: 'https://example.com/article52',
        content:
            'UNESCO reports that global literacy rates have reached an unprecedented 99%, thanks to innovative education programs and technology.',
        tags: ['tag3'],
    },
    {
        date: '2024-02-23T00:00:00Z',
        headline:
            'Quantum Encryption Becomes Global Standard for Data Security',
        published: '2024-02-23T10:15:00Z',
        url: 'https://example.com/article53',
        content:
            'Quantum encryption has been adopted as the new global standard for data security, promising unbreakable protection against cyber threats.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-02-24T00:00:00Z',
        headline: 'Vertical Farming Revolution Solves Urban Food Scarcity',
        published: '2024-02-24T11:00:00Z',
        url: 'https://example.com/article54',
        content:
            'Large-scale vertical farming initiatives in major cities have successfully addressed urban food scarcity issues.',
        tags: ['tag2', 'tag3'],
    },
    {
        date: '2024-02-25T00:00:00Z',
        headline:
            'Human Longevity Breakthrough Extends Average Lifespan to 120 Years',
        published: '2024-02-25T12:45:00Z',
        url: 'https://example.com/article55',
        content:
            'A revolutionary treatment has been shown to extend the average human lifespan to 120 years while maintaining good health and cognitive function.',
        tags: ['tag1'],
    },
    {
        date: '2024-02-26T00:00:00Z',
        headline:
            'Global Fresh Water Crisis Solved with Atmospheric Water Generators',
        published: '2024-02-26T14:30:00Z',
        url: 'https://example.com/article56',
        content:
            'Large-scale atmospheric water generators have been deployed globally, effectively solving fresh water scarcity in arid regions.',
        tags: ['tag1', 'tag3'],
    },
    {
        date: '2024-02-27T00:00:00Z',
        headline: 'Plastic-Eating Bacteria Deployed in Oceans Worldwide',
        published: '2024-02-27T16:00:00Z',
        url: 'https://example.com/article57',
        content:
            'Genetically engineered bacteria capable of breaking down plastic have been successfully deployed in oceans worldwide, tackling plastic pollution.',
        tags: ['tag2'],
    },
    {
        date: '2024-02-28T00:00:00Z',
        headline: 'Mind-Reading Technology Assists Non-Verbal Communication',
        published: '2024-02-28T09:00:00Z',
        url: 'https://example.com/article58',
        content:
            'A new mind-reading technology has been developed to assist non-verbal individuals in communicating their thoughts and needs effectively.',
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-02-29T00:00:00Z',
        headline: 'Global Wildlife Populations Show Significant Recovery',
        published: '2024-02-29T10:30:00Z',
        url: 'https://example.com/article59',
        content:
            'Conservation efforts have led to a significant recovery in global wildlife populations, with many species rebounding from near-extinction.',
        tags: ['tag3'],
    },
    {
        date: '2024-03-01T00:00:00Z',
        headline: 'Teleportation of Complex Molecules Achieved',
        published: '2024-03-01T11:45:00Z',
        url: 'https://example.com/article60',
        content:
            'Scientists have successfully teleported complex molecules over a significant distance, paving the way for revolutionary applications in various fields.',
        tags: ['tag1', 'tag3'],
    },
    {
        date: '2024-03-02T00:00:00Z',
        headline:
            'AI-Powered Education System Personalizes Learning for Every Student',
        published: '2024-03-02T08:00:00Z',
        url: 'https://example.com/article61',
        content:
            "An AI-driven education system has been implemented globally, providing personalized learning experiences tailored to each student's needs and abilities.",
        tags: ['tag1', 'tag2'],
    },
    {
        date: '2024-03-03T00:00:00Z',
        headline: "World's First Space Elevator Becomes Operational",
        published: '2024-03-03T09:30:00Z',
        url: 'https://example.com/article62',
        content:
            "The world's first space elevator has become operational, dramatically reducing the cost of space travel and opening up new possibilities for space exploration.",
        tags: ['tag3'],
    },
];
