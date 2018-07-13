/*initialize*/

var config = {
    apiKey: "AIzaSyDCXOzrjAxfQX-DXfdbsJUialafStqqYyU",
    authDomain: "test-d187a.firebaseapp.com",
    databaseURL: "https://test-d187a.firebaseio.com",
    projectId: "test-d187a",
    storageBucket: "test-d187a.appspot.com",
    messagingSenderId: "907285651086"
};
firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword("nascofirebase@gmail.com","passnasco");

var db = firebase.database();
var node = db.ref("/NECST/Monitor/Telescope/Node_status");
var weather = db.ref("/NECST/Monitor/Instrument/Weather");
var encoder = db.ref("/NECST/Monitor/Telescope/Encoder");
var device = db.ref("/NECST/Monitor/Telescope/Device");
var timer = db.ref("/NECST/Monitor/Telescope/Timer");
var rx_vacuum = db.ref("/NECST/Monitor/RX/Vacuum");

var w_device = db.ref("/NECST/Controll/Telescope/Device");
var w_onepoint = db.ref("/NECST/Controll/Telescope/Onepoint");
var w_planet = db.ref("/NECST/Controll/Telescope/Planet");


node.on("value", snapshot => {
	for (i in snapshot.val()){
	    if (i=="NodeStatus"){
		_list="";
		for (j in snapshot.val()[i]){
		    console.log(snapshot.val()[i][j]);
		    _list += (snapshot.val()[i][j]).toString();
		    _list +="\n"
			};
		document.getElementById("n_status").innerText = _list;
		document.getElementById(i).className="node_box_blue";
	    }else if(snapshot.val()[i]==true){
		document.getElementById(i).className="node_box_blue";
	    }else if(snapshot.val()[i]==false){
		document.getElementById(i).className="node_box_red";
	    }else if(snapshot.val()[i]==""){
		document.getElementById(i).className="node_box";
	    }else{
	    }
	}
    });

weather.on("value", snapshot => {
	for (i in snapshot.val()){
	    if (i =="Year"||i=="Month"||i=="Day"||i=="Hour"||i=="Min"||i=="Sec"){
		param = (snapshot.val()[i]).toFixed(0);
	    }else{
		param = (snapshot.val()[i]).toFixed(2);
		document.getElementById(i).innerText = param;
		document.getElementById(i+"_box").className="node_box_blue";
	    }
	}
    });

device.on("value", snapshot => {
	for (i in snapshot.val()){
	    console.log(i)
	    if (i=="Drive_ready_Az"){
	    }else if (i=="Current_Az"||i=="Current_El"||i=="Command_Az"||i=="Command_Az"||i=="Command_El"||i=="Deviation_Az"||i=="Deviation_El"||i=="Current_Dome"){
		param=(snapshot.val()[i]).toFixed(3)
		document.getElementById(i).innerText = param;		
	    }else if(i=="Current_M2"){
		param=(snapshot.val()[i]*1000.).toFixed(3);
		document.getElementById(i).innerText = param;
	    }else{
		document.getElementById(i).innerText = snapshot.val()[i];
	    }
	}
    });

encoder.on("value", snapshot => {
	for (i in snapshot.val()){
	    document.getElementById(i).innerText = (snapshot.val()[i]/3600.).toFixed(4)
	}
    });

timer.on("value", snapshot => {
	for (i in snapshot.val()){
	    try{
		document.getElementById(i).innerText = snapshot.val()[i]
	    }catch(e){
		console.log(e)
	    }
	}
    });

w_device.on("value", snapshot => {
	document.getElementById("user").innerText = snapshot.val()["user"]
    });

rx_vacuum.on("value", snapshot => {
	for (i in snapshot.val()){
	    if (i==""){
		name == "vacuum";
		document.getElementById(name).innerText = (snapshot.val()[i]).toFixed(2)
	    }else{
	    };
	}
    });

var cl = document.getElementsByClassName("btn");
for (i=0;i < cl.length;i++){
    cl[i].onclick = function(){
	console.log(this.id);
	writefunction(this.id);
    };
};

function writefunction(id){
    console.log(id);
    var key = id.split("_")[0];
    var value = id.split("_")[1];
    console.log("key",key);
    console.log("value", value);
    if (key=="drive"){
	w_device.update({drive:value});
    }else if (key=="emergency"){
	w_device.update({emergency:value})
    }else if (key=="hot"){
	w_device.update({hot:value})
    }else if (key=="m4"){
	w_device.update({m4:value})
    }else if (key=="m2"){
	value = name = document.getElementById("input_m2").value;
	w_device.update({m2:value})
    }else if (key=="dome"){
	w_device.update({dome:value})
    }else if (key=="memb"){
	w_device.update({memb:value})
    }else if (key=="authority"){
	w_device.update({authority:value})
    }else if (key=="antenna"){
	az = parseFloat(document.forms.form1.input_az.value);
	el = parseFloat(document.forms.form1.input_el.value);
	var _coord = document.getElementById("mode").value;
	var dt = new Date();
	now = dt.getTime()/1000;
	if (typeof(az)=="number" & typeof(el)=="number"){
	    w_onepoint.update({x:az, y:el, coord:_coord, planet:"", off_x:0, off_y:0, offcoord:"altaz",hosei:"hosei_230.txt",lamda:2600, dcos:0,limit:true, from_node:"web",timestamp:now});
	}else{}
    }else if (key=="planet"){
	    name = document.getElementById("planet").value;
	    var dt = new Date();
	    now = dt.getTime()/1000;
	    w_planet.update({x:0, y:0, coord:"planet", planet:name, off_x:0, off_y:0, offcoord:"altaz",hosei:"hosei_230.txt",lamda:2600, dcos:0,limit:true, from_node:"web",timestamp:now});
    }else if (key=="obsfile"){
	console.log("obsfile");
    }else{
	console.log("no name");
    };    
};

var camera = document.getElementById("camstream");
camera.innerHTML = '<img style="-webkit-user-select: none;" src="http://192.168.101.153:10000/stream?topic=/cv_camera_node/image_raw" width="292" height="130">';
//origin --> w292,h219
