function DataContainer(xmlText)
{
	this.domParser = new DOMParser();
	this.doc = this.domParser.parseFromString(xmlText, "text/xml");
	
	this.exists = function(xPath)
	{
		return (this.getXPath(xPath).length > 0);
	}
	
	this.getXPathFirstValue = function(xPath)
	{
		var res = this.getXPath(xPath);
		if (res.length>0)
		{
			//alert(res[0]);
			return res[0].nodeValue;
		}
		else
		{
			throw new Error("XPath "+xPath+" not found");
		}
	}
	
	this.transform = function(xsltPath)
	{
		var req = new XMLHttpRequest();
		req.open("GET", xsltPath, false); 
		req.send(null);
		var xsltDoc = this.domParser.parseFromString(req.responseText, "text/xml");
		/*var xsltDoc = document.implementation.createDocument("", "", null);
		xsltDoc.load(xsltPath);*/
		var oProcessor = new XSLTProcessor()
		oProcessor.importStylesheet(xsltDoc);
		return oProcessor.transformToDocument(this.doc);
	}
	
	this.getXPath = function(xPath)
	{
	  var xpe = new XPathEvaluator();
	  var nsResolver = xpe.createNSResolver(this.doc.documentElement);
	  var result = xpe.evaluate(xPath, this.doc, nsResolver, 0, null);
	  var found = [];
	  var res;
	  while (res = result.iterateNext())
	    found.push(res);
	  return found;		
	}
}