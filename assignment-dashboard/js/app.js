/* App entry: boot sequence and event handling (click, change, submit). */
function boot(){
  busy=true;fail=null;render();
  setTimeout(function(){
    try{load()}catch(e){fail=e.message||"Could not read saved data."}
    busy=false;render();
  },500);
}

document.addEventListener("click",function(e){
  if(e.target.id==="retry")return boot();
  if(e.target.id==="reset"){localStorage.removeItem(KEY);return boot()}
  var t=e.target.closest("[data-act]");if(!t)return;
  var act=t.dataset.act,id=t.dataset.id;

  if(act==="login"){ME=S.users.filter(function(u){return u.id===id})[0];try{localStorage.setItem(SK,id)}catch(x){}render()}
  else if(act==="logout"){ME=null;try{localStorage.removeItem(SK)}catch(x){}render()}
  else if(act==="close")closeDlg();

  /* Student: two-step submission */
  else if(act==="submit"){dlgState={id:id,step:1};openDlg('<h3 style="margin-top:0">Have you submitted?</h3><p class="mu">Please confirm you have uploaded your work to the Drive link for this assignment.</p><div class="row" style="justify-content:flex-end"><button data-act="close">Not yet</button><button class="p" data-act="step2">Yes, I have submitted</button></div>')}
  else if(act==="step2")openDlg('<h3 style="margin-top:0">Final confirmation</h3><p class="mu">This will mark the assignment as <b>Submitted</b>. This cannot be undone.</p><div class="row" style="justify-content:flex-end"><button data-act="close">Go back</button><button class="p" data-act="final">Confirm submission</button></div>');
  else if(act==="final"){var i=dlgState.id;S.subs[i]=S.subs[i]||{};S.subs[i][ME.id]=1;persist();closeDlg();render()}

  /* Admin: create, edit, delete */
  else if(act==="new")openDlg(form());
  else if(act==="edit")openDlg(form(S.assignments.filter(function(a){return a.id===id})[0]));
  else if(act==="del"){dlgState={id:id};openDlg('<h3 style="margin-top:0">Delete assignment?</h3><p class="mu">This removes the assignment and all submission records.</p><div class="row" style="justify-content:flex-end"><button data-act="close">Cancel</button><button class="p d" data-act="delok">Delete</button></div>')}
  else if(act==="delok"){S.assignments=S.assignments.filter(function(a){return a.id!==dlgState.id});delete S.subs[dlgState.id];persist();closeDlg();render()}
});

document.addEventListener("change",function(e){
  if(e.target.name==="all")$("#sel").style.display=e.target.checked?"none":"block";
});

document.addEventListener("submit",function(e){
  if(e.target.id!=="af")return;e.preventDefault();
  var f=e.target,v=function(n){return f.elements[n].value.trim()};
  var all=f.elements["all"].checked,sel=[].slice.call(f.querySelectorAll('[name=st]:checked')).map(function(x){return x.value});
  if(!v("title")){$("#fe").textContent="Title is required.";return}
  if(!all&&!sel.length){$("#fe").textContent="Select at least one student, or choose All students.";return}
  var id=v("id"),rec={title:v("title"),desc:v("desc"),due:v("due"),link:v("link"),assignees:all?"all":sel};
  if(id){var a=S.assignments.filter(function(x){return x.id===id})[0];Object.assign(a,rec)}
  else{rec.id="x"+Date.now();rec.adminId=ME.id;S.assignments.push(rec)}
  persist();closeDlg();render();
});

boot();
