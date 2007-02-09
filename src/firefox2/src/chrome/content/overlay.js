var AdamantFx = {
  onLoad: function() {
    this.initialized = true;
    this.preferences = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var dataNotSpecified = true;
    do{
    	dataNotSpecified = (this.getUserName() == null)||(this.getUserName() == "")||(this.getPassword() == null);
    	if (dataNotSpecified){
    		this.showOptions();
    	}
    	dataNotSpecified = false;
    } while(dataNotSpecified);
    this.MyToolTip = document.getElementById("afx-tooltip-box");
    this.AdamantButton = document.getElementById("afx-mainbutton");
    this.reload();
  },

  goToUrl: function(url) {
    getBrowser().loadURI(url);
  },
  
  goToForum: function(event) {
    this.goToUrl("http://forum.homenet.adamant.net/index.php?act=search&CODE=getactive");
  },
  	  
  goToCabinet: function(event) {
    this.goToUrl("https://cabinet.homenet.adamant.net/");
  },
  	  
  showOptions: function(event) {
    window.openDialog("chrome://adamantfx/content/options.xul", null, "modal");
  },
  
  reload: function() {
  	  	var req = new XMLHttpRequest();
		req.open('POST', 'https://cabinet.homenet.adamant.net/', true);
		req.onreadystatechange = function (aEvt) {
	  	if (req.readyState == 4) {
	     if(req.status == 200)
	     {
		  	 AdamantFx.AdamantButton.src = "chrome://adamantfx/content/adlogo.png";
		  	 AdamantFx.createTimer();
	     	var txt = req.responseText;
	     	try{
		     	var m = txt.match(new RegExp("<td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td></tr>\\s*<tr\\s+bgcolor=\\\".C0C0FF", "im"));
		     	if (m == null)
		     	{
		     		dump("===== Begin content\n\r");
		     		dump(txt);
		     		dump("===== End content\n\r");
		     		throw "Data not found";
		     	}
		     	var trafUAIX = new Traffic(m[2], m[3]);
		     	var trafUAMedia = new Traffic(m[4], m[5]);
		     	var trafWorld = new Traffic(m[6], m[7]);
		     }
		    catch(e){
		    	AdamantFx.setErrorMessage("badParsing");
		    	throw e;
		    }
		   	var trafIn = trafUAIX.Input+trafWorld.Input,
		    	trafOut = trafUAIX.Output+trafWorld.Output
	     	trafIn = Math.floor(trafIn*100)/100;
	     	trafOut = Math.floor(trafOut*100)/100;
	     	var lblIn = document.getElementById("afx-trafIn"),
	     		lblOut = document.getElementById("afx-trafOut");
	     	lblIn.value = trafIn.toString();
	     	lblOut.value = trafOut.toString();
	     	lblIn.className = (trafIn >= trafOut) ? "afx-bold-label" : "afx-simple-label";
	     	lblOut.className = (trafIn < trafOut) ? "afx-bold-label" : "afx-simple-label";
	     	
	     	AdamantFXClearNode(AdamantFx.MyToolTip);
	     	AdamantFXAddText(AdamantFx.MyToolTip, "UAIX: "+trafUAIX.Input+"/"+trafUAIX.Output);
	     	AdamantFXAddText(AdamantFx.MyToolTip, "World: "+trafWorld.Input+"/"+trafWorld.Output);
	     	AdamantFXAddText(AdamantFx.MyToolTip, "UAMedia: "+trafUAMedia.Input+"/"+trafUAMedia.Output);
	     }
	     else
	      dump("Error loading page\n");
	  	}
		};
	   	  	 /*  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	    	var username = prefs.getCharPref("extensions.adamantfx.username");
	    	var password = prefs.getCharPref("extensions.adamantfx.password");*/
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.send("action=traffic&login="+escape(AdamantFx.getUserName())+"&password="+escape(AdamantFx.getPassword()));
		this.AdamantButton.src = "chrome://adamantfx/content/downind.gif";
  },
  setErrorMessage: function(msgTitle) {
  		    this.AdamantButton.src = "chrome://adamantfx/content/questa.gif";
	    	AdamantFXClearNode(this.MyToolTip);
			var strbundle=document.getElementById("afx-messErrors");
			if (!strbundle){throw "Messages not loaded!";}
			var mess=strbundle.getString(msgTitle);
			//alert(mess);
	    	AdamantFXAddText(AdamantFx.MyToolTip, mess);
  },
 
 timerElapsed: function(obj) {
 	 dump("timer elapsed");
 	 obj.reload();
	},
 createTimer: function(){
 	if (this.getTimeout() == 0) {dump("Autorefreshing is disabled");return;}
    dump("Created timer.\n\r");
    dump("Refresh period: "+this.getTimeout());
    window.setTimeout(this.timerElapsed, 60000*this.getTimeout(), this);
 },
 	 getUserName : function(){
 	 	 try{
 	 	 	return this.preferences.getCharPref("extensions.adamantfx.username");
 	 	 }
 	 	 catch(e){
 	 	 	 return null;
 	 	 }
 	 },
 	 getPassword : function(){
 	 	 try{
	 	 	 return this.preferences.getCharPref("extensions.adamantfx.password");
 	 	 }
 	 	 catch(e){
 	 	 	 return null;
 	 	 }
 	 },
 	 getTimeout : function(){
 	 	 try
 	 	 {
 	 	 	return this.preferences.getIntPref("extensions.adamantfx.timeout");
 	 	 }
 	 	 catch(e)
 	 	 {
 	 	 	 dump("Error getting period: "+e);
 	 	 	 return 15;
 	 	 }
 	 }
};

window.addEventListener("load", function(e) { AdamantFx.onLoad(e); }, false);

function AdamantFXClearNode(node){
	while(node.childNodes.length>0){
		dump("deletion\n\r");
		node.removeChild(node.firstChild);
	}
}

function AdamantFXAddText(node, txt){
	var label = document.createElement("label");
  	label.setAttribute("value",txt);
  	node.appendChild(label);
}

function Traffic(inp, outp){
	this.Input = parseFloat(inp);
	this.Output = parseFloat(outp);
}