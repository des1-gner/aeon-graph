// src/utils/constants.ts
import * as THREE from 'three';

// Visualization Constants
export const VISUALIZATION_CONSTANTS = {
    SPHERE_RADIUS: 20,
    CLUSTER_RADIUS: 8,
    OUTER_SPHERE_PADDING: 2,
    DEFAULT_COLOR: new THREE.Color(0.8, 0.8, 0.8),
    DEFAULT_OPACITY: 0.3,
    ACTIVE_OPACITY: 1,
    DEFAULT_CAMERA_POSITION: new THREE.Vector3(0, 0, 40),
    CAMERA_MOVE_SPEED: 0.1,
    MIN_PARTICLE_DISTANCE: 1,
    LERP_FACTOR: 0.05,
    CAMERA_SETTINGS: {
        FOV: 60,
        NEAR: 0.1,
        FAR: 1000,
        MIN_DISTANCE: 2,
        MAX_DISTANCE: 60,
        DAMPING_FACTOR: 0.25
    },
    PARTICLE_SETTINGS: {
        SIZE: 0.2,
        SEGMENTS: 32,
        FONT_SIZE: 0.15,
        LABEL_OFFSET: new THREE.Vector3(0, -0.5, 0),
        ROUGHNESS: 0.5,
        METALNESS: 0.8,
        MAX_LABEL_WIDTH: 5
    },
    LIGHTING: {
        AMBIENT_INTENSITY: 0.4,
        POINT_LIGHT_INTENSITY: 0.6,
        POINT_LIGHT_POSITION: new THREE.Vector3(10, 10, 10),
        DIRECTIONAL_LIGHT_INTENSITY: 0.5,
        DIRECTIONAL_LIGHT_POSITION: new THREE.Vector3(5, 5, 5)
    }
} as const;

// Broad Claims Mapping
export const BROAD_CLAIMS = {
    gw_not_happening: 'Global warming is not happening',
    not_caused_by_human: 'Climate change is not caused by human activities',
    impacts_not_bad: 'Climate change impacts are not that bad',
    solutions_wont_work: "Climate solutions won't work",
    science_movement_unrel: 'Climate science or movement is unreliable',
    individual_action: 'Climate change should be addressed by individual action.'
} as const;

export const SUB_CLAIMS = {
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


// Monitored News Sources
export const MONITORED_SOURCES = [
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
    'washingtontimes.com'
] as const;

// Default Filter Options
export const DEFAULT_FILTER_OPTIONS = {
    broadClaim: '',
    subClaim: '',
    source: '',
    think_tank_ref: '',
    isDuplicate: '',
    articleBody: ''
} as const;

// Visualization Color Schemes
export const COLOR_SCHEMES = {
    DEFAULT: {
        HIGHLIGHT: '#3B82F6', // Blue
        CLUSTER: '#10B981',   // Green
        EDGE: '#6366F1'       // Indigo
    },
    DARK: {
        HIGHLIGHT: '#60A5FA',
        CLUSTER: '#34D399',
        EDGE: '#818CF8'
    },
    LIGHT: {
        HIGHLIGHT: '#2563EB',
        CLUSTER: '#059669',
        EDGE: '#4F46E5'
    }
} as const;

// Animation Constants
export const ANIMATION_CONSTANTS = {
    TRANSITION_DURATION: 0.02,
    LERP_FACTORS: {
        POSITION: 0.05,
        COLOR: 0.1,
        CAMERA: 0.05
    },
    MAX_POSITION_ATTEMPTS: 50,
    COLLISION_THRESHOLD: 0.1
} as const;

// Edge Visibility Options
export const EDGE_VISIBILITY_OPTIONS = {
    ON: 'on',
    HOVER: 'hover',
    OFF: 'off'
} as const;

// UI Constants
export const UI_CONSTANTS = {
    PANEL_WIDTH: '400px',
    Z_INDEX: {
        LEGEND: 10,
        INFO_PANEL: 20,
        CONTROLS: 30
    }
} as const;

export const CAMERA_CONTROL_CONSTANTS = {
    KEY_CODES: {
        ARROW_UP: 'ArrowUp',
        ARROW_DOWN: 'ArrowDown',
        ARROW_LEFT: 'ArrowLeft',
        ARROW_RIGHT: 'ArrowRight',
        KEY_W: 'KeyW',
        KEY_S: 'KeyS',
        KEY_A: 'KeyA',
        KEY_D: 'KeyD'
    },
    MOVEMENT_SPEED: 0.1,
    ROTATION_SPEED: 0.01,
    ZOOM_SPEED: 1
} as const;

// Export all constants as a single object for convenience
export const ALL_CONSTANTS = {
    VISUALIZATION: VISUALIZATION_CONSTANTS,
    BROAD_CLAIMS,
    SUB_CLAIMS,
    MONITORED_SOURCES,
    DEFAULT_FILTER_OPTIONS,
    COLOR_SCHEMES,
    ANIMATION: ANIMATION_CONSTANTS,
    EDGE_VISIBILITY: EDGE_VISIBILITY_OPTIONS,
    UI: UI_CONSTANTS,
    CAMERA: CAMERA_CONTROL_CONSTANTS
} as const;