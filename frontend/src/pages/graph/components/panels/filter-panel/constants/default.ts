import { CommonOptions, EdgeOptions, VisibilityType } from '../types/interfaces';

// Colors
export const DEFAULT_HIGHLIGHT_COLOR = '#FF0000';
export const DEFAULT_CLUSTER_COLOR = '#00FF00';
export const DEFAULT_EDGE_COLOR = '#0000FF';
export const INACTIVE_COLOR = '#FFFFFF';

// Media Groups
export const murdochMedia = [
  'theaustralian.com.au',
  'news.com.au',
  'heraldsun.com.au',
  'skynews.com.au',
  'dailytelegraph.com.au',
  'couriermail.com.au',
  'nypost.com',
  'wsj.com',
  'foxnews.com',
] as const;

// Sources - using the actual sources from the data
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
] as const;

// Claims - using the actual broad claims and sub claims from the data
export const broadClaims = {
  gw_not_happening: 'global warming is not happening',
  not_caused_by_human: 'climate change is not caused by human activities',
  impacts_not_bad: 'climate change impacts are not that bad',
  solutions_wont_work: "climate solutions won't work",
  science_movement_unrel: 'climate science or movement is unreliable',
  individual_action: 'individual action is pointless',
} as const;

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
} as const;

// Default Options
export const defaultOptions: CommonOptions = {
  articleBody: '',
  broadClaim: '',
  subClaim: '',
  source: '',
  think_tank_ref: '',
  isDuplicate: ''
};

// Default Edge Options
export const defaultEdgeOptions: EdgeOptions = {
  ...defaultOptions,
  visibility: 'off' as VisibilityType
};

// Visibility Types
export const VisibilityTypes = {
  ON: 'on' as VisibilityType,
  OFF: 'off' as VisibilityType,
  HOVER: 'hover' as VisibilityType
};