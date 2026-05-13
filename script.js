const SHEET_URL =
"https://opensheet.elk.sh/1aSUuu6gcnZNdYwli17DhEdjfIO_y0lag0KhhuTHo3Bg/Sheet1";

let allData = [];
let collegeSearch;

/* =========================
ELEMENTS
========================= */

const classSelect =
document.getElementById("classSelect");

const subjectSelect =
document.getElementById("subjectSelect");

const subjectCodeSelect =
document.getElementById("subjectCodeSelect");

const collegeSelect =
document.getElementById("collegeSelect");

const resultDiv =
document.getElementById("result");

const loader =
document.getElementById("loader");

const searchBtn =
document.getElementById("searchBtn");

/* =========================
LOAD DATA
========================= */

async function loadData(){

loader.innerHTML =
`
<div class="loader-spinner"></div>
`;

try{

const response =
await fetch(SHEET_URL);

const data =
await response.json();

allData = data.map(item => ({

Class:
(item.Class || "").trim(),

Subject:
(item.Subject || "").trim(),

SubjectCode:
(item.SubjectCode || "").trim(),

College:
(item.College || "").trim(),

VivaCenter:
(item.VivaCenter || "").trim(),

VivaDate:
(item.VivaDate || "").trim(),

ReportingTime:
(item.ReportingTime || "").trim(),

NoticeLink:
(item.NoticeLink || "").trim(),

Status:
(item.Status || "").trim()

}));

loadClasses();

loadUpcomingAlerts();

loader.innerHTML = "";

}
catch(error){

console.log(error);

loader.innerHTML =
`
<div class="pending-box">

<h3>
❌ Data Load Failed
</h3>

<p>
Google Sheet connect नहीं हो पा रही।
</p>

</div>
`;

}

}

/* =========================
LOAD CLASSES
========================= */

function loadClasses(){

const classes =
[
...new Set(

allData
.map(item => item.Class)
.filter(Boolean)

)
];

classSelect.innerHTML =
`
<option value="">
कोर्स चुनें (Select Course)
</option>
`;

classes.forEach(item => {

classSelect.innerHTML +=
`
<option value="${item}">
${item}
</option>
`;

});

}

/* =========================
CLASS CHANGE
========================= */

classSelect.addEventListener(
'change',
function(){

subjectSelect.innerHTML =
`
<option value="">
विषय चुनें (Select Subject)
</option>
`;

subjectCodeSelect.innerHTML =
`
<option value="">
विषय कोड चुनें (Select Subject Code)
</option>
`;

collegeSelect.innerHTML =
`
<option value="">
अपना कॉलेज चुनें (Select College)
</option>
`;

if(collegeSearch){
collegeSearch.destroy();
}

const subjects =
[
...new Set(

allData
.filter(item =>

item.Class === this.value

)

.map(item => item.Subject)
.filter(Boolean)

)
];

subjects.forEach(subject => {

subjectSelect.innerHTML +=
`
<option value="${subject}">
${subject}
</option>
`;

});

checkFormComplete();

}
);

/* =========================
SUBJECT CHANGE
========================= */

subjectSelect.addEventListener(
'change',
function(){

subjectCodeSelect.innerHTML =
`
<option value="">
विषय कोड चुनें (Select Subject Code)
</option>
`;

collegeSelect.innerHTML =
`
<option value="">
अपना कॉलेज चुनें (Select College)
</option>
`;

if(collegeSearch){
collegeSearch.destroy();
}

const subjectCodes =
[
...new Set(

allData
.filter(item =>

item.Class === classSelect.value &&
item.Subject === this.value

)

.map(item => item.SubjectCode)
.filter(Boolean)

)
];

subjectCodes.forEach(code => {

subjectCodeSelect.innerHTML +=
`
<option value="${code}">
${code}
</option>
`;

});

checkFormComplete();

}
);

/* =========================
SUBJECT CODE CHANGE
========================= */

subjectCodeSelect.addEventListener(
'change',
function(){

collegeSelect.innerHTML =
`
<option value="">
अपना कॉलेज चुनें (Select College)
</option>
`;

if(collegeSearch){
collegeSearch.destroy();
}

const colleges =
[
...new Set(

allData
.filter(item =>

item.Class === classSelect.value &&
item.Subject === subjectSelect.value &&
item.SubjectCode === this.value

)

.map(item => item.College)
.filter(Boolean)

)
];

colleges.forEach(college => {

collegeSelect.innerHTML +=
`
<option value="${college}">
${college}
</option>
`;

});

collegeSearch =
new TomSelect(
"#collegeSelect",
{
create:false,
sortField:{
field:"text",
direction:"asc"
},
placeholder:
"College Search करें"
}
);

checkFormComplete();

}
);

/* =========================
COLLEGE CHANGE
========================= */

collegeSelect.addEventListener(
'change',
checkFormComplete
);

/* =========================
CHECK FORM
========================= */

function checkFormComplete(){

if(

classSelect.value &&
subjectSelect.value &&
subjectCodeSelect.value &&
collegeSelect.value

){

searchBtn.disabled = false;

}
else{

searchBtn.disabled = true;

}

}

/* =========================
SEARCH
========================= */

searchBtn.addEventListener(
'click',
findCenter
);

function findCenter(){

const found =
allData.find(item =>

item.Class === classSelect.value &&
item.Subject === subjectSelect.value &&
item.SubjectCode === subjectCodeSelect.value &&
item.College === collegeSelect.value

);

if(!found){

resultDiv.innerHTML =
`
<div class="pending-box">

<h3>
❌ Record नहीं मिला
</h3>

</div>
`;

return;

}

let dateHTML = "";

if(
found.Status.toLowerCase() ===
'declared'
){

dateHTML =
`
<div class="result-box">

<h3>
📅 Viva Date
</h3>

<p>
${found.VivaDate}
</p>

${
found.NoticeLink

?

`
<a href="${found.NoticeLink}"
target="_blank"
class="notice-btn">

📄 Notice Download

</a>
`

:

''

}

</div>

<div class="result-box">

<h3>
⏰ Reporting Time
</h3>

<p>
${found.ReportingTime}
</p>

</div>
`;

}
else{

dateHTML =
`
<div class="pending-box">

<h3>
📢 Viva Date Update
</h3>

<p>
Viva date अभी घोषित नहीं हुई है।
Daily check करते रहें।
</p>

</div>
`;

}

resultDiv.innerHTML =
`
<div class="result-main">

<div class="result-box">

<h3>
🏫 Viva Center
</h3>

<p>
${found.VivaCenter}
</p>

</div>

${dateHTML}

</div>
`;

setTimeout(() => {

resultDiv.scrollIntoView({
behavior:'smooth'
});

}, 200);

}

/* =========================
DATE PARSER
========================= */

function parseCustomDate(dateString){

if(
!dateString ||
dateString.toLowerCase() ===
'pending'
){
return null;
}

const months = {

January:0,
February:1,
March:2,
April:3,
May:4,
June:5,
July:6,
August:7,
September:8,
October:9,
November:10,
December:11

};

const parts =
dateString.trim().split(' ');

if(parts.length !== 3){
return null;
}

return new Date(

parseInt(parts[2]),
months[parts[1]],
parseInt(parts[0])

);

}

/* =========================
UPCOMING VIVA ALERT
========================= */

function loadUpcomingAlerts(){

const alertContainer =
document.getElementById(
'upcomingAlerts'
);

const today =
new Date();

today.setHours(0,0,0,0);

const next5Days =
new Date(today);

next5Days.setDate(
today.getDate()+5
);

/* UNIQUE DATA */

const uniqueMap =
new Map();

allData.forEach(item => {

if(
!item.Status ||
item.Status.toLowerCase() !==
'declared'
){
return;
}

const vivaDate =
parseCustomDate(item.VivaDate);

if(!vivaDate){
return;
}

if(
vivaDate < today ||
vivaDate > next5Days
){
return;
}

const key =
`${item.VivaCenter}`;

if(!uniqueMap.has(key)){

uniqueMap.set(key,item);

}

});

const updates =
[...uniqueMap.values()];

/* NO DATA */

if(updates.length === 0){

alertContainer.innerHTML =
`
<div class="pending-box">

<h3>
📢 अगले 5 दिनों में कोई Viva Update नहीं है।
</h3>

</div>
`;

return;

}

/* CREATE SLIDER */

alertContainer.innerHTML =
`
<div class="alert-heading">

🔥 Upcoming Viva Alert

</div>

<div class="single-slider">

<div class="single-track"
id="singleTrack">

${updates.map(item => `

<div class="single-card">

<div class="single-title">
🏫 ${item.VivaCenter}
</div>

<div class="single-sub">

${item.Class}
${item.Subject}
• ${item.VivaDate}

</div>

</div>

`).join('')}

</div>

</div>

<div class="slider-dots">

${updates.map((_,index)=>`

<div class="slider-dot
${index===0?'active':''}"
data-index="${index}">

</div>

`).join('')}

</div>
`;

const track =
document.getElementById(
'singleTrack'
);

const dots =
document.querySelectorAll(
'.slider-dot'
);

let current = 0;

function showSlide(index){

track.style.transform =
`translateX(-${index*100}%)`;

dots.forEach(dot =>
dot.classList.remove('active')
);

dots[index].classList.add(
'active'
);

current = index;

}

/* AUTO SLIDE */

setInterval(()=>{

current++;

if(current >= updates.length){
current = 0;
}

showSlide(current);

},5000);

/* MANUAL */

dots.forEach(dot => {

dot.addEventListener(
'click',
()=>{

showSlide(
parseInt(dot.dataset.index)
);

}
);

});

}

/* =========================
VISITOR COUNTER
========================= */

async function updateVisitorCount(){

try{

const response =
await fetch(
'https://api.countapi.xyz/hit/universitygyaan/viva-center'
);

const data =
await response.json();

document.getElementById(
'visitorCount'
).innerHTML =
`👥 Total Visitors: ${data.value}`;

}
catch(err){

console.log(err);

}

}

/* =========================
ONLINE USERS
========================= */

function fakeOnlineUsers(){

const random =
Math.floor(Math.random()*20)+5;

document.getElementById(
'onlineUsers'
).innerHTML =
`🟢 Online Now: ${random}`;

}

/* =========================
START
========================= */

updateVisitorCount();

fakeOnlineUsers();

loadData();
