function Timer(callBack)
{
	this.callBack = callBack;
	this.intervaId = null;
	
	this.start = function(delay /* Interval in miliseconds*/)
	{
		this.stop();
		this.intervaId = window.setInterval(this.callBack, delay);
	}
	
	this.stop = function()
	{
		if (this.intervaId != null)
		{
			window.clearInterval(this.intervaId);
			this.intervaId = null;
		}
	}
}