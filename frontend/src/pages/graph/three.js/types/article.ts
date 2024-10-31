/**
 * Represents an article with climate-related claims and metadata
 */
export type Article = {
    /** Unique identifier for the article */
    articleId: string;
    
    /** URI identifier for the article */
    uri: string;
    
    /** Article title (optional) */
    title?: string;
    
    /** Main content of the article (optional) */
    body?: string;
    
    /** Source publication or website (optional) */
    source?: string;
    
    /** Article authors (optional) */
    authors?: string;
    
    /** Publication date and time */
    dateTime: string;
    
    /** URL where the article can be found */
    url: string;
    
    /** URL of the article's featured image (optional) */
    image?: string;
    
    /** Flag indicating if this is a duplicate article (optional) */
    isDuplicate?: boolean;
    
    /** 
     * Major climate change denial claims present in the article
     * Each property represents a different type of broad claim
     * Values are likely indicators of claim presence (e.g., "true", "false", or confidence scores)
     */
    broadClaims?: {
      gw_not_happening?: string;           // Denial of global warming
      not_caused_by_human?: string;        // Denial of anthropogenic causes
      impacts_not_bad?: string;            // Minimization of impacts
      solutions_wont_work?: string;        // Dismissal of solutions
      science_movement_unrel?: string;     // Attacks on science/movement credibility
      individual_action?: string;          // Dismissal of individual action
    };
    
    /**
     * Specific climate change denial claims present in the article
     * Each property represents a different type of specific claim
     * Values are likely indicators of claim presence
     */
    subClaims?: {
      sc_cold_event_denial?: string;       // Using cold weather to deny warming
      sc_deny_extreme_weather?: string;    // Denying increase in extreme weather
      sc_natural_variations?: string;      // Attributing to natural causes
      sc_past_climate_reference?: string;  // Using past climate to deny current change
      sc_species_adapt?: string;           // Claiming species will adapt
      sc_downplay_warming?: string;        // Minimizing warming impacts
      sc_policies_negative?: string;       // Highlighting policy downsides
      sc_policies_ineffective?: string;    // Claiming policies don't work
      sc_policies_difficult?: string;      // Emphasizing implementation challenges
      sc_low_support_policies?: string;    // Claiming lack of public support
      sc_clean_energy_unreliable?: string; // Attacking renewable energy
      sc_climate_science_unrel?: string;   // Questioning climate science
      sc_no_consensus?: string;            // Denying scientific consensus
      sc_movement_unreliable?: string;     // Discrediting climate movement
      sc_hoax_conspiracy?: string;         // Promoting conspiracy theories
    };
    
    /** Reference to think tank involvement (optional) */
    think_tank_ref?: string;
  };
  
  /**
   * Maps broad claim identifiers to their plain English descriptions
   * Used for categorizing major climate change denial narratives
   */
  export const broadClaims = {
    gw_not_happening: 'global warming is not happening',
    not_caused_by_human: 'climate change is not caused by human activities',
    impacts_not_bad: 'climate change impacts are not that bad',
    solutions_wont_work: "climate solutions won't work",
    science_movement_unrel: 'climate science or movement is unreliable',
    individual_action: 'individual action is pointless',
  };
  
  /**
   * Maps specific claim identifiers to their plain English descriptions
   * Used for categorizing detailed climate change denial arguments
   */
  export const subClaims = {
    sc_cold_event_denial: 'cold weather event disproves global warming',
    sc_deny_extreme_weather: 'extreme weather events are not increasing',
    sc_natural_variations: 'climate change is due to natural variations',
    sc_past_climate_reference: 'past climate changes prove current changes are natural',
    sc_species_adapt: 'species can adapt to climate change',
    sc_downplay_warming: 'warming is not as bad as predicted',
    sc_policies_negative: 'climate policies have negative consequences',
    sc_policies_ineffective: 'climate policies are ineffective',
    sc_policies_difficult: 'climate policies are too difficult to implement',
    sc_low_support_policies: 'there is low public support for climate policies',
    sc_clean_energy_unreliable: 'clean energy sources are unreliable',
    sc_climate_science_unrel: 'climate science is unreliable',
    sc_no_consensus: 'there is no scientific consensus on climate change',
    sc_movement_unreliable: 'the climate movement is unreliable',
    sc_hoax_conspiracy: 'climate change is a hoax or conspiracy',
  };
  
  /**
   * List of news sources that are monitored for climate-related articles
   * Includes both mainstream and alternative media outlets
   */
  export const sources = [
    'theaustralian.com.au',
    'theguardian.com',
    'abc.net.au',
    'news.com.au',
    'heraldsun.com.au',
    'skynews.com.au',
    'afr.com',
    'smh.com.au',
    'dailytelegraph.com.au',
    'foxnews.com',
    'nytimes.com',
    'dailywire.com',
    'couriermail.com.au',
    'thewest.com.au',
    '7news.com.au',
    '9news.com.au',
    'theconversation.com',
    'nypost.com',
    'wsj.com',
    'wattsupwiththat.com',
    'breitbart.com',
    'newsmax.com',
    'naturalnews.com',
    'washingtontimes.com',
  ];


// Mock Articles accessible via the Demo button on SidePanel
export const dummyArticles: Article[] = [
    {
        articleId: 'a1b2c3d4',
        uri: 'uri-a1b2c3d4',
        title: 'New study shows coffee may improve memory',
        body: 'A groundbreaking study published in the Coffee Science Journal has revealed a potential link between regular coffee consumption and improved memory function in adults. The research, conducted over a two-year period, involved 1,000 participants aged 25-65. Results showed a 15% improvement in memory retention tests for those who consumed 2-3 cups of coffee daily compared to non-coffee drinkers.',
        source: 'Coffee Science Journal',
        authors: 'Dr. Bean, Dr. Roast',
        dateTime: '2024-10-01T09:00:00Z',
        url: 'https://coffeesciencejournal.com/coffee-memory-study',
        image: 'https://example.com/coffee-study-image.jpg',
        isDuplicate: false,
        broadClaims: {
            science_movement_unrel:
                'Coffee studies are often funded by the coffee industry, making their results questionable.',
            individual_action:
                'Focusing on individual dietary choices distracts from systemic environmental issues.',
        },
        subClaims: {
            sc_climate_science_unrel:
                'This study diverts attention from more pressing health concerns related to climate change.',
            sc_no_consensus:
                'The scientific community is divided on the health benefits of coffee.',
        },
    },
    {
        articleId: 'e5f6g7h8',
        uri: 'uri-e5f6g7h8',
        title: 'Electric vehicles surpass traditional car sales',
        body: 'In a historic milestone, electric vehicle (EV) sales have outpaced those of traditional gasoline-powered cars for the first time this quarter. Industry data shows EVs accounting for 52% of all new car sales worldwide, attributed to advancements in battery technology, expanding charging infrastructure, and growing environmental awareness among consumers.',
        source: 'Auto Industry News',
        authors: 'Jane Driver, Michael Volt',
        dateTime: '2024-10-02T10:30:00Z',
        url: 'https://autoindustrynews.com/ev-sales-milestone',
        image: 'https://example.com/ev-sales-chart.jpg',
        isDuplicate: false,
        broadClaims: {
            solutions_wont_work:
                "Electric cars won't significantly reduce emissions due to the carbon footprint of battery production.",
            not_caused_by_human:
                "The shift to electric vehicles is unnecessary as human activity isn't the main driver of climate change.",
        },
        subClaims: {
            sc_policies_ineffective:
                'Government incentives for electric vehicles are an inefficient use of resources.',
            sc_clean_energy_unreliable:
                "The power grid can't handle widespread EV adoption, leading to potential blackouts.",
        },
    },
    {
        articleId: 'i9j0k1l2',
        uri: 'uri-i9j0k1l2',
        title: 'New deep-sea creature discovered',
        body: "A team of marine biologists from the Oceanographic Institute has discovered a new species of bioluminescent fish in the Mariana Trench. The fish, tentatively named 'Abyssal Lightbearer', was found at depths exceeding 10,000 meters. This discovery challenges previous assumptions about the limits of life in extreme environments and may provide new insights into deep-sea ecosystems.",
        source: 'Ocean Explorer Magazine',
        authors: 'Dr. Marina Deeps, Prof. Abyss Diver',
        dateTime: '2024-10-03T14:15:00Z',
        url: 'https://oceanexplorer.com/new-deep-sea-species',
        image: 'https://example.com/abyssal-lightbearer.jpg',
        isDuplicate: false,
        broadClaims: {
            impacts_not_bad:
                'Discovery of new species shows oceans are adapting well to changes.',
            gw_not_happening:
                'Deep sea ecosystems remain unaffected, challenging claims of ocean warming.',
        },
        subClaims: {
            sc_species_adapt:
                'Marine life is more resilient to climate change than previously thought.',
            sc_natural_variations:
                'Changes in ocean ecosystems are part of natural cycles, not human-induced climate change.',
        },
    },
    {
        articleId: 'm3n4o5p6',
        uri: 'uri-m3n4o5p6',
        title: 'Global temperatures hit new record high in July',
        body: 'Meteorological agencies worldwide have confirmed that July 2024 was the hottest month ever recorded since global temperature tracking began. The average global temperature was 1.5°C above the 20th-century average. This unprecedented heat has triggered severe wildfires in multiple countries, raising concerns about the accelerating pace of climate change and its immediate impacts on ecosystems and human societies.',
        source: 'Climate Watch',
        authors: 'Dr. Heat Wave, Climatologist Jane Stern',
        dateTime: '2024-10-04T08:45:00Z',
        url: 'https://climatewatch.org/record-breaking-july-2024',
        image: 'https://example.com/july-heatwave-map.jpg',
        isDuplicate: false,
        broadClaims: {
            gw_not_happening:
                "One hot month doesn't prove long-term warming trends.",
            individual_action: '',
        },
        subClaims: {
            sc_natural_variations:
                "July's heat is part of natural climate variability.",
            sc_past_climate_reference:
                'Similar heat waves occurred in the past, long before industrial emissions.',
        },
    },
    {
        articleId: 'q7r8s9t0',
        uri: 'uri-q7r8s9t0',
        title: 'AI outperforms human doctors in medical diagnosis',
        body: 'A groundbreaking artificial intelligence system, developed by TechHealth Inc., has demonstrated superior performance in diagnosing a wide range of diseases compared to human medical experts. In a comprehensive study involving over 100,000 patient cases, the AI system achieved a 95% accuracy rate, surpassing the 86% average accuracy of experienced physicians. While this breakthrough promises faster and more accurate diagnoses, it also raises ethical questions about the role of AI in healthcare.',
        source: 'Tech Health Journal',
        authors: 'Dr. Ada Turing, AI Specialist Mark Circuit',
        dateTime: '2024-10-05T16:20:00Z',
        url: 'https://techhealthjournal.com/ai-diagnosis-breakthrough',
        image: 'https://example.com/ai-diagnosis-comparison.jpg',
        isDuplicate: false,
        broadClaims: {
            science_movement_unrel:
                'AI in healthcare raises ethical concerns and may not be trustworthy.',
        },
        subClaims: {
            sc_movement_unreliable:
                'The push for AI in healthcare is driven more by profit than patient care.',
            sc_no_consensus:
                'The medical community is divided on the reliability of AI diagnostics.',
        },
    },
    {
        articleId: 'u1v2w3x4',
        uri: 'uri-u1v2w3x4',
        body: 'A controversial new study suggests that current sea level rise is within the range of natural variability observed over the past several thousand years.',
        source: 'Global Climate Review',
        authors: 'Dr. Wave Rider',
        dateTime: '2024-10-06T11:30:00Z',
        url: 'https://globalclimatereview.com/sea-level-natural-variation',
        image: 'https://example.com/sea-level-graph.jpg',
        isDuplicate: false,
        broadClaims: {
            gw_not_happening:
                'Sea level rise is not accelerating as climate models predict.',
            not_caused_by_human:
                'Current sea level changes are part of natural Earth cycles.',
        },
        subClaims: {
            sc_natural_variations:
                'Sea levels have always fluctuated naturally.',
            sc_past_climate_reference:
                'Similar sea level changes occurred in the past without human influence.',
        },
    },
    {
        articleId: 'y5z6a7b8',
        uri: 'uri-y5z6a7b8',
        body: 'A new report highlights potential drawbacks of large-scale renewable energy projects, including environmental impacts and resource depletion.',
        source: 'Energy Policy Institute',
        authors: 'Emma Watts, Dr. Solar Panel',
        dateTime: '2024-10-07T09:45:00Z',
        url: 'https://energypolicyinstitute.org/renewable-energy-costs',
        image: 'https://example.com/solar-farm-impact.jpg',
        isDuplicate: false,
        broadClaims: {
            solutions_wont_work:
                'Renewable energy may not be as green as commonly believed.',
            impacts_not_bad:
                'Current energy systems may be preferable to rushed renewable adoption.',
        },
        subClaims: {
            sc_policies_ineffective:
                'Government subsidies for renewables may not achieve desired outcomes.',
            sc_clean_energy_unreliable:
                'Intermittency issues with renewables pose significant challenges.',
        },
    },
    {
        articleId: 'c9d0e1f2',
        uri: 'uri-c9d0e1f2',
        body: 'A group of researchers claim that the latest IPCC report overstates the rate of global warming, citing potential data interpretation issues.',
        source: 'Science Today',
        authors: 'Dr. Skeptic, Prof. Data Analyst',
        dateTime: '2024-10-08T14:20:00Z',
        url: 'https://sciencetoday.com/climate-report-controversy',
        image: 'https://example.com/temperature-data-analysis.jpg',
        isDuplicate: false,
        broadClaims: {
            gw_not_happening:
                'Warming trends are overstated in official reports.',
            science_movement_unrel:
                'Climate science may be influenced by political agendas.',
        },
        subClaims: {
            sc_climate_science_unrel:
                'Climate models have significant uncertainties.',
            sc_no_consensus:
                'There is ongoing debate about the extent of human-caused warming.',
        },
    },
    {
        articleId: 'g3h4i5j6',
        uri: 'uri-g3h4i5j6',
        body: 'Recent wildlife surveys indicate that some polar bear populations are adapting to reduced sea ice coverage better than previously thought.',
        source: 'Arctic Wildlife Journal',
        authors: 'Dr. Frost, Ice Bear Specialist',
        dateTime: '2024-10-09T10:10:00Z',
        url: 'https://arcticwildlifejournal.com/polar-bear-resilience',
        image: 'https://example.com/polar-bear-summer.jpg',
        isDuplicate: false,
        broadClaims: {
            impacts_not_bad:
                'Some species are more adaptable to climate change than predicted.',
            gw_not_happening:
                'Arctic changes may not be as severe as climate models suggest.',
        },
        subClaims: {
            sc_species_adapt:
                'Wildlife can adapt to changing environmental conditions.',
            sc_deny_extreme_weather:
                'Predictions of Arctic ecosystem collapse may be overstated.',
        },
    },
    {
        articleId: 'k7l8m9n0',
        uri: 'uri-k7l8m9n0',
        body: 'An economic analysis suggests that carbon pricing policies have had limited success in significantly reducing greenhouse gas emissions in implemented regions.',
        source: 'Economic Policy Review',
        authors: 'Dr. Market Forces, Prof. Tax Effect',
        dateTime: '2024-10-10T13:55:00Z',
        url: 'https://economicpolicyreview.com/carbon-tax-effectiveness',
        image: 'https://example.com/carbon-price-graph.jpg',
        isDuplicate: false,
        broadClaims: {
            solutions_wont_work:
                'Carbon pricing may not be effective in reducing emissions.',
            individual_action:
                'Focus on individual actions may distract from more impactful solutions.',
        },
        subClaims: {
            sc_policies_ineffective:
                'Carbon taxes have not led to significant emission reductions.',
            sc_policies_negative:
                'Carbon pricing may harm economic competitiveness.',
        },
    },
    {
        articleId: 'o1p2q3r4',
        uri: 'uri-o1p2q3r4',
        body: 'A new analysis of paleoclimate data suggests that Earth has experienced similar warming periods in the past, challenging the uniqueness of current climate trends.',
        source: 'Geology Today',
        authors: 'Dr. Rock Reader, Ancient Climate Specialist',
        dateTime: '2024-10-11T08:30:00Z',
        url: 'https://geologytoday.com/earth-climate-cycles',
        image: 'https://example.com/paleoclimate-reconstruction.jpg',
        isDuplicate: false,
        broadClaims: {
            not_caused_by_human:
                'Current warming may be part of natural climate cycles.',
            gw_not_happening:
                "Present warming is not unprecedented in Earth's history.",
        },
        subClaims: {
            sc_natural_variations:
                'Climate has always varied naturally over time.',
            sc_past_climate_reference:
                'Similar warm periods occurred before human industrial activity.',
        },
    },
    {
        articleId: 's5t6u7v8',
        uri: 'uri-s5t6u7v8',
        body: 'Anonymous sources have released emails allegedly showing climate researchers discussing ways to adjust data to better fit warming narratives, sparking debate about scientific integrity.',
        source: 'Investigative Science Report',
        authors: 'Anon Leaker, Data Integrity Advocate',
        dateTime: '2024-10-12T16:40:00Z',
        url: 'https://investigativesciencereport.com/climate-data-controversy',
        image: 'https://example.com/data-manipulation-evidence.jpg',
        isDuplicate: false,
        broadClaims: {
            science_movement_unrel:
                'Climate science may be compromised by data manipulation.',
            gw_not_happening:
                'Reported warming trends may be exaggerated due to data issues.',
        },
        subClaims: {
            sc_climate_science_unrel:
                'Some climate data may have been manipulated.',
            sc_hoax_conspiracy:
                'There might be coordinated efforts to overstate climate change.',
        },
    },
    {
        articleId: 'w9x0y1z2',
        uri: 'uri-w9x0y1z2',
        body: 'A comprehensive economic study warns that overly aggressive climate policies could lead to significant job losses and economic instability in certain sectors.',
        source: 'Global Economics Institute',
        authors: 'Dr. Economy, Prof. Job Market',
        dateTime: '2024-10-13T11:25:00Z',
        url: 'https://globaleconomicsinstitute.com/decarbonization-economic-impact',
        image: 'https://example.com/economic-impact-chart.jpg',
        isDuplicate: false,
        broadClaims: {
            solutions_wont_work:
                'Rapid decarbonization may cause more harm than good.',
            impacts_not_bad:
                'Economic impacts of climate action may outweigh benefits.',
        },
        subClaims: {
            sc_policies_negative:
                'Climate policies could lead to significant job losses.',
            sc_policies_difficult:
                'Rapid transition to low-carbon economy poses major challenges.',
        },
    },
    {
        articleId: 'a3b4c5d6',
        uri: 'uri-a3b4c5d6',
        body: 'Researchers argue that much of the observed warming in weather station data can be attributed to urban heat island effects rather than global climate change.',
        source: 'Urban Planning Review',
        authors: 'Dr. City Planner, Heat Island Specialist',
        dateTime: '2024-10-14T09:50:00Z',
        url: 'https://urbanplanningreview.com/heat-islands-global-warming',
        image: 'https://example.com/urban-heat-map.jpg',
        isDuplicate: false,
        broadClaims: {
            not_caused_by_human:
                'Observed warming may be due to urbanization, not global factors.',
            gw_not_happening:
                'Global temperature data may be skewed by local urban effects.',
        },
        subClaims: {
            sc_deny_extreme_weather:
                'Extreme heat events may be localized urban phenomena.',
            sc_downplay_warming:
                'Global warming may be overstated due to urban heat island effects.',
        },
    },
    {
        articleId: 'e7f8g9h0',
        uri: 'uri-e7f8g9h0',
        body: "A recent national survey indicates that public concern about climate change has decreased, with economic issues and cost of living taking priority in people's minds.",
        source: 'Public Opinion Quarterly',
        authors: 'Dr. Poll Master, Social Trends Analyst',
        dateTime: '2024-10-15T14:05:00Z',
        url: 'https://publicopinionquarterly.com/climate-concern-poll',
        image: 'https://example.com/public-opinion-graph.jpg',
        isDuplicate: false,
        broadClaims: {
            impacts_not_bad:
                'Public perceives other issues as more pressing than climate change.',
            individual_action:
                'People are less willing to take individual climate action amid economic stress.',
        },
        subClaims: {
            sc_low_support_policies:
                'There is declining public support for climate policies.',
            sc_policies_difficult:
                'Economic concerns make implementing climate policies more challenging.',
        },
    },
    {
        articleId: 'test1',
        uri: 'uri-test1',
        body: "This article explores the relationship between solar activity cycles and Earth's climate patterns, suggesting that natural solar variations play a significant role in climate change.",
        source: 'Solar Science Monthly',
        authors: 'Dr. Sun Spot',
        dateTime: '2024-10-16T09:00:00Z',
        url: 'https://solarsciencemonthly.com/solar-cycles-climate',
        image: 'https://example.com/solar-cycle-graph.jpg',
        isDuplicate: false,
        broadClaims: {
            gw_not_happening:
                'Climate change is primarily driven by natural solar cycles.',
            not_caused_by_human:
                'Human activities have minimal impact compared to solar influences.',
        },
        subClaims: {
            sc_natural_variations:
                'Solar activity is a major driver of climate variability.',
            sc_past_climate_reference:
                'Historical climate changes correlate with solar activity.',
            sc_deny_extreme_weather:
                'Extreme weather events are not increasing due to human activities.',
        },
    },
    {
        articleId: 'test2',
        uri: 'uri-test2',
        body: "A study reveals how cosmic rays influence cloud formation, suggesting they play a crucial role in Earth's climate system that has been underestimated in current climate models.",
        source: 'Atmospheric Physics Journal',
        authors: 'Prof. Cloudy Sky',
        dateTime: '2024-10-17T10:30:00Z',
        url: 'https://atmosphericphysicsjournal.com/cosmic-rays-climate',
        image: 'https://example.com/cosmic-ray-influence.jpg',
        isDuplicate: false,
        broadClaims: {
            gw_not_happening:
                'Climate change is primarily driven by natural solar cycles.',
            not_caused_by_human:
                'Human activities have minimal impact compared to solar influences.',
        },
        subClaims: {
            sc_natural_variations:
                'Solar activity is a major driver of climate variability.',
            sc_past_climate_reference:
                'Historical climate changes correlate with solar activity.',
            sc_deny_extreme_weather:
                'Extreme weather events are not increasing due to human activities.',
        },
    },
    {
        articleId: 'test3',
        uri: 'uri-test3',
        body: 'A comprehensive analysis of tree ring data from ancient forests indicates that current temperature trends fall within the range of natural climate variability observed over the past two millennia.',
        source: 'Dendrochronology Digest',
        authors: 'Dr. Woody Rings',
        dateTime: '2024-10-18T14:15:00Z',
        url: 'https://dendrochronologydigest.com/tree-rings-climate-variability',
        image: 'https://example.com/tree-ring-analysis.jpg',
        isDuplicate: false,
        broadClaims: {
            gw_not_happening:
                'Climate change is primarily driven by natural solar cycles.',
            not_caused_by_human:
                'Human activities have minimal impact compared to solar influences.',
        },
        subClaims: {
            sc_natural_variations:
                'Solar activity is a major driver of climate variability.',
            sc_past_climate_reference:
                'Historical climate changes correlate with solar activity.',
            sc_deny_extreme_weather:
                'Extreme weather events are not increasing due to human activities.',
        },
    },
    {
        articleId: 'test4',
        uri: 'uri-test4',
        body: 'A new geological study suggests that the correlation between atmospheric CO2 levels and global temperatures is weaker than previously thought, challenging the idea of CO2 as the primary driver of climate change.',
        source: 'Geological Review',
        authors: 'Dr. Rock Layer',
        dateTime: '2024-10-19T11:45:00Z',
        url: 'https://geologicalreview.com/co2-temperature-correlation',
        image: 'https://example.com/co2-temperature-graph.jpg',
        isDuplicate: false,
        broadClaims: {
            gw_not_happening:
                'Climate change is primarily driven by natural solar cycles.',
            not_caused_by_human:
                'Human activities have minimal impact compared to solar influences.',
        },
        subClaims: {
            sc_natural_variations:
                'Solar activity is a major driver of climate variability.',
            sc_past_climate_reference:
                'Historical climate changes correlate with solar activity.',
            sc_deny_extreme_weather:
                'Extreme weather events are not increasing due to human activities.',
        },
    },
    {
        articleId: 'test5',
        uri: 'uri-test5',
        body: 'Analysis of long-term satellite data reveals that the rate of global sea level rise has not accelerated as predicted by climate models, suggesting that natural factors may play a larger role than human activities.',
        source: 'Oceanography Today',
        authors: 'Dr. Wave Watcher',
        dateTime: '2024-10-20T13:20:00Z',
        url: 'https://oceanographytoday.com/steady-sea-level-rise',
        image: 'https://example.com/sea-level-trend.jpg',
        isDuplicate: false,
        broadClaims: {
            gw_not_happening:
                'Climate change is primarily driven by natural solar cycles.',
            not_caused_by_human:
                'Human activities have minimal impact compared to solar influences.',
        },
        subClaims: {
            sc_natural_variations:
                'Solar activity is a major driver of climate variability.',
            sc_past_climate_reference:
                'Historical climate changes correlate with solar activity.',
            sc_deny_extreme_weather:
                'Extreme weather events are not increasing due to human activities.',
        },
    },
];
