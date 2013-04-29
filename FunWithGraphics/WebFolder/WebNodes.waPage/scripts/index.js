
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var buttonGetHTML = {};	// @button
	var textFieldURIEntry = {};	// @textField
// @endregion// @endlock

	function getFrameContents(frameID){
	   var iFrame =  document.getElementById(frameID);
	   var iFrameBody;
	   if ( iFrame.contentDocument ) 
	   { // FF
		 iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
	   }
	   else if ( iFrame.contentWindow ) 
	   { // IE
		 iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
	   }
		return (iFrameBody.innerHTML);
	 }
 
// eventHandlers// @lock

	buttonGetHTML.click = function buttonGetHTML_click (event)// @startlock
	{// @endlock
		html = getFrameContents('framePage');
		console.log('html', html);
	};// @lock

	textFieldURIEntry.change = function textFieldURIEntry_change (event)// @startlock
	{// @endlock
		var html;
		var uri = 'http://' + $$('textFieldURIEntry').getValue();
		$$('framePage').setValue(uri);
		$$('framePage').getLabel().setValue(uri);

	};// @lock

// @region eventManager// @startlock
	WAF.addListener("buttonGetHTML", "click", buttonGetHTML.click, "WAF");
	WAF.addListener("textFieldURIEntry", "change", textFieldURIEntry.change, "WAF");
// @endregion
};// @endlock
