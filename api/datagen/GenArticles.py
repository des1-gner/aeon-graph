import json
import random
from datetime import datetime, timedelta

# Expanded list of news sources (now lowercase)
sources = [
    "theaustralian.com.au", "theguardian.com", "abc.net.au", "news.com.au",
    "heraldsun.com.au", "skynews.com.au", "afr.com", "smh.com.au",
    "dailytelegraph.com.au", "foxnews.com", "nytimes.com", "dailywire.com",
    "couriermail.com.au", "thewest.com.au", "7news.com.au", "9news.com.au",
    "theconversation.com", "nypost.com", "wsj.com", "wattsupwiththat.com",
    "breitbart.com", "newsmax.com", "naturalnews.com", "washingtontimes.com",
    "climatecentral.org", "skepticalscience.com", "realclimate.org", "climatedepot.com",
    "nationalgeographic.com", "scientificamerican.com", "sciencedaily.com", "phys.org"
]

# Expanded vocabulary for sentence generation (now lowercase)
subjects = [
    "new study", "recent report", "climate scientist", "environmental group", "think tank",
    "controversial paper", "leaked document", "anonymous source", "whistleblower", "satellite data",
    "computer model", "ice core analysis", "tree ring study", "ocean temperature measurement",
    "atmospheric co2 reading", "glacial retreat observation", "sea level monitoring", "arctic expedition",
    "paleoclimatology research", "greenhouse gas inventory", "climate policy analysis", "renewable energy report",
    "fossil fuel industry insider", "environmental activist", "meteorological organization", "geophysical survey"
]

verbs = [
    "suggests", "claims", "argues", "reveals", "questions",
    "contradicts", "challenges", "supports", "debunks", "reaffirms",
    "hypothesizes", "speculates", "demonstrates", "indicates", "implies",
    "corroborates", "refutes", "elucidates", "postulates", "infers",
    "extrapolates", "deduces", "proposes", "asserts", "substantiates"
]

objects = [
    "global warming trends are exaggerated",
    "climate change impacts are less severe than predicted",
    "natural factors play a larger role in climate change",
    "proposed climate solutions may be ineffective",
    "climate models have significant uncertainties",
    "sea level rise is accelerating faster than expected",
    "arctic ice melt is reaching a tipping point",
    "extreme weather events are becoming more frequent",
    "ocean acidification is threatening marine ecosystems",
    "deforestation is exacerbating climate change",
    "renewable energy adoption is outpacing projections",
    "fossil fuel reserves are being depleted rapidly",
    "geoengineering could have unintended consequences",
    "climate feedback loops are more complex than thought",
    "urban heat islands are intensifying temperature increases",
    "permafrost thaw is releasing trapped greenhouse gases",
    "global dimming is masking the true extent of warming",
    "cloud formation patterns are shifting due to climate change",
    "ocean currents are showing signs of destabilization",
    "biodiversity loss is accelerating due to climate stress"
]

# List of random words to occasionally insert (now lowercase)
random_words = [
    "quixotic", "serendipitous", "ephemeral", "ubiquitous", "ethereal",
    "paradigm", "quintessential", "anomaly", "paradox", "enigma",
    "zeitgeist", "quantum", "synergy", "holistic", "paradigm",
    "juxtaposition", "obfuscation", "epiphany", "dichotomy", "symbiosis"
]

def generate_sentence():
    sentence = f"{random.choice(subjects)} {random.choice(verbs)} that {random.choice(objects)}."
    if random.random() < 0.3:  # 30% chance to add a random word
        sentence += f" this {random.choice(random_words)} finding has sparked debate in the scientific community."
    return sentence.lower()

def generate_paragraph():
    num_sentences = random.randint(3, 6)
    return ' '.join([generate_sentence() for _ in range(num_sentences)])

def random_date():
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2024, 12, 31)
    random_date = start_date + timedelta(seconds=random.randint(0, int((end_date - start_date).total_seconds())))
    return random_date.strftime("%Y-%m-%dT%H:%M:%SZ")

claims = {
    "gw_not_happening": {
        "sentence_key": "bc_gw_not_happening_sentence",
        "subclaims": ["sc_cold_event_denial", "sc_deny_extreme_weather"]
    },
    "not_caused_by_human": {
        "sentence_key": "bc_not_caused_by_human_sentence",
        "subclaims": ["sc_natural_variations", "sc_past_climate_reference"]
    },
    "impacts_not_bad": {
        "sentence_key": "bc_impacts_not_bad_sentence",
        "subclaims": ["sc_species_adapt", "sc_downplay_warming"]
    },
    "solutions_wont_work": {
        "sentence_key": "bc_solutions_wont_work_sentence",
        "subclaims": ["sc_policies_negative", "sc_policies_ineffective", "sc_policies_difficult", "sc_low_support_policies", "sc_clean_energy_unreliable"]
    },
    "science_movement_unrel": {
        "sentence_key": "bc_science_movement_unrel_sentence",
        "subclaims": ["sc_climate_science_unrel", "sc_no_consensus", "sc_movement_unreliable", "sc_hoax_conspiracy"]
    },
    "individual_action": {
        "sentence_key": "bc_individual_action_sentence",
        "subclaims": []
    }
}

def generate_article():
    source = random.choice(sources)
    content = generate_paragraph()
    article = {
        "title": {"S": f"Climate Change: {generate_sentence().capitalize()}"}, # Title remains capitalized
        "publishedAt": {"S": random_date()}, # publishedAt remains as is
        "author": {"S": f"{random.choice(['john', 'jane', 'alex', 'sam', 'morgan', 'taylor', 'jordan', 'casey'])} {random.choice(['smith', 'doe', 'johnson', 'brown', 'lee', 'garcia', 'martinez', 'rodriguez'])}"},
        "urlToImage": {"S": f"https://{source}/images/climate-{random.randint(1000, 9999)}.jpg"},
        "content": {"S": content},
        "description": {"S": f"brief summary: {content[:100]}..."},
        "sourceName": {"S": source},
        "sourceDescription": {"S": f"a {'leading' if random.random() > 0.5 else 'popular'} news source for {'international' if random.random() > 0.5 else 'national'} news and analysis, known for its {random.choice(['in-depth reporting', 'breaking news coverage', 'investigative journalism', 'opinion pieces', 'data-driven approach'])}."},
        "url": {"S": f"https://{source}/article-{random.randint(10000, 99999)}"}
    }

    selected_claims = random.sample(list(claims.keys()), random.randint(1, 3))

    for claim in selected_claims:
        article[claims[claim]["sentence_key"]] = {"S": generate_paragraph()}
        
        if claims[claim]["subclaims"]:
            num_subclaims = min(len(claims[claim]["subclaims"]), random.randint(1, 3))
            selected_subclaims = random.sample(claims[claim]["subclaims"], num_subclaims)
            
            for subclaim in selected_subclaims:
                article[f"{subclaim}_sentence"] = {"S": generate_paragraph()}

    if random.random() < 0.3:
        article["think_tank_ref_sentence"] = {"S": generate_paragraph()}

    return article

articles = [generate_article() for _ in range(200)]

with open('climate_news_data.json', 'w') as f:
    json.dump(articles, f, indent=2)

print("Generated 200 unique articles with lowercase content (except Title and publishedAt) and saved to climate_news_data.json")
