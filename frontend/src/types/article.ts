export type Article = {
    title: string;
    publishedAt: string;
    author: string;
    content: string;
    description: string;
    sourceName: string;
    url: string;
    urlToImage: string;
};

export const demoData: Article[] = [
    {
        title: 'Global Temperature Rise Reaches New Record in 2024',
        publishedAt: '2024-08-15T09:30:00Z',
        author: 'Dr. Emma Richardson',
        content:
            'Scientists at the World Meteorological Organization (WMO) have confirmed that global temperatures in July 2024 were the highest ever recorded, surpassing the previous record set in 2023...',
        description:
            'July 2024 breaks global temperature records, raising concerns about accelerating climate change.',
        sourceName: 'Climate Science Today',
        url: 'https://www.climatesciencetoday.com/global-temperature-rise-2024',
        urlToImage:
            'https://www.climatesciencetoday.com/images/heatwave-2024.jpg',
    },
    {
        title: 'Arctic Sea Ice Reaches Lowest Extent in Recorded History',
        publishedAt: '2024-09-20T14:15:00Z',
        author: 'Dr. Lars Svensson',
        content:
            'Satellite data from the National Snow and Ice Data Center (NSIDC) shows that Arctic sea ice has reached its lowest extent since records began in 1979...',
        description:
            'Arctic sea ice hits record low, scientists warn of cascading effects on global climate.',
        sourceName: 'Polar Research Quarterly',
        url: 'https://www.polarresearchquarterly.org/arctic-sea-ice-2024',
        urlToImage:
            'https://www.polarresearchquarterly.org/images/arctic-ice-2024.jpg',
    },
    {
        title: 'Renewable Energy Surpasses Fossil Fuels in Global Electricity Production',
        publishedAt: '2024-07-01T11:00:00Z',
        author: 'Sarah Johnson',
        content:
            'In a landmark achievement for clean energy advocates, renewable sources have overtaken fossil fuels in global electricity production for the first time...',
        description:
            'Renewable energy becomes the primary source of global electricity, marking a turning point in the fight against climate change.',
        sourceName: 'Green Energy Report',
        url: 'https://www.greenenergyreport.com/renewables-surpass-fossil-fuels',
        urlToImage:
            'https://www.greenenergyreport.com/images/solar-wind-farm.jpg',
    },
    {
        title: 'Extreme Weather Events Linked to Climate Change Cost Global Economy $500 Billion in 2023',
        publishedAt: '2024-03-10T16:45:00Z',
        author: 'Dr. Maria Rodriguez',
        content:
            'A comprehensive study by the United Nations Office for Disaster Risk Reduction (UNDRR) has revealed that extreme weather events, exacerbated by climate change, resulted in economic losses of over $500 billion globally in 2023...',
        description:
            'UN report highlights the staggering economic impact of climate change-related weather events in 2023.',
        sourceName: 'Economic Impact Journal',
        url: 'https://www.economicimpactjournal.com/climate-change-costs-2023',
        urlToImage:
            'https://www.economicimpactjournal.com/images/hurricane-damage-2023.jpg',
    },
    {
        title: 'Breakthrough in Carbon Capture Technology Promises to Accelerate Climate Action',
        publishedAt: '2024-06-05T08:20:00Z',
        author: 'Dr. James Chen',
        content:
            'Researchers at MIT have announced a major breakthrough in carbon capture and storage (CCS) technology, potentially revolutionizing efforts to reduce greenhouse gas emissions...',
        description:
            'New carbon capture technology could significantly boost efforts to combat climate change.',
        sourceName: 'Tech Innovations Weekly',
        url: 'https://www.techinnovationsweekly.com/carbon-capture-breakthrough',
        urlToImage:
            'https://www.techinnovationsweekly.com/images/carbon-capture-plant.jpg',
    },
    {
        title: 'Global Youth Climate Strike Draws Millions of Participants Worldwide',
        publishedAt: '2024-09-15T13:00:00Z',
        author: 'Alex Thompson',
        content:
            'In an unprecedented display of youth activism, millions of young people across the globe participated in a coordinated climate strike, demanding immediate and drastic action on climate change...',
        description:
            'Youth-led climate strike becomes largest environmental protest in history.',
        sourceName: 'Global Citizen News',
        url: 'https://www.globalcitizennews.com/youth-climate-strike-2024',
        urlToImage:
            'https://www.globalcitizennews.com/images/climate-strike-2024.jpg',
    },
    {
        title: 'Coral Reef Restoration Project Shows Promise in Great Barrier Reef',
        publishedAt: '2024-05-20T10:30:00Z',
        author: 'Dr. Olivia Lee',
        content:
            "A large-scale coral reef restoration project in Australia's Great Barrier Reef has shown promising results, with scientists reporting a 40% increase in coral cover in treated areas...",
        description:
            'Innovative restoration techniques offer hope for the future of coral reefs threatened by climate change.',
        sourceName: 'Marine Conservation Quarterly',
        url: 'https://www.marineconservationquarterly.org/great-barrier-reef-restoration',
        urlToImage:
            'https://www.marineconservationquarterly.org/images/coral-restoration.jpg',
    },
    {
        title: 'Major Car Manufacturers Announce End of Combustion Engine Production by 2030',
        publishedAt: '2024-04-02T15:45:00Z',
        author: 'Michael Brown',
        content:
            "In a joint statement, several of the world's largest automobile manufacturers have announced plans to phase out production of internal combustion engine vehicles by 2030...",
        description:
            'Auto industry commits to electric future, signaling a major shift in transportation and emissions reduction.',
        sourceName: 'Auto Industry News',
        url: 'https://www.autoindustrynews.com/combustion-engine-phaseout',
        urlToImage:
            'https://www.autoindustrynews.com/images/electric-car-factory.jpg',
    },
    {
        title: 'New Study Reveals Accelerated Melting of Greenland Ice Sheet',
        publishedAt: '2024-08-05T12:10:00Z',
        author: 'Dr. Anna Petersen',
        content:
            'A new study published in the journal Nature Climate Change has revealed that the Greenland Ice Sheet is melting at a rate 50% faster than previously estimated...',
        description:
            "Rapid melting of Greenland's ice sheet raises alarm about sea level rise and global climate impacts.",
        sourceName: 'Earth Sciences Review',
        url: 'https://www.earthsciencesreview.com/greenland-ice-melting',
        urlToImage:
            'https://www.earthsciencesreview.com/images/greenland-ice-melt.jpg',
    },
    {
        title: "United Nations Declares 'Climate Emergency' as Global Emissions Continue to Rise",
        publishedAt: '2024-11-01T17:30:00Z',
        author: 'Amanda Torres',
        content:
            "The United Nations General Assembly has officially declared a global 'climate emergency' in response to continued rises in greenhouse gas emissions and failure to meet Paris Agreement targets...",
        description:
            'UN takes unprecedented step in declaring climate emergency, calling for immediate global action.',
        sourceName: 'World Affairs Daily',
        url: 'https://www.worldaffairsdaily.com/un-climate-emergency',
        urlToImage:
            'https://www.worldaffairsdaily.com/images/un-climate-summit-2024.jpg',
    },
];
