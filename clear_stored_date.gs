function clearAllStoredData() {
  Logger.log('🧹 Clearing all stored property data...');
  
  var props = PropertiesService.getScriptProperties();
  var allKeys = props.getKeys();
  
  Logger.log('Found ' + allKeys.length + ' stored properties');
  
  for (var i = 0; i < allKeys.length; i++) {
    if (allKeys[i].startsWith('remote_jobs_')) {
      props.deleteProperty(allKeys[i]);
      Logger.log('Deleted: ' + allKeys[i]);
    }
  }
  
  Logger.log('✅ Cleanup complete!');
}
