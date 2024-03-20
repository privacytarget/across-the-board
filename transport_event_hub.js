/*! $FileVersion=1.1.522 */ var transport_event_hub_fileVersion = "1.1.522"; 
function CreateEventHubTransport(){LoadScript("sha256.js");function a(){this._apiVersion=null;this._servicebusNamespace=null;this._eventHubPath=null;this._sharedAccessKey=null;this._sharedAccessName=null;this._sharedAccessToken=null;this._tokenCreationTime=null;this._timeout=60;this._url="https://{servicebusNamespace}.servicebus.windows.net/{eventHubPath}/messages?timeout={timeout}&api-version={apiVersion}"}a.prototype=ModuleManager.create("rest_transport");a.prototype.constructor=a;a.prototype._setup=function(){this._apiVersion=this._config.apiVersion;if(!this._apiVersion){logError("Event_Hub_Transport:: Initialize Invalid (unspecified) _apiVersion");return false}this._servicebusNamespace=this._config.servicebusNamespace;if(!this._servicebusNamespace){logError("Event_Hub_Transport:: Initialize Invalid (unspecified) _servicebusNamespace");return false}this._eventHubPath=this._config.eventHubPath;if(!this._eventHubPath){logError("Event_Hub_Transport:: Initialize Invalid (unspecified) _eventHubPath");return false}this._sharedAccessKey=this._config.sharedAccessKey;if(!this._sharedAccessKey){logError("Event_Hub_Transport:: Initialize Invalid (unspecified) sharedAccessKey");return false}this._sharedAccessName=this._config.sharedAccessName;if(!this._sharedAccessName){logError("Event_Hub_Transport:: Initialize Invalid (unspecified) sharedAccessName");return false}this._tokenRefreshTime=this._config.tokenRefreshTime;if(!this._tokenRefreshTime){this._tokenRefreshTime=1}this._updateURL("{servicebusNamespace}",this._servicebusNamespace);this._updateURL("{eventHubPath}",this._eventHubPath);this._updateURL("{timeout}",this._timeout);this._updateURL("{apiVersion}",this._apiVersion);this._createRESTclientPlugin();if(this.GetVersion()&&(this.GetVersion()!="1")&&(this.GetVersion()!="2")){this._usingRESTclientPlugin=true;logInformation("Calling parent class to setup using the restful plugin");this._plugin.SetHttpMode("POST");var c=getSystemPlugin();this._plugin.SetAgentName("McAfee EventHub transmitter_"+c.CreateGUID());this._plugin.Connect(this._url)}else{this._plugin=null}return true};a.prototype._updateURL=function(c,d){this._url=updateStringWithReplacement(this._url,c,d)};a.prototype._sendUsingRestClient=function(f){try{var d=this._Send(f);var c=JSON.parse(d);if(!c){logError("Event_Hub_Transport::_sendUsingRestClient: Unable to parse result from transmission");return null}return c.statusCode}catch(g){logError("Event_Hub_Transport::_sendUsingRestClient: Exception caught with message: "+g.message)}};a.prototype._sendUsingXmlHttp=function(f){var d;try{var g=ModuleManager.create("xmlHttpComObj");if(!g.setup()){logError("Event_Hub_Transport::_sendUsingXmlHttp: couldnt create a xmlHttpCom");return null}d=g.getSelectedObjName();logInformation("Event_Hub_Transport::_sendUsingXmlHttp: Using "+d);g.open("POST",this._url,false);for(var i in this._requestHeaders){g.setRequestHeader(i,this._requestHeaders[i])}g.send(f);var k=g.getResponseHeader("Content-Type");var c=k.match("application/xml")?true:false;if(true===c){return"201"}var h="";try{h=g.getAllResponseHeaders();h=h.split("\r").join(" ");h=h.split("\n").join(" ")}catch(j){}this._reportExceptionTelemetry(d,"ResponseHeader:"+h,f);return null}catch(j){logError("Event_Hub_Transport::_sendUsingXmlHttp: Using COM obj ("+d+"). Exception caught with message: "+j.message);this._reportExceptionTelemetry(d,"ErrorMsg: "+j.message,f);return null}};a.prototype._sendUsingCommonHttpClient=function(c){try{var d=sendRequestInJSRT(this._url,this._requestHeaders,c);if(d===201){return d}else{logError("Event_Hub_Transport::_sendUsingCommonHttpClient: request failed with "+d+"status code");return null}}catch(f){logError("Event_Hub_Transport::_sendUsingCommonHttpClient. Exception caught with message: "+f.message);return null}};a.prototype._reportExceptionTelemetry=function(i,j,d){try{var c=ModuleManager.getSingleton("data_collector");if(!c.get("Device.Network.Connected")){logNormal("_reportExceptionTelemetry: No connection availble. Will not send");return}if(getScriptVariableStore().Get("sent.analytics_event_hub_transport_error")){return}getScriptVariableStore().Set("sent.analytics_event_hub_transport_error",true);var k=JSON.parse(d);var h=k.hit_uniqueid;var f={UniqueIdentifier:"analytics_event_hub_transport_error",type:"event",payload:{"Tracker.Type":"event",hit_category_0:"Analytics.Content",hit_category_1:"Exception",hit_action:"EventHub.Send.Fail",hit_label_0:i,hit_result:j,hit_label_1:h}};logNormal("Sending analytics_event_hub_transport_error event");var l=ModuleManager.getSingleton("event_handler");l.handleV1Record(f)}catch(g){logError("Event_Hub_Transport::_reportExceptionTelemetry: Exception caught with message"+g.message)}};a.prototype.Send=function(h){try{var g=sanitizeJSONData(h);var i=ModuleManager.getSingleton("mappings");var m=i._map(this._dictionary,g,false);var d=JSON.stringify(this._appendDottedKeys(m));logDebug("Event_Hub_Transport::Send: Sending using uri ("+this._url+")");var l=false;var c=0;var f=this._createSharedAccessToken(this._url,this._sharedAccessName,this._sharedAccessKey);this._AddRequestHeader("Content-Type","application/atom+xml;type=entry;charset=utf-8");this._AddRequestHeader("Authorization",f);this._AddRequestHeader("Host",this._servicebusNamespace+".servicebus.windows.net");if(this._usingRESTclientPlugin){c=this._sendUsingRestClient(d)}else{if(enableAnalyticsSDKForUWP){c=this._sendUsingCommonHttpClient(d)}else{c=this._sendUsingXmlHttp(d)}}logInformation("sendStatusCode: "+c);l=(c=="201")?true:false;if(!l){logError("Event_Hub_Transport.Send: Failed to send. Send status code: "+c)}var j=g.hit_event_id;if(this._usingRESTclientPlugin){this._transportLog(j,d,l)}else{this._transportLog(j,d,l,this.GetName()+"_xmlhttp")}return l}catch(k){logError("Event_Hub_Transport::Send: Exception caught when sending to ("+this._url+") with message: "+k.message);return false}};a.prototype._appendDottedKeys=function(e){var f=["csp_clientid","event_category","event_action","event_label","engagement_interactive","engagement_userinitiated","hit_type","hit_uniqueid","hit_severity","hit_label_1","hit_label_2","device_antimalware_provider_enabled","device_os_type","wss_istrial"];for(var d in f){var c=f[d];if(c in e){e[c.replace(/_/g,".")]=e[c]}}return e};a.prototype._createSharedAccessTokenParameters=function(h,j,o){try{if(!h||!j||!o){logError("Event_Hub_Transport::_createSharedAccessToken: Missing required parameter");return null}var m=encodeURIComponent(h);var d=new Date();var c=60*60*24*7;var f=Math.round(d.getTime()/1000)+c;var i=m+"\n"+f;var k=new jsSHA("SHA-256","TEXT");k.setHMACKey(o,"TEXT");k.update(i);var l=k.getHMAC("B64");var g={sr:m,sig:encodeURIComponent(l),se:f,skn:j};return g}catch(n){logError("Event_Hub_Transport::_createSharedAccessToken: Exception with message: "+n.message);return null}};a.prototype._tokenExpired=function(){try{if(!this._tokenCreationTime){return true}var d=new Date();var c=Math.abs(d-this._tokenCreationTime)/3600000;if(c>=this._tokenRefreshTime){this._tokenCreationTime=null;return true}}catch(f){logError("Event_Hub_Transport::_tokenExpired Exception caught with message: "+f.message)}return false};a.prototype._createSharedAccessToken=function(d,f,c){try{if(this._sharedAccessToken&&!this._tokenExpired()){return this._sharedAccessToken}logInformation("Event_Hub_Transport::_createSharedAccessToken: Shared access token expired or not availble. Recreating.");this._tokenCreationTime=new Date();var h=this._createSharedAccessTokenParameters(d,f,c);if(!h){logError("Event_Hub_Transport::_createSharedAccessToken creating token parameters failed");return null}this._sharedAccessToken="SharedAccessSignature sr="+h.sr+"&sig="+h.sig+"&se="+h.se+"&skn="+h.skn;return this._sharedAccessToken}catch(g){logError("Event_Hub_Transport::_createSharedAccessToken: Exception with message: "+g.message);return null}};var b=new a();return b}ModuleManager.registerFactory("transport_event_hub",CreateEventHubTransport);
//4E0231BFF326BF4ACD9B033821F1BA1E8FD37F8636A6A572BBD411F3C1423133425D9559B25499F659B6E1AC3E965C0E6729724CC59E09BF1173A6802864E705++