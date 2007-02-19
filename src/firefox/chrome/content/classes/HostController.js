var HostController = 
{
	preferences : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
	
	buildFullUrl : function(fileName)
	{
		return "chrome://adamantfx/content/"+fileName;
	},
	
	getResourceString : function(name)
	{
		throw "Not implemented";
	},
	
	getUserName : function()
	{
		 try{
 	 	 	return this.preferences.getCharPref("extensions.adamantfx.username");
 	 	 }
 	 	 catch(e){
 	 	 	 return null;
 	 	 }
	},
	
	getPassword : function()
	{
		 try{
	 	 	 return this.preferences.getCharPref("extensions.adamantfx.password");
 	 	 }
 	 	 catch(e){
 	 	 	 return null;
 	 	 }
	},
	
	getRefreshRate : function()
	{
		 try
 	 	 {
 	 	 	return this.preferences.getIntPref("extensions.adamantfx.timeout");
 	 	 }
 	 	 catch(e)
 	 	 {
 	 	 	 return 15;
 	 	 }
	}
}