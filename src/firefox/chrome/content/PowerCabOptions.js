var PowerCabOptions = 
{
	changed : function(event)
	{
		var mw = this.mainWindow();
		var mask = 0;
		for(var i in mw.PowerCab.Indices.items){
			var cbx = document.getElementById("powercab-indice-chbx-"+i);
			if (cbx.checked) mask |= mw.PowerCab.Indices.items[i].bit;
		}
		
		var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		pref.setIntPref("extensions.adamantfx.indicesMask", mask);
		
		mw.PowerCab.prefferencesChanged();
		return true;
	},
	
	onload : function(event)
	{
		var mw = this.mainWindow();
		var mask = mw.PowerCab.getIndicesMask();
		var grid = document.getElementById("powercab-options-indices");
		
		var columnsCount = 2;
		for(var i=0;i<columnsCount;i++){
			var c = document.createElement("column");
			c.setAttribute("width", "16px");
			grid.firstChild.appendChild(c);
			
			c = document.createElement("column");
			grid.firstChild.appendChild(c);
		}
		
		var row;
		for(var i in mw.PowerCab.Indices.items){
			var ind = mw.PowerCab.Indices.items[i];
			var idx = parseInt(i);
			if (!(idx%columnsCount)){
				row = document.createElement("row");
				row.setAttribute("align", "center");
			}
			
			var img = document.createElement("image");
			img.setAttribute("src", "chrome://adamantfx/content/img/"+ind.img);
			img.setAttribute("width", "16px");
			img.setAttribute("height", "16px");
			row.appendChild(img);
			
			var cbx = document.createElement("checkbox");
			cbx.setAttribute("id", "powercab-indice-chbx-"+i);
			cbx.setAttribute("label", mw.HostController.getResourceString(ind.label));
			cbx.setAttribute("checked", mask & ind.bit ? "true" : "false");
			row.appendChild(cbx);
			
			if (idx%columnsCount){
				grid.lastChild.appendChild(row);
				rpw=null;
			}
		}
		
		if (row) grid.lastChild.appendChild(row);
		
		return true;
	},
	
	mainWindow : function()
	{
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                   .getService(Components.interfaces.nsIWindowMediator);
		var mainWindow = wm.getMostRecentWindow("navigator:browser");
		return mainWindow;
	}
}