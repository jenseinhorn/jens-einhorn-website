const routes={
  "/":"/content/projects/reise-ohne-ende.json",
  "/strasse-der-jugend":"/content/projects/worn-out-tapes.json",
  "/porzellan-und-vulkan":"/content/projects/porcelain-volcano.json",
  "/raw-vision":"/content/projects/for-the-birds.json",
  "/we-are-all-we-have":"/content/projects/we-are-all-we-have.json",
  "/about":"/content/pages/about.json",
  "/contact":"/content/pages/contact.json"
};
const navItems=[
  ["/","REISE OHNE ENDE"],
  ["/strasse-der-jugend","WORN OUT TAPES"],
  ["/porzellan-und-vulkan","PORCELAIN & VOLCANO"],
  ["/raw-vision","FOR THE BIRDS"],
  ["/we-are-all-we-have","WE ARE ALL WE HAVE"],
  ["/about","ABOUT"],
  ["/contact","CONTACT"]
];
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function paras(s=""){return s.split(/\n\s*\n/).filter(Boolean).map(p=>"<p>"+esc(p).replace(/\n/g,"<br>")+"</p>").join("")}
function shell(){
  document.body.innerHTML=`<aside class="sidebar"><a class="brand" href="/">Jens Einhorn</a><button class="menu-toggle" aria-label="Menü öffnen" aria-expanded="false">Menu</button><nav class="site-nav">${navItems.map(([u,l])=>`<a href="${u}">${l}</a>`).join("")}</nav><a class="edit-link" href="/admin/">Website bearbeiten</a></aside><main class="content" id="app"></main><div class="lightbox"><img alt=""></div>`;
  const t=document.querySelector(".menu-toggle"),n=document.querySelector(".site-nav");t.addEventListener("click",()=>{const o=n.classList.toggle("open");t.setAttribute("aria-expanded",String(o))});
}
function bindZoom(){document.querySelectorAll(".zoomable").forEach(img=>img.addEventListener("click",()=>{const l=document.querySelector(".lightbox");l.querySelector("img").src=img.src;l.querySelector("img").alt=img.alt;l.classList.add("open");document.body.classList.add("no-scroll")}));const lb=document.querySelector(".lightbox");lb.addEventListener("click",()=>{lb.classList.remove("open");document.body.classList.remove("no-scroll")})}
async function main(){
 shell();
 let path=location.pathname.replace(/\/$/,"")||"/";
 let file=routes[path]||routes["/"];
 const d=await fetch(file,{cache:"no-store"}).then(r=>r.json());
 const a=document.getElementById("app");
 if(path==="/about"){a.className="content text-page";a.innerHTML=`<section class="essay"><h1>${esc(d.title)}</h1>${paras(d.body)}</section>`;return}
 if(path==="/contact"){a.className="content text-page";a.innerHTML=`<section class="essay"><h1>${esc(d.title)}</h1><p><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></p>${paras(d.body||"")}</section>`;return}
 const works=(d.works||[]).map(w=>`<figure><img class="zoomable" src="${esc(w.image)}" alt="${esc((w.title||"")+" "+(w.year||""))}" loading="lazy"><figcaption>${esc(w.title||"")}${w.year?", "+esc(w.year):""}${w.material?"<br>"+esc(w.material):""}${w.size?"<br>"+esc(w.size):""}</figcaption></figure>`).join("");
 const inst=(d.installation_views||[]).map(v=>`<figure class="installation"><img class="zoomable" src="${esc(v.image)}" alt="${esc(v.caption||d.title)}" loading="lazy"><figcaption>${esc(v.caption||d.title)}</figcaption></figure>`).join("");
 a.innerHTML=`<section class="gallery">${works}</section><section class="essay"><h1>${esc(d.title)}</h1>${paras(d.text||"")}${d.note?`<div class="note">${paras(d.note)}</div>`:""}</section>${inst?`<section class="gallery installation-gallery">${inst}</section>`:""}`;
 bindZoom();
}
main();