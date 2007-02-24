var FetchStrategy = 
{
	QueryUrl : "http://cemetery.org.ua/tmp/.htcabinet/index.cgi",
	
	prepareXml : function(data) {return new DataContainer(data);},
	
	getMethodType : function() {return "GET"}
}