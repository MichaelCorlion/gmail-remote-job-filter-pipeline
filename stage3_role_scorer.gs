function stage3_RoleScorer(threadIdsToProcess) {
  Logger.log('=== STAGE 3: Role Scorer ===');
  
  if (!threadIdsToProcess || threadIdsToProcess.length === 0) {
    Logger.log('No remote emails to score');
    return;
  }

  var props = PropertiesService.getScriptProperties();
  var priorityLabel = getOrCreateLabel(LABEL_PRIORITY);
  var reviewLabel = getOrCreateLabel(LABEL_REVIEW);
  var lowPriorityLabel = getOrCreateLabel(LABEL_LOW_DENSITY);
  
  for (var i = 0; i < threadIdsToProcess.length; i++) {
    var thread = GmailApp.getThreadById(threadIdsToProcess[i]);
    if (!thread) continue;

    var threadId = thread.getId();
    var savedData = props.getProperty('remote_jobs_' + threadId);
    
    if (!savedData) {
      Logger.log('⚠️ No saved data for: ' + thread.getFirstMessageSubject());
      continue;
    }
    
    try {
      var remoteJobs = JSON.parse(savedData);
      var totalScore = 0;
      
      for (var j = 0; j < remoteJobs.length; j++) {
        var job = remoteJobs[j];
        var jobScore = 0;
        
        if (job.tier === 'GLOBAL') jobScore += GLOBAL_BASE_SCORE;
        else if (job.tier === 'APAC') jobScore += APAC_BASE_SCORE;
        else if (job.tier === 'EMEA') jobScore += EMEA_BASE_SCORE;
        
        jobScore += getSuitableRoleScore(job.text);
        if (hasKillSwitchRole(job.text)) jobScore = 0;
        
        totalScore += jobScore;
      }
      
      // APPLY LABELS & STAR
      if (!STAGE3_DRY_RUN) {
        if (totalScore >= MIN_PRIORITY_SCORE) {
          thread.addLabel(priorityLabel);
          thread.markImportant();
          // FIXED: Star the message, not the thread
          thread.getMessages()[0].star(); 
          Logger.log('🔥 PRIORITY (' + totalScore + '): ' + thread.getFirstMessageSubject());
        } else if (totalScore >= MIN_REVIEW_SCORE) {
          thread.addLabel(reviewLabel);
          Logger.log('👀 REVIEW (' + totalScore + '): ' + thread.getFirstMessageSubject());
        } else {
          thread.addLabel(lowPriorityLabel);
          Logger.log('📌 LOW PRIORITY (' + totalScore + '): ' + thread.getFirstMessageSubject());
        }
        
        // CLEANUP: Always delete property after processing is attempted
        props.deleteProperty('remote_jobs_' + threadId);
      }
    } catch (e) {
      Logger.log('❌ Error scoring thread ' + threadId + ': ' + e.message);
    }
  }
  Logger.log('Stage 3 Complete');
}
