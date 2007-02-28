PowerCab.createRefresher = function()
{
	this.refresher = HostController.createHttpRequest();
	this.uri = "http://cemetery.org.ua";
	this.loginInfo = null;
	this.userNamePrefKey = "extensions.adamantfx.username";
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
	
	var req = this.refresher;
	req.overrideMimeType("text/xml");
	//req.open("POST", "https://cabinet.homenet.adamant.ua/index.cgi", true);
	req.open("POST", this.uri+"/tmp/.htcabinet/index.cgi", true);
		
	req.onreadystatechange = function ()
	{
		  try
		  {
			  if (PowerCab.refresher.readyState == 4)
			  {
			  	 var shortText = null;
			  	 var data = null;
		     	 var detailsHtmlText = null;
			     if((PowerCab.refresher.status == 200)||(PowerCab.refresher.status == 0))
			     {
			     	//var txt = PowerCab.refresher.responseText;
			     	var xml = PowerCab.refresher.responseXML;
			     	if (xml.selectSingleNode("/opt/g_data") == null)
			     	{
			     		detailsHtmlText = shortText = xml.selectSingleNode("/opt/@message").nodeValue;
			     	}
			     	else
			     	{
			     		shortText = "Ok. "+xml.selectSingleNode("/opt/g_data/@timestamp").nodeValue;
			     		data = {
			     			trafIn : parseFloat(xml.selectSingleNode("/opt/traf_cnt[@name=\"total\"]/@rx").nodeValue),
			     			trafOut : parseFloat(xml.selectSingleNode("/opt/traf_cnt[@name=\"total\"]/@tx").nodeValue)
			     			};
			     			
						var req2 = HostController.createHttpRequest();
						req2.overrideMimeType("text/xml; charset=UTF-8");
						req2.open("GET", "chrome://adamantfx/content/details.xslt", false);
						req2.send(null);
						var xsltDoc = req2.responseXML;
						//alert(xsltDoc.childNodes[0].childNodes[3].childNodes[1].childNodes[3].childNodes[11].textContent);
						/*var xsltDoc = document.implementation.createDocument("", "", null);
						xsltDoc.load("chrome://adamantfx/content/details.xslt");*/
						var transformed = xml.transformNode(xsltDoc);
			     		detailsHtmlText = transformed.documentElement.innerHTML;
			     	}
			     }
			     else
			     {
			     	detailsHtmlText = shortText =  "Error loading data";
			     }
			     PowerCab.queryFinished(shortText, data, detailsHtmlText);
			  }
		 }
		 catch(e)
		 {
		 	 var err =  "Error: "+e.message;
		 	 PowerCab.queryFinished(err, null, err);
		 }
	}
	
	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	req.send("mode=xml&login="+escape(this.loginInfo.userName)+"&password="+escape(this.loginInfo.password));
}

PowerCab.getRefreshRate = function()
{
  return HostController.getIntPref("extensions.adamantfx.timeout", 15);
}