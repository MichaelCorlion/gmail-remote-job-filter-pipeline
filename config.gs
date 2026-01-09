/**
 * ═══════════════════════════════════════════════════════════════
 * CONFIGURATION FILE - REMOTE JOB PIPELINE
 * ═══════════════════════════════════════════════════════════════
 * 
 * This file contains all the settings, keywords, and rules that
 * control how your job filter works.
 * 
 * Think of this as the "Control Panel" for your pipeline.
 */

// ═══════════════════════════════════════════════════════════════
// 🛡️ TESTING MODE
// ═══════════════════════════════════════════════════════════════
// Set this to TRUE when testing - the script will run but won't
// actually change anything (won't label emails, archive, etc.)
// Set this to FALSE when you're ready to use it for real.
// ═══════════════════════════════════════════════════════════════

const DRY_RUN = true;  // Change to false when ready to go live!

// ═══════════════════════════════════════════════════════════════
// 📊 HOW MANY EMAILS TO PROCESS AT ONCE
// ═══════════════════════════════════════════════════════════════
// This controls the "batch size" - how many emails the script 
// checks each time it runs. 50 is the recommended safe number.
// Don't change this unless you know what you're doing!
// ═══════════════════════════════════════════════════════════════

const BATCH_SIZE = 50;

// ═══════════════════════════════════════════════════════════════
// 🏷️ LABEL NAMES (Must Match Your Existing Gmail Labels)
// ═══════════════════════════════════════════════════════════════
// These are the labels your PRIMARY email sorter already uses.
// DO NOT change these names unless you also change them in Gmail!
// ═══════════════════════════════════════════════════════════════

const LABEL_JOBS_HOT = '1.1-🔥---jobs-hot--0-2-days-';        // High-priority job emails (freshly arrived)
const LABEL_JOBS_WARM = '1.2-⏰---jobs-warm--3-5-days-';      // Medium-priority job emails (a few days old)
const LABEL_JOBS_COLD = '1.3-🧊---jobs-cold--6-10-days-';     // Low-priority job emails (getting old)
const LABEL_JOBS_ARCHIVE = '1.4-💾---jobs-archive--11+-days-'; // Where rejected/expired jobs go
const LABEL_PRIORITY = '0.1-✅---priority';                    // For the BEST remote jobs (150+ score)
const LABEL_REVIEW = '0.2-❓---review-needed';                 // For "maybe" jobs (50-149 score, needs manual check)

// ═══════════════════════════════════════════════════════════════
// 🆕 NEW LABELS (Created by This Pipeline)
// ═══════════════════════════════════════════════════════════════
// These labels will be created automatically when the script runs.
// ═══════════════════════════════════════════════════════════════

const LABEL_REMOTE = 'Remote';  // Applied when email has ≥1 remote job
const LABEL_LOW_DENSITY = 'Remote-Low-Priority';  // Remote but not your target roles

// ═══════════════════════════════════════════════════════════════
// 🎯 SCORING SYSTEM - What Score Gets What Label?
// ═══════════════════════════════════════════════════════════════
// Every remote job gets points. The TOTAL points determine the label.
// 
// Example: Global remote (100) + Customer Service (30) = 130 points
// Result: Gets "Priority" label + Star + Important flag
// ═══════════════════════════════════════════════════════════════

const MIN_PRIORITY_SCORE = 150;  // 150+ points = Priority label + Star + Important
const MIN_REVIEW_SCORE = 50;     // 50-149 points = Review label (check manually)
                                  // Below 50 = Low Priority (remote but not great)

// ═══════════════════════════════════════════════════════════════
// 🌍 GEOGRAPHIC TIER POINTS (Base Scores)
// ═══════════════════════════════════════════════════════════════
// Each job gets a BASE score depending on WHERE you can work from.
// These reflect YOUR priorities as a digital nomad.
// ═══════════════════════════════════════════════════════════════

const GLOBAL_BASE_SCORE = 100;  // "Work from anywhere" = BEST
const APAC_BASE_SCORE = 50;     // "Indonesia/Asia welcome" = GOOD (your timezone)
const EMEA_BASE_SCORE = 20;     // "UK/Europe" = OKAY (awkward timezone)

// ═══════════════════════════════════════════════════════════════
// 🔍 TIER 1: GLOBAL REMOTE KEYWORDS
// ═══════════════════════════════════════════════════════════════
// If a job mentions ANY of these phrases, it gets +100 points.
// These mean TRUE location independence.
// 
// You can add more keywords here if you want!
// Just add them like: 'your new keyword',
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// 🔍 TIER 2: APAC/ASIA REMOTE KEYWORDS
// ═══════════════════════════════════════════════════════════════
// If a job mentions ANY of these phrases, it gets +50 points.
// These mean the company is friendly to your timezone (GMT+7/+8).
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// 🔍 TIER 3: EMEA/UK REMOTE KEYWORDS
// ═══════════════════════════════════════════════════════════════
// If a job mentions ANY of these phrases, it gets +20 points.
// These mean remote but in UK/Europe timezone (harder for you).
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// 🚫 FAKE REMOTE DISQUALIFIERS (The "Liar Detector")
// ═══════════════════════════════════════════════════════════════
// If ANY of these words appear within 200 characters of the word
// "remote", the job is rejected as FAKE REMOTE.
// 
// Why? Because "Remote with quarterly office visits" is NOT
// truly remote for someone in Indonesia!
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// 🎖️ PROXIMITY WINDOW (How Close to Check for Fakes)
// ═══════════════════════════════════════════════════════════════
// When the script sees "remote" in a job listing, it checks THIS
// many characters before and after for fake indicators.
// 
// 200 characters = about 2-3 sentences. This catches things like:
// "Remote work during training, then office-based"
// ═══════════════════════════════════════════════════════════════

const PROXIMITY_WINDOW = 200;

// ═══════════════════════════════════════════════════════════════
// ✅ SUITABLE ROLES (Jobs You WANT + Their Bonus Points)
// ═══════════════════════════════════════════════════════════════
// If a remote job mentions ANY of these roles, it gets BONUS points.
// The number is how many points it adds.
// 
// Example: "Customer Service" adds +30 points
// 
// You can add new roles here! Format:
// 'role name': 30,
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// ❌ KILL-SWITCH ROLES (Instant Disqualification)
// ═══════════════════════════════════════════════════════════════
// If a remote job mentions ANY of these roles, its score drops to 0.
// These are jobs you're NOT qualified for OR don't want.
// 
// Example: "Remote Psychologist" → Score becomes 0 (you're not a psychologist)
// 
// You can add more roles to avoid here!
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// 🎓 END OF CONFIGURATION
// ═══════════════════════════════════════════════════════════════
// You're done! Save this file (Ctrl+S or Cmd+S)
// 
// To customize the script:
// 1. Add keywords to the lists above
// 2. Change the point values to match your priorities
// 3. Adjust MIN_PRIORITY_SCORE if you want stricter/looser filtering
// 
// Remember to set DRY_RUN = false when you're ready to go live!
// ═══════════════════════════════════════════════════════════════
