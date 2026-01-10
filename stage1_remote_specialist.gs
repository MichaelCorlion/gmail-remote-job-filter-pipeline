/**
 * STAGE 1: REMOTE SPECIALIST (The Gatekeeper)
 * Identifies emails containing at least one truly remote job opportunity
 */

function stage1_RemoteSpecialist() {
  Logger.log('=== STAGE 1: Remote Specialist ===');

  var processedThreadIds = [];
  
  // Search for job emails that haven't been checked yet
  var searchQuery = '(label:' + SEARCH_JOBS_HOT + ' OR label:' + SEARCH_JOBS_WARM + ' OR label:' + SEARCH_JOBS_COLD + ') -label:' + LABEL_REMOTE;
  var threads = GmailApp.search(searchQuery, 0, BATCH_SIZE);
  
  Logger.log('Found ' + threads.length + ' threads to process');
  
  if (threads.length === 0) {
    Logger.log('No new job emails to process');
    return processedThreadIds;
  }
  
  var remoteLabel = getOrCreateLabel(LABEL_REMOTE);
  var props = PropertiesService.getScriptProperties();
  var remoteCount = 0;
  
  // Process each thread
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var messages = thread.getMessages();
    var emailBody = messages[0].getBody(); // Get first message body
    
    // Extract job blocks from email
    var jobBlocks = extractJobBlocks(emailBody);
    
    if (jobBlocks.length === 0) {
      Logger.log('No job blocks found in: ' + thread.getFirstMessageSubject());
      continue;
    }
    
    // Process each job block
    var remoteJobs = [];
    
    for (var j = 0; j < jobBlocks.length; j++) {
      var block = jobBlocks[j];
      var tier = detectRemoteTier(block);
      
      // If tier found AND not fake remote, this is a valid remote job
      if (tier !== "NONE" && !isFakeRemote(block)) {
        remoteJobs.push({
          text: block.substring(0, 500),  // Only store first 500 chars
          tier: tier
        });
      }
    }
    
    // DECISION: If at least 1 remote job found, apply label
    if (remoteJobs.length > 0) {
      if (!STAGE1_DRY_RUN) {
        thread.addLabel(remoteLabel);
        
        // Save remote jobs for Stage 3
        props.setProperty(
          'remote_jobs_' + thread.getId(),
          JSON.stringify(remoteJobs)
        );
      }
      
      remoteCount++;
      Logger.log('✅ Remote jobs found (' + remoteJobs.length + '): ' + thread.getFirstMessageSubject());
      processedThreadIds.push(thread.getId());
    } else {
      Logger.log('❌ No remote jobs: ' + thread.getFirstMessageSubject());
    }
  }
  
  Logger.log('Stage 1 Complete: ' + remoteCount + ' emails with remote jobs found');
  return processedThreadIds;
}
