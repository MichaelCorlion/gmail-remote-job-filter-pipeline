/**
 * STAGE 2: THE PURGE (The Janitor)
 * Archives emails that lack remote opportunities
 */

function stage2_Cleanup() {
  Logger.log('=== STAGE 2: The Purge ===');
  
  // Search for all job emails (no time filter)
  var searchQuery = 'label:' + LABEL_JOBS_HOT + ' OR label:' + LABEL_JOBS_WARM + ' OR label:' + LABEL_JOBS_COLD;
  var threads = GmailApp.search(searchQuery, 0, BATCH_SIZE);
  
  Logger.log('Found ' + threads.length + ' job threads to check');
  
  if (threads.length === 0) {
    Logger.log('No job emails to process');
    return;
  }
  
  var remoteLabel = GmailApp.getUserLabelByName(LABEL_REMOTE);
  var archiveLabel = getOrCreateLabel(LABEL_JOBS_ARCHIVE);
  var archivedCount = 0;
  
  // Process each thread
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var labels = thread.getLabels();
    
    // Check if "Remote" label exists on this thread
    var hasRemoteLabel = false;
    for (var j = 0; j < labels.length; j++) {
      if (labels[j].getName() === LABEL_REMOTE) {
        hasRemoteLabel = true;
        break;
      }
    }
    
    // THE KILL DECISION: No Remote label = Archive
    if (!hasRemoteLabel) {
      if (!DRY_RUN) {
        thread.addLabel(archiveLabel);
        thread.moveToArchive();
        thread.markRead();
      }
      
      archivedCount++;
      Logger.log('🗑️ Archived (no remote): ' + thread.getFirstMessageSubject());
    }
  }
  
  Logger.log('Stage 2 Complete: ' + archivedCount + ' emails archived');
}
