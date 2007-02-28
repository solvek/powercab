﻿PowerCab.createRefresher = function()
{
	PowerCab.refresher = HostController.createHttpRequest();
}

PowerCab.startRefresh2 = function()
{
	var req = this.refresher;
	//req.overrideMimeType("text/xml; charset=KOI8-R");
	req.overrideMimeType("text/xml");
	//req.open("GET", "file:///D:/Sergi/Projects/PowerCab/tmp/sample.xml", true);
	req.open("POST", "https://cabinet.homenet.adamant.ua/index.cgi", true);
		
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
						//req2.overrideMimeType("text/xml; charset=UTF-8");
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
	//alert("'"+escape(this.getUserName())+"'");
	//alert("'"+escape(this.getPassword())+"'");
	req.send("mode=xml&login="+escape(this.getUserName())+"&password="+escape(this.getPassword()));
}

PowerCab.areOptionsSpecifiedPropertly = function()
{
	return (this.getUserName() != null)&&(this.getUserName() != "")&&(this.getPassword() != null);
}

PowerCab.getUserName = function()
{
  return HostController.getCharPref("extensions.adamantfx.username");
}

PowerCab.getPassword = function()
{
  return HostController.getCharPref("extensions.adamantfx.password");
}

PowerCab.getRefreshRate = function()
{
  return HostController.getIntPref("extensions.adamantfx.timeout", 15);
}