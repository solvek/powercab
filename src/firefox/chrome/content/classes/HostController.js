var HostController = 
{
	preferences : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
		
  onLoad: function() {
    this.initialized = true;
    try{this.preferences.clearUserPref("extensions.adamantfx.password");}catch(e){} // Should be removed later
    this.AdamantButton = document.getElementById("afx-mainbutton");
    this.ExtensionZone = document.getElementById("afx-panel");
    this.TextResources = document.getElementById("afx-messagesBundle");
  	this.file = Components.classes["@mozilla.org/file/directory_service;1"]
         .getService(Components.interfaces.nsIProperties)
         .get("TmpD", Components.interfaces.nsIFile);
	this.file.append("powercab.html");
	this.file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0664);
    PowerCab.init();
    PowerCab.startRefresh();
  	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                   .getService(Components.interfaces.nsIWindowMediator);
	var mainWindow = wm.getMostRecentWindow("navigator:browser");
	this.gBrowser = mainWindow.getBrowser();
	this.gBrowser.tabContainer.addEventListener("TabClose", this.someTabClosed, false);
  },

  showOptions: function(event) {
    window.openDialog("chrome://adamantfx/content/options.xul", null, "modal");
  },
  	  
  beginRequest : function()
  {
  	this.AdamantButton.src = "chrome://adamantfx/content/downind.gif";
  },
  	  
  endRequest : function(shortText, data, detailsHtmlText)
  {
	if (!detailsHtmlText)
	{
		detailsHtmlText = "No additional information available";
	}
	
	this.ExtensionZone.tooltipText = shortText;
  	this.AdamantButton.src = data ? "chrome://adamantfx/content/adlogo.png" : "chrome://adamantfx/content/questa.gif";
  	
  	// file is nsIFile, data is a string
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
	                         .createInstance(Components.interfaces.nsIFileOutputStream);

	// use 0x02 | 0x10 to open file for appending.
	foStream.init(this.file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
	foStream.write(detailsHtmlText, detailsHtmlText.length);
	foStream.close();
	
	if (this.infoTab)
	{
		this.gBrowser.reloadTab(this.infoTab);
	}
	
   	if (data)
   	{
	 	var lblIn = document.getElementById("afx-trafIn"),
	 		lblOut = document.getElementById("afx-trafOut");
	 	lblIn.value = data.trafIn.toString();
	 	lblOut.value = data.trafOut.toString();
	 	lblIn.className = (data.trafIn >= data.trafOut) ? "afx-bold-label" : "afx-simple-label";
	 	lblOut.className = (data.trafIn < data.trafOut) ? "afx-bold-label" : "afx-simple-label";
 	}
  },
  	  
  showDetails : function()
  {
  	if (!this.file)
  	{
  		return;
  	}
  	
  	if (!this.infoTab)
  	{
		this.infoTab = this.gBrowser.addTab(this.getDetailsFileUri());
	}
	this.gBrowser.selectedTab = this.infoTab;
  },
  	  
  	  relogin : function()
  	  {
  	  	  this.getUserNameAndPassword(PowerCab.uri, true, PowerCab.userNamePrefKey);
  	  	  PowerCab.prefferencesChanged();
  	  },
  	  
 	someTabClosed : function(event)
  	{
  		if (event.target == HostController.infoTab)
  		{
  			HostController.infoTab = null;
  		}
	},
	
	buildFullUrl : function(fileName)
	{
		return "chrome://adamantfx/content/"+fileName;
	},
	
	getResourceString : function(key)
	{
		return this.TextResources.getString(key);
	},
	
	getCharPref : function(name)
	{
		 try{
 	 	 	return this.preferences.getCharPref(name);
 	 	 }
 	 	 catch(e){
 	 	 	 return null;
 	 	 }
	},
	
	getIntPref : function(name, defVal)
	{
		 try
 	 	 {
 	 	 	return this.preferences.getIntPref(name);
 	 	 }
 	 	 catch(e)
 	 	 {
 	 	 	 return defVal;
 	 	 }
	},
		
	getDetailsFileUri : function()
	{
		return this.file ? "file://"+this.file.path : null;
	},
		
	createHttpRequest : function()
	{
		return new XMLHttpRequest();
	},
		
	getUserNameAndPassword : function(key, ignoreSaved, nameUsedKey)
	{
		var userName = {value : ""}, password = {value : ""}, hostUri = {value : ""};
		if (!ignoreSaved)
		{
			try
			{
				var loginPref = this.getCharPref(nameUsedKey);
				var pswManager = Components.classes ['@mozilla.org/passwordmanager;1']
					.getService(Components.interfaces.nsIPasswordManagerInternal);
				pswManager.findPasswordEntry(
					key,
					loginPref,
					null,
					hostUri,
					userName,
					password);
			}
			catch(e)
			{
				dump(e);
			}
		}
		
		if ((userName.value == "")||(password.value == ""))
		{
			var dialog = Components.classes ['@mozilla.org/network/default-auth-prompt;1']
				.getService(Components.interfaces.nsIAuthPrompt);
			if (!dialog.promptUsernameAndPassword(
				this.getResourceString("promptUserNamePassword"),
				this.getResourceString("promptUserNamePasswordDet"),
				key,
				dialog.SAVE_PASSWORD_PERMANENTLY,
				userName,
				password))
			{
				return null;
			}
		}
		
		if ((userName.value == "")||(password.value == ""))
		{
			return null;
		}
		else
		{
			//this.preferences.clearUserPref(nameUsedKey);
			this.preferences.setCharPref(nameUsedKey, userName.value);
			return {userName : userName.value, password : password.value};
		}
	}
}

window.addEventListener("load", function(e) { HostController.onLoad(e); }, false);

XMLDocument.prototype.selectSingleNode = function(xPath)
{
	var xpe = new XPathEvaluator();
	var nsResolver = xpe.createNSResolver(this.documentElement);
	var result = xpe.evaluate(xPath, this, nsResolver, 0, null);
	return result.iterateNext();
}

XMLDocument.prototype.transformNode = function(objStylesheet)
{
	var oProcessor = new XSLTProcessor()
	oProcessor.importStylesheet(objStylesheet);
	return oProcessor.transformToDocument(this.documentElement);
}