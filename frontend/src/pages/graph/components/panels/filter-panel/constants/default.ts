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

export const broadClaims = {
  gw_not_happening: 'Global warming is not happening',
  not_caused_by_human: 'Climate change is not caused by human activities',
  impacts_not_bad: 'Climate change impacts are not that bad',
  solutions_wont_work: "Climate solutions won't work",
  science_movement_unrel: 'Climate science or movement is unreliable',
  individual_action: 'Climate change should be addressed by individual action.'
} as const;

export const subClaims = {
  sc_cold_event_denial: 'Cold weather event disproves global warming',
  sc_deny_extreme_weather: 'Extreme weather events are not increasing',
  sc_natural_variations: 'Climate change is due to natural variations',
  sc_past_climate_reference: 'Past climate changes prove current changes are natural',
  sc_species_adapt: 'Species can adapt to climate change',
  sc_downplay_warming: 'Downplaying the impact of a few degrees of warming.',
  sc_policies_negative: 'Climate policies have negative consequences',
  sc_policies_ineffective: 'Climate policies are ineffective',
  sc_policies_difficult: 'Climate policies are too difficult to implement',
  sc_low_support_policies: 'There is low public support for climate policies',
  sc_clean_energy_unreliable: 'Clean energy sources are unreliable',
  sc_climate_science_unrel: 'Climate science is unreliable',
  sc_no_consensus: 'There is no scientific consensus on climate change',
  sc_movement_unreliable: 'The climate movement is unreliable',
  sc_hoax_conspiracy: 'Climate change is a hoax or conspiracy',
  sc_deny_causal_extreme_weather: 'Climate change is not a causal factor in extreme weather events.'
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