function PowerCab(owner)
{
	this.owner = owner;
	
	this.startRefresh = function()
	{
		this.owner.beginRequest(this);
		Fetcher.send(this, FetchStrategy.QueryUrl+"?mode=xml&login="+escape(HostController.getUserName())+"&password="+escape(HostController.getPassword()), "", FetchStrategy.getMethodType());
	}
	
	this.startTimer = function()
	{
		//alert(HostController.getRefreshRate());
		this.timer.stop();
		this.timer.start(HostController.getRefreshRate()*60000);
	}
	
	this.timerElapsed = function(timer)
	{
		this.startRefresh();
	}
	
	this.queryFinished = function(result)
	{
		//alert(result);
		var shortText, data = null;
		if (typeof(result) == "string")
		{
			data = FetchStrategy.prepareXml(result);
			if (!data.dataExists())
			{
				shortText = data.errorMessage();
				data = null;
			}
			else
			{
				shortText = "Ok. "+data.timestamp();
			}
		}
		else
		{
			shortText = result.message;
		}
		this.owner.endRequest(shortText, data);
	};
	
	this.prefferencesChanged = function()
	{
		this.startTimer();
	};
	
	this.timer = new Timer(this);
	//this.fetcher = new Fetcher(this, FetchStrategy.QueryUrl, FetchStrategy.getMethodType());
	this.startTimer();
}