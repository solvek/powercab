var HostController = 
{
	preferences : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
		
  onLoad: function() {
    this.initialized = true;
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
  	  
  endRequest : function(shortText, data, htmlDocument)
  {
	this.ExtensionZone.tooltipText = shortText;
  	this.AdamantButton.src = data ? "chrome://adamantfx/content/adlogo.png" : "chrome://adamantfx/content/questa.gif";
  	
  	// file is nsIFile, data is a string
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
	                         .createInstance(Components.interfaces.nsIFileOutputStream);

	// use 0x02 | 0x10 to open file for appending.
	foStream.init(this.file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
	var serializer = new XMLSerializer();
	serializer.serializeToStream(htmlDocument, foStream, "UTF-8");
	//foStream.write(detailsHtmlText, detailsHtmlText.length);
	foStream.close();
	
	if (this.infoTab)
	{
		this.gBrowser.reloadTab(this.infoTab);
	}
	
	this.updateIndices(data);
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
		return "chrome://adamantfx/"+fileName;
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
		
	createDomParser : function()
	{
		return new DOMParser();
	},
		
	updateIndices : function(data)
	{
		if (data){
			this.data = data;
		}
		else{
			data = this.data;
		}
		
		var cont = document.getElementById("powercab-indices");
		
		while (cont.firstChild) {
  			cont.removeChild(cont.firstChild);
		}
		
		try
		{
			if (!data) throw "No data";
			
			var indices = PowerCab.Indices.fromMask(PowerCab.getIndicesMask());
			if (indices.length == 0){
				var lbl = document.createElement("label");
				lbl.setAttribute("value", this.getResourceString("noIndices"));
				cont.appendChild(lbl);
			}
			else{
				for(var i in indices){
					var ind = indices[i];
					var img = document.createElement("image");
					img.setAttribute("src", "chrome://adamantfx/content/img/"+ind.img);
					img.setAttribute("tooltipText", this.getResourceString(ind.label));
					cont.appendChild(img);
					
					var lbl = document.createElement("label");
					lbl.setAttribute("value", data.getValue(ind.path));
					lbl.setAttribute("tooltipText", this.getResourceString(ind.label));
					cont.appendChild(lbl);
				}
			}
		}
		catch(e)
		{
			var lbl = document.createElement("label");
			lbl.setAttribute("value", this.getResourceString("error"));
			cont.appendChild(lbl);
			throw e;
		}
	},
		
	getUserNameAndPassword : function(key, ignoreSaved, nameUsedKey)
	{
		var userName=this.getCharPref(nameUsedKey),
			password;
		key.match(/((?:\w+):\/\/(?:[\w.]+))\/?/);
		var hostName = RegExp.$1;
		
		if (!ignoreSaved)
		{
			try
			{
				var pswManager = Components.classes ['@mozilla.org/login-manager;1']
					.getService(Components.interfaces.nsILoginManager);
				
				var logins = pswManager.findLogins({}, hostName, null, key);
				
				for (var i = 0; i < logins.length; i++) {
				  if (logins[i].username == userName) {
				     password = logins[i].password;
				     break;
				  }
				}
			}
			catch(e)
			{
				dump(e);
				throw e;
			}
		}
		
		if (userName == null||password == null)
		{
			var u={value:userName}, p={value:""};
			var dialog = Components.classes ['@mozilla.org/network/default-auth-prompt;1']
				.getService(Components.interfaces.nsIAuthPrompt);
			if (dialog.promptUsernameAndPassword(
				this.getResourceString("promptUserNamePassword"),
				this.getResourceString("promptUserNamePasswordDet"),
				key,
				dialog.SAVE_PASSWORD_PERMANENTLY,
				u,
				p))
			{
				userName = u.value;
				password = p.value;
			}
			else{
				return null;
			}
		}
		
		if (userName == null||password == null)
		{
			return null;
		}
		else
		{
			//this.preferences.clearUserPref(nameUsedKey);
			this.preferences.setCharPref(nameUsedKey, userName);
			return {userName : userName, password : password};
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