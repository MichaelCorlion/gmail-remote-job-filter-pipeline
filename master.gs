/**
 * MASTER ORCHESTRATION FUNCTION
 * Executes all three stages in sequence
 */

function masterJobFilter() {
  Logger.log('🚀 Starting Double-Key Remote Job Pipeline...');
  var startTime = new Date();
  
  try {
    // STAGE 1: Remote Specialist
    Logger.log('');
    stage1_RemoteSpecialist();
    
    // STAGE 2: Cleanup
    Logger.log('');
    stage2_Cleanup();
    
    // STAGE 3: Role Scorer
    Logger.log('');
    stage3_RoleScorer();
    
    var endTime = new Date();
    var duration = (endTime - startTime) / 1000;
    
    Logger.log('');
    Logger.log('✅ Pipeline complete in ' + duration + ' seconds');
    
  } catch (error) {
    Logger.log('❌ ERROR: ' + error.toString());
    
    // Send error notification email
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: '⚠️ Job Filter Error',
      body: 'Error in Double-Key Pipeline:\n\n' + error.toString() + '\n\nCheck execution logs for details.'
    });
  }
}
