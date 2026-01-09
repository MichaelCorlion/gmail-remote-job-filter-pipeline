/**
 * HELPER FUNCTIONS
 * Shared utilities used across all stages
 */

/**
 * Get or create a Gmail label
 * @param {string} labelName - Name of the label to get or create
 * @returns {GmailLabel} The label object
 */
function getOrCreateLabel(labelName) {
  var label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
    Logger.log('Created new label: ' + labelName);
  }
  return label;
}

/**
 * Extract job blocks from email body
 * @param {string} emailBody - The HTML or plain text email body
 * @returns {Array} Array of job block strings
 */
function extractJobBlocks(emailBody) {
  var blocks = [];
  
  // Try HTML splitting first
  if (emailBody.indexOf('<hr') > -1) {
    blocks = emailBody.split(/<hr\s*\/?>/gi);
  } else if (emailBody.indexOf('</tr>') > -1) {
    // Table-based layout (common in email clients)
    blocks = emailBody.split(/<\/tr>/gi);
  } else {
    // Plain text fallback: Look for job title patterns
    var jobPattern = /([A-Z][a-zA-Z\s]+)\s+at\s+([A-Z][a-zA-Z\s&]+)/g;
    var matches = emailBody.match(jobPattern);
    
    if (matches && matches.length > 0) {
      // Split email around each match (±300 chars context)
      for (var i = 0; i < matches.length; i++) {
        var index = emailBody.indexOf(matches[i]);
        blocks.push(emailBody.substring(Math.max(0, index - 300), index + 600));
      }
    } else {
      // Ultimate fallback: Double newlines
      blocks = emailBody.split(/\n\n+/);
    }
  }
  
  // Filter out blocks that are too short (noise)
  return blocks.filter(function(b) { return b.length > 50; });
}

/**
 * Detect remote tier from job block text
 * @param {string} jobBlockText - Text of a single job block
 * @returns {string} "GLOBAL" | "APAC" | "EMEA" | "NONE"
 */
function detectRemoteTier(jobBlockText) {
  var text = jobBlockText.toLowerCase();
  
  // Tier 1: GLOBAL check
  for (var i = 0; i < GLOBAL_KEYWORDS.length; i++) {
    if (text.indexOf(GLOBAL_KEYWORDS[i]) > -1) {
      return "GLOBAL";
    }
  }
  
  // Tier 2: APAC check
  for (var i = 0; i < APAC_KEYWORDS.length; i++) {
    if (text.indexOf(APAC_KEYWORDS[i]) > -1) {
      return "APAC";
    }
  }
  
  // Tier 3: EMEA check
  for (var i = 0; i < EMEA_KEYWORDS.length; i++) {
    if (text.indexOf(EMEA_KEYWORDS[i]) > -1) {
      return "EMEA";
    }
  }
  
  return "NONE";
}

/**
 * Check if "remote" mention is fake (has disqualifiers nearby)
 * @param {string} jobBlockText - Text of a single job block
 * @returns {boolean} true if fake remote detected
 */
function isFakeRemote(jobBlockText) {
  var text = jobBlockText.toLowerCase();
  
  // Find all "remote" mentions
  var remotePattern = /\bremote\b/gi;
  var match;
  var remoteIndices = [];
  
  while ((match = remotePattern.exec(text)) !== null) {
    remoteIndices.push(match.index);
  }
  
  // For each "remote" mention, check ±PROXIMITY_WINDOW chars for disqualifiers
  for (var i = 0; i < remoteIndices.length; i++) {
    var startPos = Math.max(0, remoteIndices[i] - PROXIMITY_WINDOW);
    var endPos = Math.min(text.length, remoteIndices[i] + PROXIMITY_WINDOW);
    var proximityWindow = text.substring(startPos, endPos);
    
    for (var j = 0; j < FAKE_REMOTE_KEYWORDS.length; j++) {
      if (proximityWindow.indexOf(FAKE_REMOTE_KEYWORDS[j]) > -1) {
        return true; // Fake remote detected
      }
    }
  }
  
  return false;
}

/**
 * Check if job block contains suitable roles
 * @param {string} jobBlockText - Text of a single job block
 * @returns {number} Role bonus points (0 if no match)
 */
function getSuitableRoleScore(jobBlockText) {
  var text = jobBlockText.toLowerCase();
  
  // Check for suitable roles (return first match only)
  for (var role in SUITABLE_ROLES) {
    if (text.indexOf(role) > -1) {
      return SUITABLE_ROLES[role];
    }
  }
  
  return 0;
}

/**
 * Check if job block contains kill-switch roles
 * @param {string} jobBlockText - Text of a single job block
 * @returns {boolean} true if kill-switch role found
 */
function hasKillSwitchRole(jobBlockText) {
  var text = jobBlockText.toLowerCase();
  
  for (var i = 0; i < KILL_SWITCH_ROLES.length; i++) {
    if (text.indexOf(KILL_SWITCH_ROLES[i]) > -1) {
      return true;
    }
  }
  
  return false;
}
