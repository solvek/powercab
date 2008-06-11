var PowerCab =
{
	timer : null,
		
	refresher : null,
	
	init : function()
	{
		this.timer = new Timer(this);
		this.createRefresher();
		this.startTimer();
	},
	
	startRefresh : function()
	{
		HostController.beginRequest();
		this.startRefresh2();
	},
	
	startTimer : function()
	{
		this.timer.stop();
		this.timer.start(this.getRefreshRate()*60000);
	},
	
	timerElapsed : function()
	{
		this.startRefresh();
	},
	
	queryFinished : function(shortText, data, htmlDocument)
	{
		var req = HostController.createHttpRequest();
		req.open("GET", HostController.buildFullUrl("locale/DetTemplate.htm"), false);
		req.send(null);
		var parser = HostController.createDomParser();
		var res = parser.parseFromString(req.responseText, "text/xml");
		if (res.documentElement.nodeName == "parsererror")
		{
			//alert(res.documentElement.textContent);
			dump(res.documentElement.textContent);
		}
		var container = res.selectSingleNode("//div[@id='dataContent']");
		
		var element;
		
		if (htmlDocument)
		{
			element = htmlDocument.documentElement;
		}
		else
		{
			element = res.createElement("font");
			element.setAttribute("color", "#FF0000");
			element.appendChild(res.createTextNode(shortText));
		}
		
		container.appendChild(element);
		
		HostController.endRequest(shortText, data, res);
	},
	
	prefferencesChanged : function()
	{
		this.startTimer();
		this.loginInfo = null;
	}
}