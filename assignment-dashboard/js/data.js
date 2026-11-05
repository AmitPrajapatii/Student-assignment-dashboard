/* Seed data: 2 admins, 5 students, 4 assignments, a few submissions. */
function seed(){
  var users=[
    {id:"a1",name:"Prof. Rao",role:"admin"},
    {id:"a2",name:"Prof. Mehta",role:"admin"},
    {id:"s1",name:"Aarav Sharma",role:"student"},
    {id:"s2",name:"Diya Verma",role:"student"},
    {id:"s3",name:"Kabir Singh",role:"student"},
    {id:"s4",name:"Meera Iyer",role:"student"},
    {id:"s5",name:"Rohan Gupta",role:"student"}
  ];
  function d(n){var x=new Date();x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)}
  var as=[
    {id:"x1",adminId:"a1",title:"Data Structures Problem Set",desc:"Solve problems 1–10 on trees and graphs.",due:d(5),link:"https://drive.google.com/drive/folders/ds-pset",assignees:"all"},
    {id:"x2",adminId:"a1",title:"Algorithms Lab Report",desc:"Write up your sorting benchmark results.",due:d(-1),link:"https://drive.google.com/drive/folders/algo-lab",assignees:["s1","s2","s3"]},
    {id:"x3",adminId:"a2",title:"Database Design Project",desc:"Submit your ER diagram and schema.",due:d(10),link:"https://drive.google.com/drive/folders/db-proj",assignees:"all"},
    {id:"x4",adminId:"a1",title:"Operating Systems Essay",desc:"1500 words on process scheduling.",due:d(14),link:"https://drive.google.com/drive/folders/os-essay",assignees:["s4","s5","s1"]}
  ];
  return{users:users,assignments:as,subs:{"x1":{s1:1,s2:1},"x2":{s1:1}}};
}
