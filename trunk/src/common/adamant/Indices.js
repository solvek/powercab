PowerCab.Indices = {
	items : [
		{img:"money.png", path:'/opt/g_data/@account', bit:0x1, label:"indlabel.balance"},
		{img:"in.gif", path:'/opt/traf_cnt[@name="total"]/@rx', bit:0x2, label:"indlabel.input"},
		{img:"out.gif", path:'/opt/traf_cnt[@name="total"]/@tx', bit:0x4, label:"indlabel.output"},
		{img:"world.png", path:'/opt/traf_cnt[@name="west"]/@sum', bit:0x8, label:"indlabel.west"},
		{img:"ukraine.gif", path:'/opt/traf_cnt[@name="ua"]/@sum', bit:0x10, label:"indlabel.ukraine"},
		{img:"video.png", path:'/opt/traf_cnt[@name="media"]/@sum', bit:0x20, label:"indlabel.uamedia"},
		{img:"sum.png", path:'/opt/traf_cnt[@name="total"]/@sum', bit:0x40, label:"indlabel.total"},
		{img:"warning.png", path:'/opt/limit/@limit', bit:0x80, label:"indlabel.limit"}
		],
	def: 0x1 | 0x8,
			
	fromMask : function(mask){
		var res=[];
		for(var i in this.items)
			if (this.items[i].bit&mask) res.push(this.items[i]);
		return res;
	}
}

//WScript.Echo("Ok");