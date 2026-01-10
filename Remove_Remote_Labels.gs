/**
 * REMOVE REMOTE LABELS - For Testing
 * Removes "Remote" and "Remote-Low-Priority" labels from all emails
 * This allows you to re-test the pipeline on existing emails
 */

function removeRemoteLabels() {
  Logger.log('🧹 Removing Remote labels from all emails...');
  Logger.log('═══════════════════════════════════════════════════════');
  
  var remoteLabel = GmailApp.getUserLabelByName('Remote');
  var lowPriorityLabel = GmailApp.getUserLabelByName('Remote-Low-Priority');
  
  var removedCount = 0;
  
  // Remove "Remote" label
  if (remoteLabel) {
    var remoteThreads = remoteLabel.getThreads();
    Logger.log('Found ' + remoteThreads.length + ' threads with "Remote" label');
    
    for (var i = 0; i < remoteThreads.length; i++) {
      remoteThreads[i].removeLabel(remoteLabel);
      removedCount++;
    }
    Logger.log('✅ Removed "Remote" label from ' + remoteThreads.length + ' emails');
  } else {
    Logger.log('⚠️ "Remote" label not found');
  }
  
  // Remove "Remote-Low-Priority" label
  if (lowPriorityLabel) {
    var lowPriorityThreads = lowPriorityLabel.getThreads();
    Logger.log('Found ' + lowPriorityThreads.length + ' threads with "Remote-Low-Priority" label');
    
    for (var i = 0; i < lowPriorityThreads.length; i++) {
      lowPriorityThreads[i].removeLabel(lowPriorityLabel);
      removedCount++;
    }
    Logger.log('✅ Removed "Remote-Low-Priority" label from ' + lowPriorityThreads.length + ' emails');
  } else {
    Logger.log('⚠️ "Remote-Low-Priority" label not found');
  }
  
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════════════');
  Logger.log('🎯 TOTAL LABELS REMOVED: ' + removedCount);
  Logger.log('═══════════════════════════════════════════════════════');
  Logger.log('');
  Logger.log('✅ You can now run masterJobFilter to re-process these emails!');
}
