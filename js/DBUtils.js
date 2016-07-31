var DbTableConfig = {
    dbStructure: {
    	PushMessage:{
    		id:"TEXT",
    		eventId:"TEXT",
    		title:"TEXT",
    		type:"TEXT",
    		content:"TEXT",
    		status:"TEXT",
    		processAction:"TEXT",
    		messageNo:"TEXT",
    		messageLevel:"TEXT",
    		createTime:"TEXT"
    	}
    },
    dao:{
    	addPushMessage:{
    		sql:"INSERT INTO PushMessage (id,eventId,title,type,content,status,processAction,messageNo,messageLevel,createTime) values (?,?,?,?,?,?,?,?,?,?)",
    		args:["id","eventId","title","type","content","status","processAction","messageNo","messageLevel","createTime"]
    	},
    	updatePushMessageStatus:{
    		sql:"UPDATE PushMessage SET status=? where id=?",
    		args:["status","id"]
    	},
    	updatePushMessageAllStatus:{
    		sql:"UPDATE PushMessage SET status=? where type=?",
    		args:["status","type"]
    	},
    	deletePushMessage:{
    		sql:"delete from PushMessage",
    		args:[]
    	},
    	selectPushMsgByType:{
    		sql:"select id,eventId,title,type,content,status,processAction,messageNo,messageLevel,createTime from PushMessage where 1=1 and type=? and status=0 order by createTime desc",
    		args:["type"]
    	},
    	selectPushMsgByStatus:{
    		sql:"select id,eventId,title,type,content,status,processAction,messageNo,messageLevel,createTime from PushMessage where 1=1 and status=? order by createTime desc",
    		args:["status"]
    	}
    }
 };
		
var websql = (function(document, undefined) {
	

	var $ = function(selector, context) {
		context = context || document;
		if (typeof selector === 'function')
			return $.ready(selector);
	};
	
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	$.dbConfig={
			dbName:"parkApp",
			dbVersion:"1.01",
			dbDesc:"园区管理APP数据库",
			dbSize:5*1024*1024
	}
	
	
	$.dbSession=null;
	
	$.uuid = function (len, radix) {
	    var chars = CHARS, uuid = [], i;
	    radix = radix || chars.length;
	
	    if (len) {
	      // Compact form
	      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	    } else {
	      // rfc4122, version 4 form
	      var r;
	
	      // rfc4122 requires these characters
	      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	      uuid[14] = '4';
	
	      // Fill in random data.  At i==19 set the high bits of clock sequence as
	      // per rfc4122, sec. 4.1.5
	      for (i = 0; i < 36; i++) {
	        if (!uuid[i]) {
	          r = 0 | Math.random()*16;
	          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
	        }
	      }
	    }
	
	    return uuid.join('');
  	};
  	var class2type = {}; 
	$.type = function(obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	};
	
	$.isObject = function(obj) {
		return $.type(obj) === "object";
	};
	
	$.isEmptyObject = function(o) {
		for (var p in o) {
			if (p !== undefined) {
				return false;
			}
		}
		return true;
	};
	
	$.now = Date.now || function() {
		return +new Date();
	};
	
	$.argToArr=function (opt, arg) {
		var arrArgs = [];
		for (var i = 0; i < arg.length; i++) {
			var argument = opt[arg[i]] == undefined ? null : opt[arg[i]];
			arrArgs.push(argument);
		}
		return arrArgs;
	};

	$.clone = function(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
		    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	};
	
	if (window.JSON) {
		$.parseJSON = JSON.parse;
	}
	
	return $;
	
})(document);

(function($,window){
	
	$.emptyPushMessage=function(callback){
		this.exec(DbTableConfig.dao.deletePushMessage,{},callback);
	};
	
	$.insertPushMessage=function(options,callback){
		if(!this.isEmptyObject(options)){
			options.id=this.uuid();
			options.createTime=this.now();
			this.exec(DbTableConfig.dao.addPushMessage,options,callback);
		}		
	};
	$.updatePushMessageStatus=function(options,callback){
		if(!this.isEmptyObject(options)){
			this.exec(DbTableConfig.dao.updatePushMessageStatus,options,callback);
		}		
	};
	$.updatePushMessageAllStatus=function(options,callback){
		if(!this.isEmptyObject(options)){
			this.exec(DbTableConfig.dao.updatePushMessageAllStatus,options,callback);
		}		
	};
	$.selectPushMsgByType=function(options,callback){
		this.exec(DbTableConfig.dao.selectPushMsgByType,options,callback);		
	};
	
	$.selectPushMsgByStatus=function(options,callback){
		this.exec(DbTableConfig.dao.selectPushMsgByStatus,options,callback);
	}
	
	
	//openDatabase中五个参数分别为：数据库名、版本号、描述、数据库大小、创建回调;
	$.OpenDbase = function(){
		var size=5* 1024 * 1024;
		if(this.isEmptyObject(this.dbConfig.dbName)){
			return;
		}
		if(this.isEmptyObject(this.dbConfig.dbVersion)){
			return;
		}
		if(!this.isEmptyObject(this.dbConfig.dbSize)){
			size=this.dbConfig.dbSize;
		}
		try {
			var db = openDatabase(this.dbConfig.dbName, this.dbConfig.dbVersion, this.dbConfig.dbDesc, size);
			$.dbSession=db;
			this.InitDataBase(db);

		}catch (e) {
			console.log(e)
		}
	};
	
	$.InitDataBase=function(db){
		var localDBVersion = window.localStorage.getItem("parkApp_database_version");
		if(localDBVersion == "" || localDBVersion == undefined || localDBVersion < this.dbConfig.dbVersion) {
			for (var i in DbTableConfig.dbStructure) {
				this.deleteTable(i, DbTableConfig.dbStructure[i]);
			}
		} 

		window.localStorage.setItem("parkApp_database_version", this.dbConfig.dbVersion);
		
		for (var i in DbTableConfig.dbStructure) {
			this.creatTable(i, DbTableConfig.dbStructure[i]);
		}
	};		
	
	$.deleteTable=function(name,structure){
		this.execSql(
			"DROP TABLE IF EXISTS " + name, [],
			function(tx, result) {
				console.log('刪除' + name + '表成功');
			},
			function(tx, error) {
				console.log('刪除' + name + '表失败:' + error.message);
			});
	}		
	
	$.creatTable=function (name, structure) {
		var _this=this;
		console.log(name,structure);
		this.execSql(
			"create table if not exists " + name + " (" + _this.getFields(structure) + ")",
			[],function (tx, result) {
				console.log('创建' + name + '表成功');
			},function (tx, error) {
				console.log('创建' + name + '表失败:' + error.message);
			});
	};
	
	$.getFields=function (opt) {
		var t = "";
		for (i in opt) {
			t = t + i + " " + opt[i] + ",";
		}
		return t.substr(0, t.length - 1)
	};
	
	$.exec=function(operation,opt, scb){
		
		if(operation == undefined) {
			_this.onSqlComplete({ error: 1, data: "no operation" }, scb);
		}
						
		var _this = this;
		
		try {
			this.execSql(operation.sql, this.argToArr(opt, operation.args), function (tx, result) {
				var data = [];
					for (var i = 0; i < result.rows.length; ++i) {
						data.push(_this.clone(result.rows.item(i)));
					}
						_this.onSqlComplete({ error: 0, data: data }, scb);
				},
				function (tx, error) {
						_this.onSqlComplete({ error: 1, data: error }, scb);
				});
		} catch (e) {
			console.log(e.message);
		}
	};
	
	$.onSqlComplete= function (ret, cb) {
		if (ret.error == 0) {
			cb({ result: 0, responseData: ret.data });
		} else {
			cb({ result: 1, responseData : ret.data });
		}
	};
			
	$.execSql=function(sql, arr, scb, fcb){
		if($.dbSession==undefined && $.dbSession==null){
			this.OpenDbase();
		}
		$.dbSession.transaction(function(tx){
				tx.executeSql(sql,arr,scb, fcb);
		});
	};
	
})(websql,window)