var PowerCabOptions = 
{
	changed : function(event)
	{
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                   .getService(Components.interfaces.nsIWindowMediator);
		var mainWindow = wm.getMostRecentWindow("navigator:browser");
		mainWindow.AdamantFx.PowerCab.prefferencesChanged();
		return true;
	}
}