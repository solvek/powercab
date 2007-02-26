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
	
	queryFinished : function(shortText, data, detailsHtmlText)
	{
		HostController.endRequest(shortText, data, detailsHtmlText);
	},
	
	prefferencesChanged : function()
	{
		this.startTimer();
	}
}