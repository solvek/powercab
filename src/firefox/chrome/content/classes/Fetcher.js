function Fetcher(url, method, callBack)
{
	this.request = new XMLHttpRequest();
	this.request.open(method, url, true);
	this.callBack = callBack;
	this.send = function(query)
	{
		this.request.send(query);
	}
	
	this.request.onreadystatechange = function (aEvt)
	{
	  try
	  {
		  if (req.readyState == 4)
		  {
		     if(req.status == 200)
		     {
		     	var txt = this.request.responseText;
		     	this.callBack(txt);
		     }
		     else
		     {
		     	throw "Error loading page";
		     }
		  }
	 catch(e)
	 {
	 	 this.callBack(e);
	 }
	};
}