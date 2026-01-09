/**
 * CONFIGURATION FILE - REMOTE JOB PIPELINE
 * Synchronized with Existing Gmail Automation Labels
 */

// ============================================
// EXISTING LABELS (Must match your primary sorter)
// ============================================
const LABEL_JOBS_HOT = 'Jobs-Hot';
const LABEL_JOBS_WARM = 'Jobs-Warm';
const LABEL_JOBS_COLD = 'Jobs-Cold';
const LABEL_JOBS_ARCHIVE = 'Jobs-Archive';
const LABEL_PRIORITY = 'Priority';  // Uses your existing Priority label
const LABEL_REVIEW = 'Review';      // Uses your existing Review label

// ============================================
// NEW PIPELINE-SPECIFIC LABELS
// ============================================
const LABEL_REMOTE = 'Remote';  // The "Double-Key" label
const LABEL_LOW_DENSITY = 'Remote-Low-Priority';  // Remote but weak role match

// ============================================
// SCORING THRESHOLDS
// ============================================
const MIN_PRIORITY_SCORE = 150;  // Gets Priority label + Star + Important
const MIN_REVIEW_SCORE = 50;     // Gets Review label

// ============================================
// GEOGRAPHIC TIER SCORES
// ============================================
const GLOBAL_BASE_SCORE = 100;
const APAC_BASE_SCORE = 50;
const EMEA_BASE_SCORE = 20;

// ============================================
// REMOTE KEYWORDS (Tier Detection)
// ============================================
const GLOBAL_KEYWORDS = [
  'work from anywhere',
  'globally remote',
  'worldwide',
  'digital nomad',
  'location independent',
  '100% remote',
  'fully remote',
  'remote-first',
  'remote first'
];

const APAC_KEYWORDS = [
  'indonesia',
  'bali',
  'lombok',
  'gmt+8',
  'gmt+7',
  'asia-pacific',
  'apac',
  'southeast asia',
  'se asia',
  'asia'
];

const EMEA_KEYWORDS = [
  'united kingdom',
  'uk',
  'england',
  'europe',
  'european union',
  'eu',
  'emea',
  'gmt',
  'cet',
  'bst'
];

// ============================================
// FAKE REMOTE DISQUALIFIERS
// ============================================
const FAKE_REMOTE_KEYWORDS = [
  'hybrid',
  'on-site',
  'onsite',
  'on site',
  'office-based',
  'office based',
  'visit office',
  'in-person',
  'in person',
  'temporary remote',
  'remote during probation',
  'remote for now',
  'after training',
  'must relocate'
];

// ============================================
// SUITABLE ROLES (with bonus points)
// ============================================
const SUITABLE_ROLES = {
  'sales': 30,
  'sdr': 30,
  'bdr': 30,
  'account executive': 30,
  'customer service': 30,
  'customer support': 30,
  'customer success': 30,
  'online concierge': 30,
  'travel organizer': 30,
  'automation specialist': 30,
  'virtual assistant': 25,
  'junior operations': 25,
  'entry level': 20,
  'associate': 15
};

// ============================================
// KILL-SWITCH ROLES (instant disqualification)
// ============================================
const KILL_SWITCH_ROLES = [
  'psychologist',
  'nurse',
  'play worker',
  'childcare',
  'senior account manager',
  'director',
  'vp ',
  'chief ',
  'executive',
  'phd required',
  'ph.d required'
];

// ============================================
// BATCH PROCESSING
// ============================================
const BATCH_SIZE = 50;

// ============================================
// PROXIMITY WINDOW FOR FAKE REMOTE DETECTION
// ============================================
const PROXIMITY_WINDOW = 200;

// ============================================
// DRY RUN MODE (for testing)
// ============================================
const DRY_RUN = false;  // Set to true to test without making changes
