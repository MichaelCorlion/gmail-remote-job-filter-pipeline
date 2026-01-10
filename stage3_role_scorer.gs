/**
 * STAGE 3: ROLE SCORER (The Ranker)
 * Scores remote-verified emails by role suitability and opportunity density
 */

function stage3_RoleScorer() {
  Logger.log('=== STAGE 3: Role Scorer ===');
  
  // Search for all Remote-labeled emails (no time filter)
  var searchQuery = 'label:' + LABEL_REMOTE;
  var threads = GmailApp.search(searchQuery, 0, BATCH_SIZE);
  
  Logger.log('Found ' + threads.length + ' remote-verified threads to score');
  
  if (threads.length === 0) {
    Logger.log('No remote emails to score');
    return;
  }
  
  var props = PropertiesService.getScriptProperties();
  
  // Get label objects
  var priorityLabel = getOrCreateLabel(LABEL_PRIORITY);
  var reviewLabel = getOrCreateLabel(LABEL_REVIEW);
  var lowPriorityLabel = getOrCreateLabel(LABEL_LOW_DENSITY);
  
  // Process each thread
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var threadId = thread.getId();
    
    // Load remote job blocks from Stage 1
    var savedData = props.getProperty('remote_jobs_' + threadId);
    
    if (!savedData) {
      Logger.log('⚠️ No saved data for: ' + thread.getFirstMessageSubject());
      continue;
    }
    
    var remoteJobs = JSON.parse(savedData);
    var totalScore = 0;
    
    // Score each remote job
    for (var j = 0; j < remoteJobs.length; j++) {
      var job = remoteJobs[j];
      var jobScore = 0;
      var text = job.text.toLowerCase();
      
      // Add base score from tier
      if (job.tier === 'GLOBAL') {
        jobScore += GLOBAL_BASE_SCORE;
      } else if (job.tier === 'APAC') {
        jobScore += APAC_BASE_SCORE;
      } else if (job.tier === 'EMEA') {
        jobScore += EMEA_BASE_SCORE;
      }
      
      // Check for suitable roles
      var roleScore = getSuitableRoleScore(job.text);
      jobScore += roleScore;
      
      // Check for kill-switch roles
      if (hasKillSwitchRole(job.text)) {
        jobScore = 0; // This specific job is disqualified
      }
      
      totalScore += jobScore;
    }
    
    // Apply labels based on aggregate score
    if (totalScore >= MIN_PRIORITY_SCORE) {
      if (!STAGE3_DRY_RUN) {
        thread.addLabel(priorityLabel);
        thread.star();
        thread.markImportant();
      }
      Logger.log('🔥 [DRY RUN] PRIORITY: ' + totalScore + ' - ' + thread.getFirstMessageSubject());
      
    } else if (totalScore >= MIN_REVIEW_SCORE) {
      if (!STAGE3_DRY_RUN) {
        thread.addLabel(reviewLabel);
      }
      Logger.log('👀 [DRY RUN] REVIEW: ' + totalScore + ' - ' + thread.getFirstMessageSubject());
      
    } else {
      if (!STAGE3_DRY_RUN) {
        thread.addLabel(lowPriorityLabel);
      }
      Logger.log('📌 [DRY RUN] LOW PRIORITY: ' + totalScore + ' - ' + thread.getFirstMessageSubject());
    }
    
    // Clean up stored data
    if (!STAGE3_DRY_RUN) {
      props.deleteProperty('remote_jobs_' + threadId);
    }
  }
  
  Logger.log('Stage 3 Complete');
}
