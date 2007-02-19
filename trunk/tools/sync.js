// Globally used objects
var fileSystemObject = new ActiveXObject("Scripting.FileSystemObject");
var infoXml = loadXmlDocument('../src/common/Info.xml'); 

// Synchronization process
syncFiles("../src/common/PowerCab.js", "../src/firefox/chrome/content/classes/PowerCab.js");
syncFiles("../src/common/FetchStrategy.js", "../src/firefox/chrome/content/classes/FetchStrategy.js");

var curTextFile = new FileModifier("../src/firefox/install.rdf");
curTextFile.changeValue("$1"+getXmlValue("/*/version")+"$3", new RegExp("(<em:version>)([^<]*)(</em:version>)", "m"));
curTextFile.changeValue("$1"+getXmlValue("/*/name")+" FX$3", new RegExp("(<em:name>)([^<]*)(</em:name>)", "m"));
curTextFile.changeValue("$1"+getXmlValue("/*/author")+"$3", new RegExp("(<em:creator>)([^<]*)(</em:creator>)", "m"));
curTextFile.changeValue("$1"+getXmlValue("/*/homepage")+"$3", new RegExp("(<em:homepageURL>)([^<]*)(</em:homepageURL>)", "m"));
curTextFile.save();

curTextFile = new FileModifier("../src/firefox/chrome/content/about.xul");
curTextFile.changeValue("$1"+getXmlValue("/*/name")+" FX", new RegExp("(title=\"&about; )([^\"]*)", "m"));
curTextFile.changeValue("$1"+getXmlValue("/*/version"), new RegExp("(<text value=\"&version; )([^\"]*)", "m"));
curTextFile.changeValue("$1"+getXmlValue("/*/author"), new RegExp("(<text\s*value=\"&createdBy;[^>]*>(\n|\n\r|\r\n|\r)?\s*<text\s*value=\")([^\"]*)", "m")); // Does not work currenctly
curTextFile.save();

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

function FileModifier(filePath)
{
	this.filePath = filePath;
	var file = fileSystemObject.OpenTextFile(filePath);
	this.fileText = file.ReadAll();
	file.Close();
	
	this.changeValue = function(val, expr)
	{
		var res = this.fileText.match(expr);
		this.fileText = this.fileText.replace(expr, val);
	}
	
	this.save = function()
	{
		var file = fileSystemObject.CreateTextFile(this.filePath, true);
		file.Write(this.fileText);
		file.Close();
	}
}

function getXmlValue(xPath)
{
	return infoXml.selectSingleNode(xPath).text;
}

function loadXmlDocument(filePath)
{
	var doc = new ActiveXObject("Msxml2.DOMDocument.3.0");
	doc.async = false;
	doc.load(filePath);
	if (doc.parseError.errorCode != 0)
	{
		throw new Error("Cannot load xml '"+filePath+"'. Error " + doc.parseError.reason);
	}
	doc.setProperty("SelectionLanguage", "XPath");
	return doc;
}