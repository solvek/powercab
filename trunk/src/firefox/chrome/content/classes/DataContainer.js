function DataContainer(xmlText)
{
	this.domParser = new DOMParser();
	this.doc = this.domParser.parseFromString(xmlText, "text/xml");
	
	this.exists = function(xPath)
	{
		
	}
}