var FetStrategy = 
{
	QueryUrl : "http://cemetery.org.ua/tmp/.htcabinet/index.cgi?mode=xml",
	
	prepareXml : function(data) {return new DataContainer(data);},
	
	getMethodType() : function() {return "GET"}
}