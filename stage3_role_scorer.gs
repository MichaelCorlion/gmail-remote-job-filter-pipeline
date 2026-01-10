/**
 * STAGE 3: ROLE SCORER (The Ranker)
 * Scores remote-verified emails by role suitability and opportunity density
 */

function stage3_RoleScorer(threadIdsToProcess) {
  Logger.log('=== STAGE 3: Role Scorer ===');
  
  if (!threadIdsToProcess || threadIdsToProcess.length === 0) {
    Logger.log('No remote emails to score');
    return;
  }

  Logger.log('Processing ' + threadIdsToProcess.length + ' specific threads from Stage 1');
  
  var props = PropertiesService.getScriptProperties();
  
  // Get label objects
  var priorityLabel = getOrCreateLabel(LABEL_PRIORITY);
  var reviewLabel = getOrCreateLabel(LABEL_REVIEW);
  var lowPriorityLabel = getOrCreateLabel(LABEL_LOW_DENSITY);
  
  // Process each thread ID passed from the Master function
  for (var i = 0; i < threadIdsToProcess.length; i++) {
    var thread = GmailApp.getThreadById(threadIdsToProcess[i]);
    
    if (!thread) {
      Logger.log('⚠️ Could not find thread for ID: ' + threadIdsToProcess[i]);
      continue;
    }

    var threadId = thread.getId();
    
    // Load the remote job data saved by Stage 1
    var savedData = props.getProperty('remote_jobs_' + threadId);
    
    if (!savedData) {
      Logger.log('⚠️ No saved data for: ' + thread.getFirstMessageSubject());
      // Even if no data, we should ensure we don't keep trying this ID in future runs
      continue;
    }
    
    var remoteJobs = JSON.parse(savedData);
    var totalScore = 0;
    
    // Score each remote job found within this email
    for (var j = 0; j < remoteJobs.length; j++) {
      var job = remoteJobs[j];
      var jobScore = 0;
      
      // 1. Add base score from geographic tier
      if (job.tier === 'GLOBAL') {
        jobScore += GLOBAL_BASE_SCORE;
      } else if (job.tier === 'APAC') {
        jobScore += APAC_BASE_SCORE;
      } else if (job.tier === 'EMEA') {
        jobScore += EMEA_BASE_SCORE;
      }
      
      // 2. Check for suitable role bonuses
      var roleScore = getSuitableRoleScore(job.text);
      jobScore += roleScore;
      
      // 3. Apply Kill-Switch (Instant 0 for this specific job block)
      if (hasKillSwitchRole(job.text)) {
        jobScore = 0; 
      }
      
      totalScore += jobScore;
    }
    
    // DECISION: Apply labels and starring based on aggregate score
    if (totalScore >= MIN_PRIORITY_SCORE) {
      if (!STAGE3_DRY_RUN) {
        thread.addLabel(priorityLabel);
        thread.markImportant();
        // FIX: Star the first message (Threads themselves cannot be starred)
        thread.getMessages()[0].star(); 
      }
      Logger.log('🔥 PRIORITY: Score ' + totalScore + ' - ' + thread.getFirstMessageSubject());
      
    } else if (totalScore >= MIN_REVIEW_SCORE) {
      if (!STAGE3_DRY_RUN) {
        thread.addLabel(reviewLabel);
      }
      Logger.log('👀 REVIEW: Score ' + totalScore + ' - ' + thread.getFirstMessageSubject());
      
    } else {
      if (!STAGE3_DRY_RUN) {
        thread.addLabel(lowPriorityLabel);
      }
      Logger.log('📌 LOW PRIORITY: Score ' + totalScore + ' - ' + thread.getFirstMessageSubject());
    }
    
    // CLEANUP: Delete the stored data to keep our 500KB quota clear
    if (!STAGE3_DRY_RUN) {
      props.deleteProperty('remote_jobs_' + threadId);
    }
  }
  
  Logger.log('Stage 3 Complete');
}
