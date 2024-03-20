/*! $FileVersion=1.1.522 */ var error_transmitter_fileVersion = "1.1.522"; 
function CreateAnalyticsErrorTransmitter(){function a(){this.setup()}a.prototype=ModuleManager.create("transmitter_template");a.prototype.messageName="analytics_event_error_occurrred";a.prototype.setup=function(){var c=ModuleManager.getSingleton("config_manager");var d=c.getProfileNames(this.messageName);if(!this.emitter&&d){this.profileName=d[0];this.emitter=this.retrieveEmitter(this.profileName)}};a.prototype._generate=function(c,e){var f={hit_event_id:this.messageName,hit_category_0:"Analytics.Event.Error",hit_trigger:c,hit_action:"Analytics.Event.Rule.Failed"};if(findObjectSize(e.type["ruleMismatch"])){f.hit_category_1="ruleMismatch";f.hit_label_0=JSON.stringify(e)}else{if(findObjectSize(e.type["ruleError"])){f.hit_category_1="ruleError";f.hit_label_0=JSON.stringify(e)}else{if(e.type["rejected"]){f.hit_category_1="rejected";f.hit_label_0=JSON.stringify(e)}}}var d=new Date();f["__record.created"]=d.toISOString();f["Tracker.Type"]="event";return f};a.prototype.transmit=function(n,h){logDebug("CreateAnalyticsErrorlogTransport.transmit message="+JSON.stringify(h)+", profileNames="+JSON.stringify(this.profileName));if(this._isEventThrottled(this.messageName)){logDebug("Event "+this.messageName+" was event-level throttled");return}try{if(this._isProfileThrottled(this.messageName,this.profileName)){logDebug("Event "+this.messageName+" was profile-level throttled by '"+this.profileName+"'");return}if(!this.emitter){logWarning("Failed to locate an emitter for '("+this.profileName+","+this.messageName+")'; aborting send");return}var j=this._generate(n,h);var g=ModuleManager.getSingleton("mappings");j=g.toLowerCase(j,true,false);j=this._applyAttributeRules(j,this.messageName,this.profileName);var l=ModuleManager.getSingleton("rules");var d=l.getDailyMaxTableCounter(this.profileName);j["__event.day.index"]=d;j.__throttle_user_multiplier=this.emitter.throttleMultiplier?this.emitter.throttleMultiplier:1;this.addDataSetNames(j,this.emitter,null);var m=new Date();var f=unescape(j["__record.created"]);f=f.split(" ").join("T");var c=isoDateToDate(f);if(m&&c){var k=(m-c);j["__queue.time.milliseconds"]=(k>0)?String(k):"0"}logDebug("ready to send "+JSON.stringify(j));var o=this.emitter.send(j);logDebug("ProfileName:"+this.profileName+". Result: "+o);logDebug("******************************* done")}catch(i){logError("Failed to send mesage to '"+this.profileName+"': exception is '"+i.message+"'")}};var b=new a();return b}ModuleManager.registerFactory("error_transmitter",CreateAnalyticsErrorTransmitter);
//3F76C4EE6FF66A44774BF6EE9038133ECCA37A175A38534D501F7D663D75358E1FC7D51F4BC9EE25D77D7EC2C45E98216203F25EF185DB31C77692ECBBCFB272++