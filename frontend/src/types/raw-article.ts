export interface RawArticle {
    headline: string;
    publication: string;
    author: string;
    publishDate: string;
    content: string;
}

export const mockArticles = [
    {
        headline: 'Plankton could be the key to saving the climate',
        author: 'Spongebob Squarepants',
        publication: 'Bikini Bottom Herald',
        publishDate: '01/08/2024',
        content:
            'Plankton have been discovered to reduce carbon emissions in the atmosphere says leading Bikini Bottom scientist Sandy Cheeks',
    },
    {
        headline: 'Global temperatures reach record highs',
        author: 'Jane Doe',
        publication: 'Global News',
        publishDate: '01/02/2024',
        content:
            'January 2024 has been recorded as the hottest month in history, raising concerns about the escalating climate crisis.',
    },
    {
        headline: 'Melting glaciers threaten coastal cities',
        author: 'John Smith',
        publication: 'Earth Today',
        publishDate: '01/10/2024',
        content:
            'Glaciers are melting at an unprecedented rate, putting coastal cities at risk of severe flooding in the near future.',
    },
    {
        headline: 'Renewable energy adoption increases in Europe',
        author: 'Emily Johnson',
        publication: 'Eco Times',
        publishDate: '01/15/2024',
        content:
            'European countries are leading the way in renewable energy adoption, reducing their dependence on fossil fuels.',
    },
    {
        headline: 'Amazon rainforest sees alarming deforestation',
        author: 'Carlos Martinez',
        publication: 'Nature News',
        publishDate: '01/22/2024',
        content:
            'The Amazon rainforest continues to face significant deforestation, threatening biodiversity and contributing to climate change.',
    },
    {
        headline: 'Ocean acidification impacts marine life',
        author: 'Sarah Lee',
        publication: 'Marine Watch',
        publishDate: '02/01/2024',
        content:
            'Rising levels of ocean acidification are harming marine ecosystems, with species struggling to adapt to changing conditions.',
    },
    {
        headline: 'Polar bears struggle with shrinking ice habitats',
        author: 'David Brown',
        publication: 'Wildlife Weekly',
        publishDate: '02/07/2024',
        content:
            'Polar bears are facing a crisis as their ice habitats shrink due to rising global temperatures, leading to food scarcity.',
    },
    {
        headline: 'Droughts in Africa cause food shortages',
        author: 'Maya Patel',
        publication: 'Global Observer',
        publishDate: '02/14/2024',
        content:
            'Severe droughts in Africa are causing widespread food shortages, impacting millions of people and leading to humanitarian crises.',
    },
    {
        headline: 'Heatwaves sweep across Asia',
        author: 'Akira Tanaka',
        publication: 'Asia Today',
        publishDate: '02/20/2024',
        content:
            'Unprecedented heatwaves are affecting large parts of Asia, leading to health concerns and disruptions in daily life.',
    },
    {
        headline: 'Coral reefs face mass bleaching events',
        author: 'Laura White',
        publication: 'Oceanic News',
        publishDate: '02/28/2024',
        content:
            'Coral reefs are experiencing mass bleaching events, threatening the survival of these vital marine ecosystems.',
    },
    {
        headline: 'Climate change linked to extreme weather patterns',
        author: 'Michael Green',
        publication: 'Weather Watch',
        publishDate: '03/05/2024',
        content:
            'Scientists are linking climate change to an increase in extreme weather patterns, including hurricanes, floods, and wildfires.',
    },
    {
        headline: 'Carbon emissions continue to rise despite pledges',
        author: 'Rachel Adams',
        publication: 'Environment Today',
        publishDate: '03/12/2024',
        content:
            'Despite global pledges to reduce carbon emissions, levels continue to rise, raising concerns about meeting climate goals.',
    },
    {
        headline: 'Sea levels expected to rise faster than predicted',
        author: 'James Wilson',
        publication: 'Earth Sciences Journal',
        publishDate: '03/18/2024',
        content:
            'New research suggests that sea levels could rise faster than previously predicted, threatening low-lying regions worldwide.',
    },
    {
        headline: 'Renewable energy jobs on the rise',
        author: 'Linda Collins',
        publication: 'Green Economy',
        publishDate: '03/25/2024',
        content:
            'The renewable energy sector is creating millions of jobs worldwide, offering a path to sustainable economic growth.',
    },
    {
        headline: 'Arctic ice melting at alarming rate',
        author: 'Mark Thompson',
        publication: 'Polar News',
        publishDate: '04/01/2024',
        content:
            'The Arctic ice is melting at an alarming rate, contributing to rising sea levels and disrupting global weather patterns.',
    },
    {
        headline: 'Wildfires rage across California',
        author: 'Jennifer Lee',
        publication: 'Western News',
        publishDate: '04/08/2024',
        content:
            'California is facing devastating wildfires, fueled by dry conditions and rising temperatures, causing widespread damage.',
    },
    {
        headline: 'Climate change threatens global food security',
        author: 'Sophia Nguyen',
        publication: 'Agri News',
        publishDate: '04/15/2024',
        content:
            'Climate change is posing a significant threat to global food security, with crop yields declining in many regions.',
    },
    {
        headline:
            'Cities turn to green infrastructure to combat climate change',
        author: 'Tom Harris',
        publication: 'Urban Life',
        publishDate: '04/22/2024',
        content:
            'Cities worldwide are adopting green infrastructure solutions, such as green roofs and urban forests, to combat climate change.',
    },
    {
        headline: 'Climate change affecting global health',
        author: 'Nina Gupta',
        publication: 'Health Matters',
        publishDate: '04/29/2024',
        content:
            'Climate change is impacting global health, with rising temperatures leading to an increase in heat-related illnesses and diseases.',
    },
    {
        headline: 'Renewable energy surpasses coal in the US',
        author: 'David Carter',
        publication: 'Energy Times',
        publishDate: '05/05/2024',
        content:
            'For the first time, renewable energy has surpassed coal as the leading source of electricity in the United States.',
    },
    {
        headline: 'Coral reefs show signs of recovery',
        author: 'Alex Wong',
        publication: 'Marine Ecology',
        publishDate: '05/12/2024',
        content:
            'Some coral reefs are showing signs of recovery, offering hope for the future of these vital ecosystems.',
    },
    {
        headline: 'Climate change displaces millions',
        author: 'Maria Sanchez',
        publication: 'Human Rights Journal',
        publishDate: '05/19/2024',
        content:
            'Climate change is displacing millions of people worldwide, creating a growing population of climate refugees.',
    },
    {
        headline: 'Scientists develop new carbon capture technology',
        author: 'Ethan Brown',
        publication: 'Tech Innovations',
        publishDate: '05/26/2024',
        content:
            'A new carbon capture technology could help reduce greenhouse gas emissions and mitigate the effects of climate change.',
    },
    {
        headline: 'Extreme weather events increase in frequency',
        author: 'Laura Adams',
        publication: 'Climate Watch',
        publishDate: '06/01/2024',
        content:
            'Extreme weather events, including hurricanes, floods, and droughts, are increasing in frequency due to climate change.',
    },
    {
        headline: 'Climate change impacts biodiversity',
        author: 'Oliver White',
        publication: 'Nature Review',
        publishDate: '06/08/2024',
        content:
            'Climate change is causing a loss of biodiversity, with many species struggling to adapt to changing environmental conditions.',
    },
    {
        headline: 'Countries pledge to phase out fossil fuels',
        author: 'Lily Chen',
        publication: 'Global Green',
        publishDate: '06/15/2024',
        content:
            'Several countries have pledged to phase out fossil fuels by 2050, committing to a future powered by renewable energy.',
    },
    {
        headline: 'Arctic wildlife at risk due to climate change',
        author: 'Henry Lee',
        publication: 'Wildlife World',
        publishDate: '06/22/2024',
        content:
            'Arctic wildlife, including polar bears and seals, is at risk due to the rapidly changing climate and melting ice habitats.',
    },
    {
        headline: 'Climate change drives migration patterns',
        author: 'Sara Wilson',
        publication: 'Migration News',
        publishDate: '06/29/2024',
        content:
            'Climate change is driving changes in migration patterns, with people moving to escape extreme weather and environmental degradation.',
    },
    {
        headline: 'Heatwaves linked to climate change',
        author: 'Daniel Kim',
        publication: 'Weather Report',
        publishDate: '07/03/2024',
        content:
            'Scientists have linked the increasing frequency and intensity of heatwaves to the ongoing climate crisis.',
    },
    {
        headline: 'New species discovered in the deep sea',
        author: 'Rachel Green',
        publication: 'Ocean Discovery',
        publishDate: '07/10/2024',
        content:
            'A new species of deep-sea fish has been discovered, offering insights into the resilience of marine life in a changing climate.',
    },
    {
        headline: 'Climate change leads to longer wildfire seasons',
        author: 'Tom Brown',
        publication: 'Fire Watch',
        publishDate: '07/17/2024',
        content:
            'Wildfire seasons are becoming longer and more intense due to climate change, putting lives and property at risk.',
    },
    {
        headline: 'Renewable energy growth accelerates globally',
        author: 'Anna White',
        publication: 'Energy Insight',
        publishDate: '07/24/2024',
        content:
            'The growth of renewable energy is accelerating globally, with more countries investing in solar, wind, and hydropower.',
    },
    {
        headline: 'Climate change exacerbates water scarcity',
        author: 'Mia Davis',
        publication: 'Water World',
        publishDate: '07/31/2024',
        content:
            'Water scarcity is becoming more severe in many parts of the world due to climate change, affecting millions of people.',
    },
    {
        headline: 'Climate change threatens global wine industry',
        author: 'Ethan Parker',
        publication: 'Food & Wine',
        publishDate: '08/07/2024',
        content:
            'The global wine industry is facing challenges due to climate change, with shifting weather patterns affecting grape production.',
    },
    {
        headline: 'Cities invest in climate resilience',
        author: 'Sophia Kim',
        publication: 'Urban Development',
        publishDate: '08/14/2024',
        content:
            'Cities around the world are investing in climate resilience projects, including sea walls and flood prevention measures.',
    },
    {
        headline: 'Climate change linked to mental health issues',
        author: 'Nina Patel',
        publication: 'Health Today',
        publishDate: '08/21/2024',
        content:
            'Climate change is contributing to a rise in mental health issues, with people experiencing anxiety and depression related to environmental concerns.',
    },
    {
        headline: 'Coral reefs in danger of extinction',
        author: 'James Lee',
        publication: 'Marine Science Journal',
        publishDate: '08/28/2024',
        content:
            'Coral reefs are in danger of extinction due to rising ocean temperatures and acidification, threatening marine biodiversity.',
    },
    {
        headline: 'Electric vehicles on the rise in response to climate change',
        author: 'Olivia Taylor',
        publication: 'Auto World',
        publishDate: '09/02/2024',
        content:
            'The adoption of electric vehicles is on the rise as more people look for sustainable transportation options to combat climate change.',
    },
    {
        headline: 'Global warming threatens iconic landmarks',
        author: 'Michael Anderson',
        publication: 'Heritage News',
        publishDate: '09/09/2024',
        content:
            'Iconic landmarks around the world are at risk due to global warming, with rising sea levels and extreme weather causing damage.',
    },
    {
        headline: 'Climate change impacts agriculture',
        author: 'Grace Wilson',
        publication: 'Farmers Weekly',
        publishDate: '09/16/2024',
        content:
            'Climate change is impacting agriculture, with unpredictable weather patterns leading to lower crop yields and food shortages.',
    },
    {
        headline: 'Arctic ice hits new low',
        author: 'Noah Roberts',
        publication: 'Polar Explorer',
        publishDate: '09/23/2024',
        content:
            'Arctic ice levels have hit a new low, raising concerns about the future of the polar region and its impact on global climate.',
    },
    {
        headline: 'Wildlife migration patterns shift due to climate change',
        author: 'Emily Chen',
        publication: 'Animal World',
        publishDate: '09/30/2024',
        content:
            'Wildlife migration patterns are shifting due to climate change, with species moving to new areas in search of suitable habitats.',
    },
    {
        headline: 'Renewable energy investment hits record high',
        author: 'David Martin',
        publication: 'Finance Today',
        publishDate: '10/05/2024',
        content:
            'Investment in renewable energy has hit a record high, with more companies and governments committing to green energy projects.',
    },
    {
        headline: 'Climate change drives global temperature rise',
        author: 'Isabella Torres',
        publication: 'Global Observer',
        publishDate: '10/12/2024',
        content:
            'Global temperatures continue to rise due to climate change, with 2024 on track to be one of the hottest years on record.',
    },
    {
        headline: 'Coral reef restoration efforts show promise',
        author: 'Matthew Wright',
        publication: 'Eco News',
        publishDate: '10/19/2024',
        content:
            'Coral reef restoration efforts are showing promise, with some reefs beginning to recover from bleaching and other climate-related damage.',
    },
    {
        headline: 'Climate change affects air quality',
        author: 'Chloe Evans',
        publication: 'Health Report',
        publishDate: '10/26/2024',
        content:
            'Climate change is affecting air quality, with rising temperatures leading to an increase in pollutants and respiratory issues.',
    },
    {
        headline: 'Climate change impacts Arctic wildlife',
        author: 'Lucas Davis',
        publication: 'Polar News',
        publishDate: '11/01/2024',
        content:
            'Arctic wildlife is facing challenges due to climate change, with many species struggling to survive in rapidly changing environments.',
    },
    {
        headline: 'Climate change drives innovation in agriculture',
        author: 'Zoe Parker',
        publication: 'Agri Tech',
        publishDate: '11/08/2024',
        content:
            'Climate change is driving innovation in agriculture, with new technologies being developed to help farmers adapt to changing conditions.',
    },
    {
        headline: 'Climate change linked to global economic instability',
        author: 'Mason Green',
        publication: 'Economic Times',
        publishDate: '11/15/2024',
        content:
            'Climate change is contributing to global economic instability, with extreme weather events causing disruptions in supply chains and financial markets.',
    },
    {
        headline: 'Arctic permafrost melting accelerates',
        author: 'Ella Thompson',
        publication: 'Polar Explorer',
        publishDate: '11/22/2024',
        content:
            'The melting of Arctic permafrost is accelerating, releasing greenhouse gases and contributing to global warming.',
    },
    {
        headline: 'Renewable energy sector sees rapid growth',
        author: 'Sebastian White',
        publication: 'Energy Watch',
        publishDate: '11/29/2024',
        content:
            'The renewable energy sector is experiencing rapid growth, with more countries investing in wind, solar, and other clean energy sources.',
    },
    {
        headline: 'Global climate summit focuses on action',
        author: 'Emma Martinez',
        publication: 'Global News',
        publishDate: '12/03/2024',
        content:
            'The latest global climate summit has focused on taking concrete action to address the climate crisis, with leaders pledging to reduce emissions and protect vulnerable communities.',
    },
    {
        headline: 'Extreme weather events increase in intensity',
        author: 'Jack Reed',
        publication: 'Weather World',
        publishDate: '12/10/2024',
        content:
            'Extreme weather events are increasing in intensity due to climate change, with more frequent and severe hurricanes, floods, and droughts.',
    },
    {
        headline: 'Climate change impacts global water supplies',
        author: 'Charlotte Brooks',
        publication: 'Water Watch',
        publishDate: '12/17/2024',
        content:
            'Climate change is affecting global water supplies, with rising temperatures leading to droughts and water shortages in many regions.',
    },
    {
        headline: 'Climate change linked to increase in wildfires',
        author: 'Daniel Lewis',
        publication: 'Fire Report',
        publishDate: '12/24/2024',
        content:
            'The frequency and intensity of wildfires are increasing due to climate change, with devastating impacts on communities and ecosystems.',
    },
    {
        headline: 'Global temperatures hit new record in December',
        author: 'Sophia Morgan',
        publication: 'Climate Today',
        publishDate: '12/31/2024',
        content:
            'December 2024 has been recorded as the warmest December on record, highlighting the urgent need for action on climate change.',
    },
];
