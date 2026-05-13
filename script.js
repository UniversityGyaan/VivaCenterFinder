const SHEET_URL =
if(upcomingData.length === 0){

alertContainer.innerHTML =
`<div class="pending-box">
<h3>📢 अगले 5 दिनों में कोई Viva Update नहीं है।</h3>
</div>`;

return;

}

upcomingData.forEach(item => {

alertContainer.innerHTML +=
`<div class="alert-card">

<h3>
🏫 Viva Centre: ${item.VivaCenter}
</h3>

<p>
${item.Subject} का Viva
दिनांक ${item.VivaDate}
को होगा।
</p>

${
item.NoticeLink
?
`<a href="${item.NoticeLink}"
target="_blank"
class="notice-btn">
📄 Notice Download
</a>`
:
''
}

</div>`;

});

}

async function updateVisitorCount(){

try{

const response = await fetch(
'https://api.countapi.xyz/hit/universitygyaan/viva-center'
);

const data = await response.json();

document.getElementById('visitorCount').innerHTML =
`👥 Total Visitors: ${data.value}`;

}catch(err){
console.log(err);
}

}

function fakeOnlineUsers(){

const random = Math.floor(Math.random()*20)+5;

document.getElementById('onlineUsers').innerHTML =
`🟢 Online Now: ${random}`;

}

updateVisitorCount();
fakeOnlineUsers();
loadData();