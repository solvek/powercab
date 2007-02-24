function Timer(owner)
{
	this.owner = owner;
	this.intervaId = null;
	
	this.start = function(delay /* Interval in miliseconds*/)
	{
		this.stop();
		this.intervaId = window.setInterval(this.Timer_ElapsedHandler, delay, this);
	}
	
	this.stop = function()
	{
		if (this.intervaId != null)
		{
			window.clearInterval(this.intervaId);
			this.intervaId = null;
		}
	}
	
	this.Timer_ElapsedHandler = function(obj)
	{
		obj.owner.timerElapsed(obj);
	}
}