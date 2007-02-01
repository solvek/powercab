	var fso = new ActiveXObject("Scripting.FileSystemObject");
	f = fso.OpenTextFile("D:\\Sergi\\Current\\Projects\\AFX\\files\\cabinet.htm", 1, true);
	var txt = f.ReadAll();
	f.Close();
	var m = txt.match(new RegExp("<td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td><td>(\\d+\.\\d+)</td></tr>\\s*<tr\\s+bgcolor=\\\".C0C0FF", "im"));
	if (m == null)
	{
		WScript.Echo("еѓџэџ сыџ");
	}
	WScript.Echo("Finished");