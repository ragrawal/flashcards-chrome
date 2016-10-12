chrome.browserAction.onClicked.addListener(function(tab) {
	// inject Javascript
	var files = [
          "js/jquery.js"
          , "js/bootstrap.min.js"
          , "js/bootstrap-select.min.js"
          , "js/list.js"
          , "js/list.fuzzysearch.js"
          , "js/list.pagination.js"
          , "vendor/showdown-1.4.2/dist/showdown.min.js" 
          , "vendor/showdown-1.4.2/dist/showdown-prettify.min.js"
          , "vendor/showdown-1.4.2/dist/showdown-tables.min.js"
          , "js/flipclock.min.js"
          , "js/model.js"
          , "js/view.js"
          , "js/controller.js"

      ];

    for(i=0; i<files.length; i+=1){
    	chrome.tabs.executeScript(null, {'file':files[i]});
    }

});