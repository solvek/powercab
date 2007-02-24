var Fetcher =
{
	request : new XMLHttpRequest(),
	
	send : function(owner, url, query, method)
	{
		this.request.overrideMimeType("text/xml; charset=KOI8-R");
		this.request.open(method, url, true);
		this.owner = owner;
		
		this.request.onreadystatechange = function ()
		{
		  try
		  {
			  if (Fetcher.request.readyState == 4)
			  {
			     if(Fetcher.request.status == 200)
			     {
			     	var txt = Fetcher.request.responseText;
			     	//var xml = Fetcher.request.responseXML;
			     	Fetcher.owner.queryFinished(txt);
			     }
			     else
			     {
			     	throw "Error loading page";
			     }
			  }
		 }
		 catch(e)
		 {
		 	 Fetcher.owner.queryFinished(e);
		 }
		};
		
		this.request.send(query);
	}
}