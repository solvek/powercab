// Globally used objects
var fileSystemObject = new ActiveXObject("Scripting.FileSystemObject");
var infoXml = loadXmlDocument('../src/common/Info.xml'); 

// Synchronization process
syncFiles("../src/common/PowerCab.js", "../src/firefox/chrome/content/classes/PowerCab.js");
syncFiles("../src/common/FetchStrategy.js", "../src/firefox/chrome/content/classes/FetchStrategy.js");

var curXml = new XmlModifier("../src/firefox/install.rdf");
curXml.xmlDoc.setProperty("SelectionNamespaces", "xmlns:em='http://www.mozilla.org/2004/em-rdf#'");
curXml.changeValue(getXmlValue("/*/version"), "/*/*/em:version");
curXml.changeValue(getXmlValue("/*/name")+" FX", "/*/*/em:name");
curXml.changeValue(getXmlValue("/*/author"), "/*/*/em:creator");
curXml.changeValue(getXmlValue("/*/homepage"), "/*/*/em:homepageURL");
curXml.save();

//curXml = new XmlModifier("../src/firefox/chrome/content/about.xul", processAbout);
//curXml.changeAttribute(getXmlValue("/*/name")+" FX", "/", "title");
//curXml.save();

// Helping functions
function syncFiles(originalPath)
{
	var origFile = fileSystemObject.GetFile(originalPath);
	// Finding the newest file
	var newestFile = null;
	var newestDate = origFile.DateLastModified;
	for(var i=1;i<arguments.length;i++)
	{
		if (fileSystemObject.FileExists(arguments[i]))
		{
			var curFile = fileSystemObject.GetFile(arguments[i]);
			if (curFile.DateLastModified>newestDate)
			{
				newestDate = curFile.DateLastModified;
				newestFile = arguments[i];
			}
		}
	}
	if (newestFile!=null)
	{
		fileSystemObject.CopyFile(newestFile, originalPath, true);
	}
	
	// Copying files
	for(var i=1;i<arguments.length;i++)
	{
		fileSystemObject.CopyFile(originalPath, arguments[i], true);
	}
}

function XmlModifier(filePath, fileProcessor)
{
	this.filePath = filePath;
	this.xmlDoc = loadXmlDocument(filePath, fileProcessor);
	
	this.changeValue = function(val, xPathTarget)
	{
		//WScript.Echo(this.xmlDoc.documentElement.nodeName);
		var node = this.xmlDoc.documentElement.selectSingleNode(xPathTarget);
		if (node == null)
		{
			throw new Error("XPath '"+xPathTarget+"' not found.");
		}
		//WScript.Echo(node.xml);
		node.text = val;
	}
	
	this.changeAttribute = function(val, xPathTarget, attrName)
	{
	//	WScript.Echo(this.xmlDoc.text);
		var node = this.xmlDoc.selectSingleNode(xPathTarget);
		if (node == null)
		{
			throw new Error("XPath '"+xPathTarget+"' not found.");
		}
		node.attributes.item(attrName).text = val;
	}
	
	this.save = function()
	{
		this.xmlDoc.save(this.filePath);
	}
}

function getXmlValue(xPath)
{
	return infoXml.selectSingleNode(xPath).text;
}

function loadXmlDocument(filePath, fileProcessor)
{
	var doc = new ActiveXObject("Msxml2.DOMDocument.3.0");
	doc.async = false;
	if (arguments.length == 1)
	{
		doc.load(filePath);
	}
	else
	{
		var file = fileSystemObject.OpenTextFile(filePath);
		var fileText = file.ReadAll();
		file.Close();
		
		doc.loadXML(fileProcessor(fileText));
	}
	if (doc.parseError.errorCode != 0)
	{
		throw new Error("Cannot load xml '"+filePath+"'. Error " + doc.parseError.reason);
	}
	doc.setProperty("SelectionLanguage", "XPath");
	return doc;
}

function processAbout(fileText)
{
	var start = fileText.indexOf("<dialog");
	return fileText.substr(start);
}