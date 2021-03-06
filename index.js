//import
var http = require('http'); 
var fs=require('fs');
var express = require('express');

var list=new Array(); 
var latitude;
var longitude;

//read database
fs.readFile('starbucks_new_york.json',function(err,data){  
	if(err)  
		throw err;  
		  
	var jsonObj=JSON.parse(data);   
	var length=0;  
	var size=jsonObj.length;
	
	for(var i=0;i<size;i++){ 
		var record =jsonObj[i];
		list[i] = record;
		//console.log(list[i]['id']);
	}

});
			
var app = express();

app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})	

//Showing list
var html = '<html>'  
        +'<head>'  
		+'<title>Starbucks Finder</title>'  
        +'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1"/>'
		+'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>'
        +'<link rel="stylesheet" type="text/css" href="./bootstrap/css/bootstrap.min.css" />'  
        +'<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>'  
        +'<style>'
		+'html, body {margin: 5px;font-size:18px;}'
		+'</style>'		
		+'</head>'  
        +'<body>' 
		+'<h3>The Starbucks restaurants around you are:</h3>';	

app.get('/process_get', function (req, res) {
	latitude=req.query.lat;
	longitude=req.query.lng;

	for(var i=0;i<list.length;i++){ 		
		var lat =list[i]['location']['latitude']; 
		var lon =list[i]['location']['longitude']; 
		var tem = (lat-latitude)*(lat-latitude)+ (lon-longitude)*(lon-longitude);//math.pow((lat-latitude),2)+ math.pow((lon-longitude),2);
		list[i]['distance']= tem;	
		//console.log(list[i]['distance']);		
	}	
	list.sort(keysrt('distance',false));
	
	for(var i=0;i<10;i++){		
		var value=(i+1) +": <strong>Name</strong>: "+list[i]['name']+"; <strong>Address</strong>: "+ list[i]['street']+'\n';
		html+=value ;
		html+='<br>';
	}
	html+='</body>';
    html+='</html>';  

    res.end(html);
})
		
function keysrt(key,desc) {
  return function(a,b){
    return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
  }
}

var server = app.listen(1337, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Server running at http://%s:%s", host, port)

});
