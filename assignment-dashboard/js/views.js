/* Rendering: login, student view, admin view, dialogs and the assignment form. */
function render(){
  var app=$("#app"),hd=$("#hd");
  if(busy){hd.innerHTML="";app.innerHTML='<div class="load"><div class="spin"></div>Loading your dashboard…</div>';return}
  if(fail){hd.innerHTML="";app.innerHTML='<div class="err card"><b>Something went wrong</b><p>'+esc(fail)+'</p><button class="p" id="retry">Retry</button> <button id="reset">Reset data</button></div>';return}
  if(!ME){hd.innerHTML="";app.innerHTML=loginView();return}
  hd.innerHTML='<span class="sm mu">'+esc(ME.name)+" · "+ME.role+'</span><button data-act="logout">Switch user</button>';
  app.innerHTML=ME.role==="student"?studentView():adminView();
}

function loginView(){
  function btn(u){return '<button class="who" data-act="login" data-id="'+u.id+'"><b>'+esc(u.name)+'</b><span class="sm mu">'+(u.role==="admin"?"Admin (Professor)":"Student")+'</span></button>'}
  return '<h2>Welcome</h2><p class="mu">Pick a demo user to sign in. No password needed.</p><h3>Admins</h3><div class="grid">'+S.users.filter(function(u){return u.role==="admin"}).map(btn).join("")+'</div><h3>Students</h3><div class="grid">'+students().map(btn).join("")+'</div>';
}

function studentView(){
  var mine=S.assignments.filter(function(a){return assignees(a).some(function(s){return s.id===ME.id})});
  var n=mine.filter(function(a){return done(a,ME.id)}).length,pct=mine.length?Math.round(n/mine.length*100):0;
  var h='<h2>My assignments</h2><div class="card"><div class="row sp"><b>'+n+' of '+mine.length+' submitted</b><span class="mu sm">'+pct+'%</span></div><div class="bar" style="margin-top:8px"><i style="width:'+pct+'%"></i></div></div>';
  if(!mine.length)return h+'<div class="empty card">🎉 No assignments yet. Check back later.</div>';
  mine.sort(function(a,b){return a.due<b.due?-1:1});
  return h+mine.map(function(a){
    var ok=done(a,ME.id),late=!ok&&a.due<today();
    return '<div class="card"><div class="row sp"><b>'+esc(a.title)+'</b><span class="badge '+(ok?"ok":late?"er":"")+'">'+(ok?"Submitted":late?"Overdue":"Not submitted")+'</span></div><p class="mu" style="margin:6px 0">'+esc(a.desc)+'</p><div class="sm mu">Due '+fmt(a.due)+'</div><div class="row stk" style="margin-top:12px"><a class="btn" href="'+esc(a.link)+'" target="_blank" rel="noopener">Open Drive link ↗</a>'+(ok?'':'<button class="p" data-act="submit" data-id="'+a.id+'">Mark as submitted</button>')+'</div></div>';
  }).join("");
}

function adminView(){
  var mine=S.assignments.filter(function(a){return a.adminId===ME.id});
  var h='<div class="row sp"><h2>My assignments</h2><button class="p" data-act="new">+ New assignment</button></div>';
  if(!mine.length)return h+'<div class="empty card">No assignments yet. Create your first one.</div>';
  return h+mine.map(function(a){
    var st=assignees(a),n=st.filter(function(s){return done(a,s.id)}).length,pct=st.length?Math.round(n/st.length*100):0;
    return '<div class="card"><div class="row sp"><b>'+esc(a.title)+'</b><span class="row"><button data-act="edit" data-id="'+a.id+'">Edit</button><button class="d" data-act="del" data-id="'+a.id+'">Delete</button></span></div><p class="mu" style="margin:6px 0">'+esc(a.desc)+'</p><div class="sm mu">Due '+fmt(a.due)+' · '+(a.assignees==="all"?"All students":st.length+" selected")+' · <a href="'+esc(a.link)+'" target="_blank" rel="noopener">Drive link ↗</a></div><div class="row sp" style="margin-top:12px"><span class="sm"><b>'+n+' of '+st.length+'</b> submitted</span><span class="sm mu">'+pct+'% complete</span></div><div class="bar" style="margin-top:6px"><i style="width:'+pct+'%"></i></div><div class="chips">'+(st.length?st.map(function(s){var k=done(a,s.id);return '<span class="chip '+(k?"ok":"")+'">'+(k?"✓ ":"✗ ")+esc(s.name)+'</span>'}).join(""):'<span class="sm mu">No students assigned.</span>')+'</div></div>';
  }).join("");
}

function openDlg(h){$("#dlg").innerHTML=h;if(!$("#dlg").open)$("#dlg").showModal()}
function closeDlg(){$("#dlg").close();dlgState=null}

function form(a){
  a=a||{title:"",desc:"",due:"",link:"",assignees:"all"};
  var all=a.assignees==="all";
  return '<form id="af"><h3 style="margin:0">'+(a.id?"Edit":"New")+' assignment</h3><label>Title</label><input type="text" name="title" value="'+esc(a.title)+'" required><label>Description</label><textarea name="desc" rows="3">'+esc(a.desc)+'</textarea><label>Due date</label><input type="date" name="due" value="'+esc(a.due)+'" required><label>Drive link</label><input type="url" name="link" placeholder="https://drive.google.com/…" value="'+esc(a.link)+'" required><label>Assign to</label><label class="chk"><input type="checkbox" name="all" '+(all?"checked":"")+'> All students</label><div id="sel" style="padding-left:20px;'+(all?"display:none":"")+'">'+students().map(function(s){return '<label class="chk"><input type="checkbox" name="st" value="'+s.id+'" '+(!all&&a.assignees.indexOf(s.id)>-1?"checked":"")+'> '+esc(s.name)+'</label>'}).join("")+'</div><div class="ferr" id="fe"></div><div class="row" style="justify-content:flex-end;margin-top:16px"><button type="button" data-act="close">Cancel</button><button class="p" type="submit">Save</button></div><input type="hidden" name="id" value="'+(a.id||"")+'"></form>';
}
