var AdamantFx = {
  onLoad: function() {
    this.initialized = true;
    var dataNotSpecified = true;
    do{
    	dataNotSpecified = (HostController.getUserName() == null)||(HostController.getUserName() == "")||(HostController.getPassword() == null);
    	if (dataNotSpecified){
    		this.showOptions();
    	}
    	dataNotSpecified = false;
    } while(dataNotSpecified);
    this.AdamantButton = document.getElementById("afx-mainbutton");
    this.ExtensionZone = document.getElementById("afx-panel");
    this.data = null;
    this.PowerCab = new PowerCab(this);
    this.PowerCab.startRefresh();
  },

  goToUrl: function(url) {
    getBrowser().loadURI(url);
  },
  
  goToForum: function(event) {
    this.goToUrl("http://forum.homenet.adamant.ua/index.php?act=search&CODE=getactive");
  },
  	  
  goToCabinet: function(event) {
    this.goToUrl("https://cabinet.homenet.adamant.ua/");
  },
  	  
  showOptions: function(event) {
    window.openDialog("chrome://adamantfx/content/options.xul", null, "modal");
  },
  	  
  beginRequest : function()
  {
  	this.AdamantButton.src = "chrome://adamantfx/content/downind.gif";
  },
  	  
  endRequest : function(shortText, data)
  {
  	  //alert(shortText);
  	  
  	  this.ExtensionZone.tooltiptext = shortText;
  	  this.data = data;
  	  this.AdamantButton.src = data ? "chrome://adamantfx/content/adlogo.png" : "chrome://adamantfx/content/questa.gif";
   	if (data)
   	{
	   	var trafIn = data.trafIn(),
	    	trafOut = data.trafOut();
	 	var lblIn = document.getElementById("afx-trafIn"),
	 		lblOut = document.getElementById("afx-trafOut");
	 	lblIn.value = trafIn.toString();
	 	lblOut.value = trafOut.toString();
	 	lblIn.className = (trafIn >= trafOut) ? "afx-bold-label" : "afx-simple-label";
	 	lblOut.className = (trafIn < trafOut) ? "afx-bold-label" : "afx-simple-label";
 	}
  },
  	  
  showDetails : function()
  {
  	  var file = Components.classes["@mozilla.org/file/directory_service;1"]
                     .getService(Components.interfaces.nsIProperties)
                     .get("TmpD", Components.interfaces.nsIFile);
	file.append("powercab.html");
	file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0664);
  	  
  	  // file is nsIFile, data is a string
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
		                         .createInstance(Components.interfaces.nsIFileOutputStream);

		// use 0x02 | 0x10 to open file for appending.
		foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
		var text;
		if (this.data)
		{
			var serializer = new XMLSerializer();
			text = serializer.serializeToString(this.data.transform("chrome://adamantfx/content/details.xslt"));
		}
		else
		{
			text = this.ExtensionZone.tooltiptext;
		}
		foStream.write(text, text.length);
		foStream.close();
  	  
  	  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                   .getService(Components.interfaces.nsIWindowMediator);
	var mainWindow = wm.getMostRecentWindow("navigator:browser");
	var gBrowser = mainWindow.getBrowser();
	var infoTab = gBrowser.addTab("file://"+file.path);
	gBrowser.selectedTab = infoTab;
  }
};

window.addEventListener("load", function(e) { AdamantFx.onLoad(e); }, false);