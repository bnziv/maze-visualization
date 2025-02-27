var B=Object.defineProperty;var I=(s,t,e)=>t in s?B(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var a=(s,t,e)=>I(s,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();class b{constructor(t,e){a(this,"x");a(this,"y");a(this,"visited",!1);a(this,"path",!1);a(this,"previous",null);a(this,"walls",{top:!0,right:!0,bottom:!0,left:!0});this.x=t,this.y=e}clone(){const t=new b(this.x,this.y);return t.visited=this.visited,t.path=this.path,t.walls={...this.walls},t}}class L{constructor(t,e){a(this,"rows");a(this,"cols");a(this,"grid");a(this,"startCell",null);a(this,"endCell",null);a(this,"currentCell",null);this.rows=t,this.cols=e,this.grid=new Array(t).fill(null).map((n,r)=>new Array(e).fill(null).map((i,l)=>new b(l,r)))}generateRecursiveBacktracking(){const t=[],e=this.grid[Math.floor(Math.random()*this.rows)][Math.floor(Math.random()*this.cols)];for(t.push(e),e.visited=!0;t.length>0;){const n=t.pop(),r=this.getUnvisitedNeighbors(n);if(r.length>0){t.push(n);const i=r[Math.floor(Math.random()*r.length)];this.removeWall(n,i),i.visited=!0,t.push(i)}}}getUnvisitedNeighbors(t){const e=[],n=[[t.y,t.x-1],[t.y,t.x+1],[t.y-1,t.x],[t.y+1,t.x]];for(const[r,i]of n)this.inBounds(r,i)&&!this.grid[r][i].visited&&e.push(this.grid[r][i]);return e}removeWall(t,e){t.x===e.x?t.y<e.y?(t.walls.bottom=!1,e.walls.top=!1):(t.walls.top=!1,e.walls.bottom=!1):t.y===e.y&&(t.x<e.x?(t.walls.right=!1,e.walls.left=!1):(t.walls.left=!1,e.walls.right=!1))}getNeighbors(t,e=!1){const n=[],r=[{wall:"top",x:0,y:-1},{wall:"right",x:1,y:0},{wall:"bottom",x:0,y:1},{wall:"left",x:-1,y:0}];for(const{wall:i,x:l,y:o}of r)if(!t.walls[i]){const d=t.y+o,u=t.x+l;this.inBounds(d,u)&&!this.grid[d][u].visited&&n.push(this.grid[d][u])}return e&&n.sort(()=>Math.random()-.5),n}inBounds(t,e){return t>=0&&t<this.rows&&e>=0&&e<this.cols}setStartCell(t){this.startCell=t}setEndCell(t){this.endCell=t}reset(){for(let t=0;t<this.rows;t++)for(let e=0;e<this.cols;e++)this.grid[t][e].visited=!1,this.grid[t][e].path=!1}getGrid(){return this.grid}clone(){const t=new L(this.rows,this.cols);return t.grid=this.grid.map(e=>e.map(n=>n.clone())),t.startCell=t.grid[this.startCell.y][this.startCell.x],t.endCell=t.grid[this.endCell.y][this.endCell.x],t}tracePath(){let t=this.endCell;for(;t!=null;)t.path=!0,t=t.previous}generateKruskalsMaze(){const t=new Map;this.grid.flat().forEach(n=>t.set(n,new Set([n])));const e=[];for(let n=0;n<this.rows;n++)for(let r=0;r<this.cols;r++){const i=this.grid[n][r];r<this.cols-1&&e.push({cell1:i,cell2:this.grid[n][r+1]}),n<this.rows-1&&e.push({cell1:i,cell2:this.grid[n+1][r]})}e.sort(()=>Math.random()-.5);for(const{cell1:n,cell2:r}of e){const i=t.get(n),l=t.get(r);if(i!==l){this.removeWall(n,r);const o=new Set([...i,...l]);o.forEach(d=>t.set(d,o))}}}}function*S(s){if(!s.startCell||!s.endCell)return;s.reset();const t=[];let e=s.startCell;for(t.push(e);t.length>0;){if(e=t.pop(),e.visited=!0,s.currentCell=e,e===s.endCell){s.tracePath();break}for(const n of s.getNeighbors(e))t.push(e),n.previous=e,t.push(n);yield s}yield s}function*P(s){if(!s.startCell||!s.endCell)return;s.reset();const t=[],e=new Map;let n=s.startCell;for(t.push(n),e.set(n,null);t.length>0;){if(n=t.shift(),n.visited=!0,s.currentCell=n,n===s.endCell){s.tracePath();break}for(const r of s.getNeighbors(n))r.previous=n,t.push(r),e.set(r,n);yield s}yield s}function*k(s){if(!s.startCell||!s.endCell)return;s.reset();const t=i=>Math.abs(i.x-s.endCell.x)+Math.abs(i.y-s.endCell.y),e=[s.startCell],n=new Map,r=new Map;for(n.set(s.startCell,0),r.set(s.startCell,t(s.startCell));e.length>0;){e.sort((l,o)=>(r.get(l)??1/0)-(r.get(o)??1/0));const i=e.shift();if(s.currentCell=i,i===s.endCell){s.tracePath();break}i.visited=!0;for(const l of s.getNeighbors(i)){const o=(n.get(i)??1/0)+1;o<(n.get(l)??1/0)&&(l.previous=i,n.set(l,o),r.set(l,o+t(l)),e.includes(l)||e.push(l))}yield s}yield s}const f=document.getElementById("maze-container");f.style.gridTemplateColumns="repeat(2, 1fr)";f.style.gap="20px";let g=null,C=null,m=null,y=null,h=null;function v(s,t){const e=s.getGrid(),n=document.createElement("div");return n.id=`maze-${t}`,n.className="maze",n.innerHTML="",n.style.gridTemplateColumns=`repeat(${e[0].length}, 1fr)`,e.forEach(r=>{r.forEach(i=>{const l=document.createElement("div");l.className="cell",l.addEventListener("click",()=>T(l,i,s)),l.addEventListener("contextmenu",o=>{o.preventDefault(),G(l,i,s)}),x(i,l),i==s.startCell&&l.classList.add("start"),i==s.endCell&&l.classList.add("end"),i.visited&&l.classList.add("visited"),i.path&&l.classList.add("path"),n.appendChild(l)})}),n}function x(s,t){["top","right","bottom","left"].forEach(o=>{if(s.walls[o]){const d=document.createElement("div");d.className=`${o}-wall`,t.appendChild(d)}});const n=document.createElement("div");n.className="corner-top-left",t.appendChild(n);const r=document.createElement("div");r.className="corner-top-right",t.appendChild(r);const i=document.createElement("div");i.className="corner-bottom-left",t.appendChild(i);const l=document.createElement("div");if(l.className="corner-bottom-right",t.appendChild(l),s==g){const o=document.createElement("div");o.classList.add("start"),t.appendChild(o)}else if(s==m){const o=document.createElement("div");o.classList.add("end"),t.appendChild(o)}}function T(s,t,e){s===C||s===y||(g?(C.classList.remove("start"),s.classList.add("start"),C=s,g=t,e.setStartCell(g)):(s.classList.add("start"),C=s,g=t,e.setStartCell(t)))}function G(s,t,e){s===C||s===y||(m?(y.classList.remove("end"),s.classList.add("end"),y=s,m=t,e.setEndCell(m)):(s.classList.add("end"),y=s,m=t,e.setEndCell(t)))}document.getElementById("solve").addEventListener("click",async()=>{if(!g||!m){alert("Please add a start and end cell first.");return}const s=h.clone(),t=h.clone(),e=h.clone();f.innerHTML="",f.appendChild(v(s,"bfs")),f.appendChild(v(t,"dfs")),f.appendChild(v(e,"astar"));const n=document.getElementById("maze-bfs"),r=document.getElementById("maze-dfs"),i=document.getElementById("maze-astar"),l=P(s),o=S(t),d=k(e),u=async(N,M)=>{for(const w of N)M.innerHTML="",w.getGrid().forEach(E=>{E.forEach(p=>{const c=document.createElement("div");c.className="cell",x(p,c),p==w.startCell&&c.classList.add("start"),p==w.endCell&&c.classList.add("end"),p==w.currentCell&&c.classList.add("current"),p.visited&&c.classList.add("visited"),p.path&&c.classList.add("path"),M.appendChild(c)})}),await new Promise(E=>setTimeout(E,50))};await Promise.all([u(l,n),u(o,r),u(d,i)])});document.getElementById("generate").addEventListener("click",()=>{f.innerHTML="";const s=parseInt(document.getElementById("rows").value,10),t=parseInt(document.getElementById("cols").value,10);if(isNaN(s)||isNaN(t)||s<5||t<5){alert("Please enter valid dimensions (min: 5x5)");return}h=new L(Math.min(s,31),Math.min(t,31));const e=document.getElementById("algorithm").value;e==="recursive"?h.generateRecursiveBacktracking():e==="kruskal"&&h.generateKruskalsMaze(),h.reset();const n=document.createElement("div");n.appendChild(document.createElement("h2")).textContent="";const r=v(h,"Generation");n.appendChild(r),f.appendChild(n)});
