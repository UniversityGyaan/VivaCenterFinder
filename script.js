const SHEET_URL =
"https://opensheet.elk.sh/1aSUuu6gcnZNdYwli17DhEdjfIO_y0lag0KhhuTHo3Bg/Sheet1";

let allData = [];
let collegeChoices;

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
CHOICES JS
========================= */

collegeChoices = new Choices(
'#collegeSelect',
{
searchEnabled:true,
itemSelectText:'',
shouldSort:false,
searchPlaceholderValue:'Search College'
}
);

/* =========================
LOAD DATA
========================= */

async function loadData(){

loader.innerHTML =
"डेटा लोड हो रहा है...";

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

Status:
(item.Status || "").trim()

}));

loadClasses();

loader.innerHTML = "";

}
catch(error){

console.log(error);

loader.innerHTML =
"❌ Data Load Failed";

}

}

/* =========================
LOAD CLASSES
========================= */

function loadClasses(){

const classes =
[...new Set(

allData
.map(item => item.Class)
.filter(Boolean)

)];

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

const selectedClass =
this.value.trim();

/* RESET */

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

collegeChoices.clearChoices();

/* SUBJECT FILTER */

const subjects =
[...new Set(

allData
.filter(item =>

item.Class === selectedClass

)

.map(item => item.Subject)
.filter(Boolean)

)];

subjects.forEach(subject => {

subjectSelect.innerHTML +=
`
<option value="${subject}">
${subject}
</option>
`;

});

}
);

/* =========================
SUBJECT CHANGE
========================= */

subjectSelect.addEventListener(
'change',
function(){

const selectedClass =
classSelect.value.trim();

const selectedSubject =
this.value.trim();

/* RESET */

subjectCodeSelect.innerHTML =
`
<option value="">
विषय कोड चुनें (Select Subject Code)
</option>
`;

collegeChoices.clearChoices();

/* SUBJECT CODE FILTER */

const subjectCodes =
[...new Set(

allData
.filter(item =>

item.Class === selectedClass &&
item.Subject === selectedSubject

)

.map(item => item.SubjectCode)
.filter(Boolean)

)];

subjectCodes.forEach(code => {

subjectCodeSelect.innerHTML +=
`
<option value="${code}">
${code}
</option>
`;

});

}
);

/* =========================
SUBJECT CODE CHANGE
========================= */

subjectCodeSelect.addEventListener(
'change',
function(){

const selectedClass =
classSelect.value.trim();

const selectedSubject =
subjectSelect.value.trim();

const selectedCode =
this.value.trim();

/* FILTER COLLEGES */

const colleges =
[...new Set(

allData
.filter(item =>

item.Class === selectedClass &&
item.Subject === selectedSubject &&
item.SubjectCode === selectedCode

)

.map(item => item.College)
.filter(Boolean)

)];

/* RESET CHOICES */

collegeChoices.clearChoices();

/* LOAD COLLEGES */

collegeChoices.setChoices(

colleges.map(college => ({

value:college,
label:college

})),

'value',
'label',
true

);

}
);

/* =========================
SEARCH BUTTON
========================= */

searchBtn.addEventListener(
'click',
findCenter
);

/* =========================
FIND CENTER
========================= */

function findCenter(){

const selectedClass =
classSelect.value.trim();

const selectedSubject =
subjectSelect.value.trim();

const selectedCode =
subjectCodeSelect.value.trim();

const selectedCollege =
collegeSelect.value.trim();

if(
!selectedClass ||
!selectedSubject ||
!selectedCode ||
!selectedCollege
){

resultDiv.innerHTML =
`
<div class="pending-box">

<h3>
⚠️ कृपया सभी विकल्प चुनें
</h3>

</div>
`;

return;

}

/* FIND RECORD */

const found =
allData.find(item =>

item.Class === selectedClass &&
item.Subject === selectedSubject &&
item.SubjectCode === selectedCode &&
item.College === selectedCollege

);

/* SHOW RESULT */

if(found){

let dateHTML = "";
let timeHTML = "";

if(
found.Status.toLowerCase() ===
"declared"
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

</div>
`;

timeHTML =
`
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
Viva date अभी  announce नहीं हुई है.
Daily check चेक करते रहें.
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

${timeHTML}

</div>
`;

/* AUTO SCROLL */

setTimeout(() => {

resultDiv.scrollIntoView({
behavior:'smooth'
});

}, 200);

}
else{

resultDiv.innerHTML =
`
<div class="pending-box">

<h3>
❌ No Record Found
</h3>

<p>
Please check details again.
</p>

</div>
`;

}

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