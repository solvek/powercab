if( !this.JsUtil )
{
    if( this.WScript )
    {
        var fso = new ActiveXObject( "Scripting.FileSystemObject" );
        var file = fso.OpenTextFile( "JsUnit/lib/JsUtil.js", 1 );
        var all = file.ReadAll();
        file.Close();
        eval( all );
    }
    else
        load( "../lib/JsUtil.js" );
    
    eval( JsUtil.prototype.include( "JsUnit/lib/JsUnit.js" ));
    eval( JsUtil.prototype.include( "../src/common/PowerCab.js" ));
    eval( JsUtil.prototype.include( "PowerCabTest.js" ));
}

function AllTests()
{
    TestSuite.call( this, "AllTests" );
}
function AllTests_suite()
{
    var suite = new AllTests();
    suite.addTest( ArrayTestSuite.prototype.suite());
    suite.addTest( MoneyTestSuite.prototype.suite());
    suite.addTest( SimpleTestSuite.prototype.suite());
    return suite;
}
AllTests.prototype = new TestSuite();
AllTests.prototype.suite = AllTests_suite;

if( JsUtil.prototype.isShell )
{
    var args;
    if( this.WScript )
    {
        args = new Array();
        for( var i = 0; i < WScript.Arguments.Count(); ++i )
            args[i] = WScript.Arguments( i );
    }
    else if( this.arguments )
        args = arguments;
    else
        args = new Array();
        
    var result = TextTestRunner.prototype.main( args );
    JsUtil.prototype.quit( result );
}

