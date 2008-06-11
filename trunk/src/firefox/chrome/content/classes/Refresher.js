PowerCab.createRefresher = function()
{
	//this.refresher = HostController.createHttpRequest();
	this.uri = "https://cabinet.homenet.adamant.net/extension/";
	this.loginInfo = null;
	this.userNamePrefKey = "extensions.adamantfx.username";
	this.refreshRatePrefKey = "extensions.adamantfx.timeout";
	this.indicesMaskPrefKey = "extensions.adamantfx.indicesMask";
}

PowerCab.startRefresh2 = function()
{
	if (!this.loginInfo)
	{
		this.loginInfo = HostController.getUserNameAndPassword(this.uri, false, this.userNamePrefKey);
	}
	
	if (!this.loginInfo)
	{
		var inf = HostController.getResourceString("noLoginInfo");
		this.queryFinished(inf, null, inf);
		return;
	}
	
	var req = this.refresher = HostController.createHttpRequest();
	req.overrideMimeType("text/xml");
	req.open("POST", this.uri, true);
	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		
	req.onreadystatechange = function ()
	{
		  try
		  {
			  if (PowerCab.refresher.readyState == 4)
			  {
			  	 var shortText = null;
			  	 var data = null;
		     	 var htmlDocument = null;
			     if((PowerCab.refresher.status == 200)||(PowerCab.refresher.status == 0))
			     {
			     	/*var txt = PowerCab.refresher.responseText;
			     	alert(txt);*/
			     	var xml = PowerCab.refresher.responseXML;
			     	if (xml.selectSingleNode("/opt/g_data") == null)
			     	{
			     		shortText = xml.selectSingleNode("/opt/@message").nodeValue;
			     	}
			     	else
			     	{
			     		var titleNodes = xml.selectSingleNode("/opt/class_ids");
			     		for(var i=0;titleNodes&&(i<titleNodes.attributes.length);i++)
			     		{
			     			var trafNode = xml.selectSingleNode("/opt/traf_cnt[@name='"+titleNodes.attributes[i].localName +"']");
			     			if (trafNode)
			     			{
			     				trafNode.setAttribute("title", titleNodes.attributes[i].nodeValue);
			     			}
			     		}
			     		
			     		shortText = "Ok. "+xml.selectSingleNode("/opt/g_data/@timestamp").nodeValue;
			     		data = {
				     			_xml : xml,
				     			getValue : function(p){
				     				var node = this._xml.selectSingleNode(p);
				     				if (!node) throw "Failed to find node "+p
				     				return node.nodeValue;
				     			}
			     			};
			     			
						var req2 = HostController.createHttpRequest();
						req2.overrideMimeType("text/xml; charset=UTF-8");
						req2.open("GET", HostController.buildFullUrl("locale/details.xslt"), false);
						req2.send(null);
						var xsltDoc = req2.responseXML;
						var transformed = xml.transformNode(xsltDoc);
			     		//htmlDocument = transformed.documentElement.innerHTML;
			     		htmlDocument = transformed;
			     	}
			     }
			     else
			     {
			     	shortText =  "Error loading data";
			     }
			     PowerCab.queryFinished(shortText, data, htmlDocument);
			  }
		 }
		 catch(e)
		 {
		 	 var err =  "Error: "+e.message;
		 	 PowerCab.queryFinished(err, null, null);
		 }
	};
	
	req.send("mode=xml&login="+escape(this.loginInfo.userName)+"&password="+escape(this.loginInfo.password));
}

PowerCab.getRefreshRate = function()
{
  return HostController.getIntPref(this.refreshRatePrefKey, 15);
}

PowerCab.getIndicesMask = function()
{
  return HostController.getIntPref(this.indicesMaskPrefKey, PowerCab.Indices.def);
}