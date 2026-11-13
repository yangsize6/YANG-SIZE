const $=s=>document.querySelector(s);
const clubs=[
 {name:'INSIM',image:3,title:'The New Era',type:'Live Indonesian Band',detail:"Celebrate the vibrant sound of Indonesia with a live band performance of beloved Indonesian songs. From infectious rhythms to uplifting melodies, get ready to feel the energy, sing along, and enjoy a lively musical journey."},
 {name:'IMMIX',image:4,title:'Echoes of Heritage',type:'Multicultural Fusion Dance',detail:"A creative fusion of cultural influences, combining Western-inspired energy and Taiwanese elements through dynamic choreography."},
 {name:'CNN',image:5,title:'Tales of Chang’an',type:'Chinese Historical Musical & Traditional Dance',detail:"Journey into Tang Dynasty Chang'an, where a mystery unfolds at the Dali Temple through captivating storytelling and traditional Chinese dance."},
 {name:'MCSIM',image:6,title:'Igniting The Cosmos',type:'24 Festive Drums',detail:"Experience the powerful rhythms of Malaysia's 24 Festive Drums, bringing together synchronized movements, cultural spirit, and vibrant energy."},
 {name:'MYSIM',image:7,title:'LAMLIAN LEHLAM (Mystical Fusion of the Mizo Dance)',type:'Traditional Myanmar Dance',detail:"Celebrate Myanmar's cultural traditions through elegant movements, graceful choreography, and rhythmic storytelling."},
 {name:'SIS',image:8,title:'Ananta; Love Beyond Lifetimes',type:'An Indian Dance Story',detail:"A heartfelt performance inspired by the timeless love of the Sun and the Moon. Through graceful movement, powerful music, and expressive storytelling, Ananta brings a love that transcends lifetimes to the stage."},
 {name:'SKC',image:9,title:'Joseon Galaxy: A Journey to K-pop',type:'K-pop Dance',detail:"An energetic celebration of K-pop, featuring dynamic choreography, exciting rhythms, and modern Korean pop culture."},
 {name:'VNC',image:10,title:'The Tale of Kieu',type:'Traditional Vietnamese Dance',detail:"Discover the elegance of Vietnamese heritage through traditional dance, expressive movements, and cultural storytelling."}
];
const pages=[
 {name:'Cover',image:1},
 {name:'About ISN',image:2},
 ...clubs.map(club=>({name:club.name,image:club.image})),
 {name:'Performances',kind:'gallery'},
 {name:'Dinner',image:11},
 {name:'Behind the Scenes',image:12},
 ...[13,14,15,16,17,18,19,20].map((image,i)=>({name:`Interview · ${i+1}`,image})),
 {name:'Best Dressed',image:21},
 {name:'Feedback',image:22},
 {name:'Thank You',image:23}
];
const galleryIndex=pages.findIndex(p=>p.kind==='gallery');
const assetVersion='20261113-v6-performance-logos';

let page=0,selected=0,turn=0,swipeBlock=false,start=null,opener=null,turning=false;
clubs.forEach((club,i)=>{const b=document.createElement('button');b.className='performance';b.style.setProperty('--club-background',`url("assets/club-backgrounds/${club.name.toLowerCase()}.svg")`);b.innerHTML=`<span class="logo-frame"><img class="club-logo" src="assets/logos/${club.name.toLowerCase()}.svg" alt="" loading="eager"></span><span class="club">${club.name}</span><small>Explore performance</small>`;b.setAttribute('aria-label',`View ${club.name} performance`);b.onclick=()=>{if(swipeBlock)return;selected=i;turn=i;renderOrbit();showDetail(b)};$('#cards').appendChild(b)});
function renderOrbit(){[...$('#cards').children].forEach((b,i)=>{const angle=(i-turn)*2*Math.PI/clubs.length,z=Math.cos(angle),w=$('#paper').clientWidth;b.style.transform=`translateX(${Math.sin(angle)*w*.31}px) translateY(${-z*w*.02}px) rotateY(${-Math.sin(angle)*24}deg) rotateZ(${Math.sin(angle)*7}deg) scale(${.64+.36*(z+1)/2})`;b.style.zIndex=Math.round((z+1)*20);b.style.opacity=z<-.1?'0':String(.35+.65*z);b.style.pointerEvents=z<-.1?'none':'auto';b.disabled=z<-.1;b.setAttribute('aria-current',String(i===selected))});$('#selection').textContent=`${clubs[selected].name} · ${selected+1} / ${clubs.length}`;$('#open-detail').hidden=false;$('.hint').textContent='Swipe the cards · Tap to discover';}
function render(){const current=pages[page],isGallery=current.kind==='gallery';$('#page-image').hidden=isGallery;$('#gallery').hidden=!isGallery;$('#best-dressed-qr').hidden=current.image!==21;$('#feedback-qr').hidden=current.image!==22;if(!isGallery){$('#page-image').src=`assets/page-${current.image}.jpg?v=${assetVersion}`;$('#page-image').alt=`ISN booklet · ${current.name}`}$('#label').textContent=current.name;$('#count').textContent=`${String(page+1).padStart(2,'0')} / ${pages.length}`;$('#previous').disabled=page===0;$('#next').disabled=page===pages.length-1;document.querySelectorAll('[data-section]').forEach(b=>{const n=Number(b.dataset.section),end=Number(b.dataset.end??n);b.classList.toggle('active',page>=n&&page<=end)});if(isGallery)renderOrbit();$('#corner-prev').hidden=page===0;$('#corner-next').hidden=page===pages.length-1;}

function snapshot(){const copy=$('#sheet').cloneNode(true);copy.removeAttribute('id');copy.className='turn-content';copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));copy.setAttribute('aria-hidden','true');copy.inert=true;return copy}
async function go(n){const target=Math.max(0,Math.min(pages.length-1,n));if(target===page||turning)return;const direction=target>page?1:-1;
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!Element.prototype.animate){page=target;render();return}
turning=true;const paper=$('#paper'),leaf=document.createElement('div'),front=document.createElement('div'),back=document.createElement('div'),shade=document.createElement('div');
leaf.className='turn-leaf '+(direction>0?'leaf-next':'leaf-prev');leaf.setAttribute('aria-hidden','true');leaf.inert=true;front.className='leaf-face leaf-front';back.className='leaf-face leaf-back';shade.className='turn-shade';front.appendChild(snapshot());leaf.appendChild(front);leaf.appendChild(back);paper.appendChild(shade);paper.appendChild(leaf);paper.classList.add('is-turning');paper.setAttribute('aria-busy','true');
page=target;render();try{if(page!==galleryIndex)await $('#page-image').decode().catch(()=>{});const degrees=direction>0?-174:174;
const motion=leaf.animate([{transform:'rotateY(0deg)',filter:'brightness(1)',offset:0},{transform:`rotateY(${degrees*.45}deg)`,filter:'brightness(.72)',offset:.48},{transform:`rotateY(${degrees}deg)`,filter:'brightness(.9)',opacity:0,offset:1}],{duration:760,easing:'cubic-bezier(.25,.62,.23,1)',fill:'forwards'});
shade.animate([{opacity:.55},{opacity:.3,offset:.5},{opacity:0}],{duration:760,fill:'forwards'});await motion.finished;
}finally{leaf.remove();shade.remove();paper.classList.remove('is-turning');paper.removeAttribute('aria-busy');turning=false}}

function showDetail(button){opener=button;const club=clubs[selected];$('#detail-number').textContent=`PROGRAMME SLOT ${String(selected+1).padStart(2,'0')}`;$('#detail-club').textContent=club.name;$('#detail-title').textContent=club.title;$('#detail-type').textContent=club.type;$('#detail-description').textContent=club.detail;$('#detail').showModal()}
function closeDetail(){$('#detail').close();if(opener&&opener.isConnected)opener.focus()}
function rotate(d){turn+=d;selected=((turn%clubs.length)+clubs.length)%clubs.length;renderOrbit()}
$('#rotate-left').onclick=()=>rotate(-1);$('#rotate-right').onclick=()=>rotate(1);$('#open-detail').onclick=()=>showDetail($('#open-detail'));$('#back-gallery').onclick=closeDetail;$('#return-gallery').onclick=closeDetail;$('#previous').onclick=()=>go(page-1);$('#corner-prev').onclick=()=>go(page-1);$('#corner-next').onclick=()=>go(page+1);$('#next').onclick=()=>go(page+1);$('#contents-open').onclick=()=>$('#contents').showModal();$('#contents-close').onclick=()=>$('#contents').close();document.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>{go(Number(b.dataset.section));$('#contents').close()});
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close()});
$('#paper').addEventListener('pointerdown',e=>{if(turning)return;start={x:e.clientX,y:e.clientY,orbit:!!e.target.closest('#orbit')}});$('#paper').addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)*1.3){swipeBlock=true;if(start.orbit)rotate(dx<0?1:-1);else go(page+(dx<0?1:-1));setTimeout(()=>swipeBlock=false,200)}start=null});$('#paper').addEventListener('pointercancel',()=>start=null);$('#paper').addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')start=null});window.addEventListener('resize',()=>{if(page===galleryIndex)renderOrbit()});document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(e.target.closest('button'))return;if(e.key==='ArrowLeft'){e.preventDefault();go(page-1)}if(e.key==='ArrowRight'){e.preventDefault();go(page+1)}});render();

// Preload the artwork so a turning sheet reveals a fully drawn page.
for(const item of pages){if(item.image){const image=new Image();image.src=`assets/page-${item.image}.jpg?v=${assetVersion}`}}
