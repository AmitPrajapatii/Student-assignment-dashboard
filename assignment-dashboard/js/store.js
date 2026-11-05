/* State, localStorage persistence and small helpers. */
var KEY="sad_v1",SK="sad_session";
var S=null,ME=null,busy=true,fail=null,dlgState=null;

var $=function(s){return document.querySelector(s)};
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

function load(){
  var raw=localStorage.getItem(KEY);
  if(!raw){S=seed();save();}
  else{S=JSON.parse(raw);if(!S||!S.users)throw new Error("Saved data is corrupted.");}
  var sid=null;try{sid=localStorage.getItem(SK)}catch(e){}
  ME=S.users.filter(function(u){return u.id===sid})[0]||null;
}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function persist(){
  try{save();return true}
  catch(e){alert("Could not save changes. Your browser storage may be full or blocked.");return false}
}

function students(){return S.users.filter(function(u){return u.role==="student"})}
function assignees(a){return a.assignees==="all"?students():students().filter(function(s){return a.assignees.indexOf(s.id)>-1})}
function done(a,sid){return !!(S.subs[a.id]&&S.subs[a.id][sid])}
function fmt(d){var x=new Date(d+"T00:00:00");return x.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}
function today(){return new Date().toISOString().slice(0,10)}
