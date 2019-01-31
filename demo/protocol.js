
function is(o, c) {
	if (o === null || o === undefined)  return false
	if (c === null || c === undefined) return false
	if (c === Number) {
		if (o.constructor === c) return isNaN(o) === false
		return false
	}
	return o.constructor === c
}

function isPrimitive(val){
	return isPrimitive.types[getClass(val)];
}
isPrimitive.types = {
	Undefined: "undefined",
	Null: "null",
	Boolean: "boolean",
	Number: "number",
	Symbol: "symbol",
	String: "string"
};
function isElement(obj){
	return obj instanceof HTMLElement;
}
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
function isNegative(value){
	return  ( value ===undefined || value===null || value===false);
}

function getClass(obj) {
return {}.toString.call(obj).slice(8, -1);
}

function byId(node){
return typeof node == 'string' ? document.getElementById(node) : node;
}
function toText(val){
	if(val===null) return "null";
	if(val===undefined) return "undefined";
	if(isPrimitive(val)) return val.toString();
	var type=getClass(val);
	if(type==="Function") return toText.parseFunc(val, "head"); 
	return type;
}
toText.parseFunc = function parseFunc(f, mode){
	f = "" + f;
	var i = f.indexOf("{");
	if (mode=="head") return f.substr(0, i);
	if (mode=="body") return f.substr(i);
	return f;
}
function tag(tagName, setup, target){
	if(!tagName) tagName="div";
	var tag = document.createElement(tagName);
	var type=getClass(setup);
	switch(type){
		case "Object": 
		for(key in setup) tag[key]=setup[key];
		break;
		case "Function":
		setup(tag);
		break;
		case "Null" || "Undefined": break;
		default: tag.innerHTML=toText(setup);
	}
	if(isElement(target)) target.appendChild(tag);
	return tag;
}


(function() {
try{
function def(defaults, actual){
	return Object.assign({}, defaults, actual);
}
function extract(obj, keys){
	if(isPrimitive(obj)) return null;
	if(!Array.isArray(keys)) keys=Object.keys(obj);
return keys.reduce(function(memo, i){
		try{memo[i.toString()]=obj[i];}
		catch(err){
			try{memo[i.toString()]=Object.getOwnPropertyDescriptor(obj, i)}
			catch(err){memo[i.toString()] = err;}
		}
		return memo}, Object.create(null));
}
/* symbols registry */
var ids={
	next: Symbol("next"),
	size: Symbol("size"),
	ownSize: Symbol("ownSize"),
	owns: Symbol("owns"),
	sort: Symbol("sort"),
	sorted: Symbol("sorted"),
	detail: Symbol("detail"),
	control: Symbol("control"),
	controlset: Symbol("controlset"),
	activated: Symbol("activated"),
};
function xObj(obj, primitives){
	var primitive=isPrimitive(obj);
	if(primitive){
		if(!primitives) return obj;
		obj= {value: obj, type: primitive, proto: window[primitive]};
	}
	var index, indexOwn;
	function reindex(key){
		if(key){
			index.push(key);
			indexOwn.push(key);
		}else{
			indexOwn = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
			if(obj.__proto__)indexOwn.push("__proto__");
			index=[];
			for(var i in obj) index.push(i);
		};
	}
	reindex();
	var meta =Object.create(null);
	meta[ids.next] = function (){ return obj[index.next()]};
	meta[ids.size] = function (){ return index.length};
	meta[ids.ownSize] = function (){ return indexOwn.length};
	meta[ids.owns] = function (){ return extract(obj, indexOwn)};
	meta[ids.sorted] = function (){ return extract(obj, index.sort())};

	return new Proxy(obj, {
	set: function(o, p, v){
		if(!(p in o)) reindex(p);
		o[p]=v;
		return true;
	},
	get: function(o, p){
		if(p in o) return o[p];
		if(p in meta) return meta[p]();
		return undefined;
	},
	defineProperty: function define(o, p, desc){
		try{Object.defineProperty(o, p, desc); reindex(p);}
		catch(err){}
		return o;
	},
	deleteProperty: function remove(o, p){
		if(p in o) delete o[p];
		reindex();
	}
	});
}


function write(source, options){
	var options = options || {};
	if(!options.parent) options.parent=byId(write.defaultTarget);
	var container = render({
		source: source,
		parent: options.parent,
		container: tag("div", {
			className: "membrane-write"
		}),
		line: block
	});
	return container;
}
write.defaultTarget=document.body;

function Protocol(settings){
	var settings = settings || {};
	if(!settings.mode) settings.mode="append";
	this.container=ui(settings.container);
	function ui(node){
		var main = byId(node) || document.body;
		var container = tag("div", null, null);
		tag("h4", {
			innerHTML: "protocol: "
		}, main);
		tag("button", {
			innerHTML: "Clear",
		onclick: function(e){container.innerHTML=""}
		}, main);

		tag("button", {
			innerHTML: "Hide",
			onclick: function(e){
				container.hidden=!container.hidden;
				console.log(container.hidden);
				if(container.hidden) e.target.innerHTML= "show";
				else e.target.innerHTML= "hide";
				return false;
			}
		}, main);
		main.appendChild(container);
		return container;
	}

this.out = function (message, options){
	var itemContainer, mode = "console";
	if (isElement(this.container)){
		var options=options || {};
		options.parent=this.container;
		//options.container="div";
		options.source=message;
		options.line=record;
		mode=settings.mode;
		itemContainer = render(options);
	}
	switch (mode){
		case "append": this.container.appendChild(itemContainer); break;
		case "prepend": this.container.insertBefore(itemContainer, this.container.firstChild); break;
		case "replace": 
		this.container.innerHTML = ""; 
		this.container.appendChild(itemContainer); 
		break;
		default: console.log("protocol: " + message);
	}
	return itemContainer;
}

function record(d){
	var source=xObj(d.source);
	var separator="";
	if (d.separator) separator=d.separator;
	else separator=" : ";
	var label= (d.label? d.label+separator : "");
	
	tag("span", {
		innerHTML: label,
		className: "membrane-protocol-label",
	}, d.container);
	var valueView = tag("span", {
		innerHTML: toText(d.source),
		className: "membrane-protocol-content",
	}, d.container);
	if(!isPrimitive(d.source)){
		if(!isElement(d.container[ids.detail])) d.container[ids.detail]= tag("div", {className: "membrane-protocol-detail"}, null);
		var txt, content, container;
		if(getClass(d.source) == "Function"){
			content= toText.parseFunc(d.source, "body");
			container="pre";
			txt="";
		}else{
			content=source;
			container="ul";
			txt=" ("+source[ids.size]+")";
		}
		valueView.innerHTML+=txt;
		valueView.classList.add("membrane-toggle");
		toggleControl(valueView, def(d, {
			parent: d.container[ids.detail],
			container: container,
			source: content,
			label: ""
		}));

		toggleControl(tag("span", {
			innerHTML: " ["+ source[ids.ownSize] + "]",
			className: "membrane-toggle membrane-protocol-content",
		},d.container), def(d, {
			parent: d.container[ids.detail],
			container: "ul",
			source: source[ids.owns]
		}));
		d.container.appendChild(d.container[ids.detail]);
	}
	d.container.className="membrane-protocol-record";
	
}

}

var arrayX={
	initCursor:{
		value:function initCursor(n){
			if(this._cursor !== undefined) return;
			Object.defineProperty(this, "_cursor", {
				writable : true,
				value: n
			});
		}
},
cursor: {
enumerable : false,
get: function(){return this._cursor},
set: function(value){
if (value < 0) value = this.length-1;
if (value >= this.length) value = 0;
this._cursor = value;
}
},
next: {
enumerable : false,
value: function next(){
if(this.cursor == undefined) this.initCursor(-1);
this.cursor++;
return this[this.cursor];
}
},
prev: {
enumerable : false,
value: function prev(){
if(this.cursor == undefined) this.initCursor(0);
this.cursor--;
return this[this.cursor];
}
},
current: {
enumerable : false,
value: function current(n){
if(this.cursor === undefined) this.initCursor(0);
if(isNumeric(n)) this.cursor = n;
return this[this.cursor];
}
}
};

function xArray(){
var x = Object.create(Array.prototype, arrayX)
x.length = 0;
Object.defineProperty(x, "length", {enumerable : false});
return x;
}
Object.defineProperties(Array.prototype, arrayX);

function render(data){
	var data=Object.assign({}, render.defaults, data);
	var container = (isElement(data.container)? data.container : document.createElement(data.container))
	var itemType = render.cyclic[container.tagName.toLowerCase()];
	if(!itemType){
		data.container=container;
		data.line(data);
	}else{
		if(isPrimitive(data.source)) return container;
		var source=data.source;
		for(var i in source){
			var itemData=Object.assign({}, data, {
				container: itemType,
				parent: container,
				source: source[i],
				label: i,
				level: data.level++
			});
			render(itemData)
		}
	}
	if(isElement(data.parent)) data.parent.appendChild(container);
	return container;
}
render.cyclic={
	ul: "li",
	ol: "li",
	select: "option",
	table: "tr",
	tr: "td",
}
render.defaults={
	container: "div",
	level: 0,
	line: function(data){data.container.innerHTML=toText(data.source)},
}
function block(d){
	var source=xObj(d.source);
	var separator="";
	if (d.separator) separator=d.separator;
	else separator=" : ";
	var label= (d.label? d.label+separator : "");
	
	tag("span", {
		innerHTML: label,
		className: "membrane-protocol-label",
	}, d.container);
	var valueView = tag("span", {
		innerHTML: toText(d.source),
		className: "protocol-record-content",
	}, d.container);
	if(!isPrimitive(d.source)){
		d.container[ids.detail]= tag("div", {className: "membrane-protocol-record-detail"}, null);
		var txt, content, container;
		if(getClass(d.source) == "Function"){
			content= toText.parseFunc(d.source, "body");
			container="div";
			txt="";
		}else{
			content=source;
			container="ul";
			txt=" ("+source[ids.size]+")";
		}
		valueView.innerHTML+=txt;
		valueView.classList.add("membrane-toggle");
		toggleControl(valueView, def(d, {
			parent: d.container[ids.detail],
			container: container,
			source: content,
			label: ""
		}));


		//oncontextmenu
		toggleControl(tag("span", {
			innerHTML: " ["+ source[ids.ownSize] + "]",
			className: "membrane-toggle membrane-protocol-record-content",
		},d.container), def(d, {
			parent: d.container[ids.detail],
			container: "ul",
			source: source[ids.owns]
		}));
		d.container.appendChild(d.container[ids.detail]);
	}
	d.container.className="membrane-protocol-record";
}
function toggleControl(node, settings){
	if(!Array.isArray(settings.parent[ids.control])) settings.parent[ids.control] = [];
	settings.parent[ids.control].push(node);
	node[ids.controlset]={rendersets: settings};
	node[ids.controlset].activated=false;
	node.addEventListener("click", toggleControl.toggle);
	return node;
}

toggleControl.toggle = function toggle(e){
	e.preventDefault();
	if(!e.target[ids.controlset]) return false;
	var data = e.target[ids.controlset];
	data.rendersets.parent.innerHTML="";
	if(!data.activated){
		render(data.rendersets);
		data.rendersets.parent[ids.control].forEach(function(item){
			item[ids.controlset].activated=false;
		});
	}
	data.activated=!data.activated;
	return false;
}

document.addEventListener("DOMContentLoaded", function(){
	var prn = new Protocol({mode: "append", container: "log"});
	window.log = prn.out.bind(prn);            
});
} catch(err) {
console.error(err)
}
})();