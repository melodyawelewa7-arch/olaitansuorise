/*
  OLAITAN SURPRISE PACKAGE
  IMPORTANT: replace WHATSAPP_NUMBER with the business WhatsApp number.
  Nigerian example: 2348012345678 (no +, spaces, or leading 0).
*/
const WHATSAPP_NUMBER = "2349069271431";

const products = [
 {id:"birthday-bliss",name:"Birthday Bliss",cat:"birthday",price:25000,icon:"🎂",desc:"A cheerful birthday collection designed to make their big day feel extra special."},
 {id:"love-romance",name:"Love & Romance",cat:"romance",price:30000,icon:"💐",desc:"A thoughtful romantic surprise for someone who means the world to you."},
 {id:"grad-glow",name:"Grad Glow",cat:"graduation",price:28000,icon:"🎓",desc:"A celebration package for a proud graduate and their amazing achievement."},
 {id:"just-because",name:"Just Because",cat:"celebration",price:22000,icon:"✨",desc:"No occasion needed — simply send a little happiness."},
 {id:"celebration-box",name:"Celebration Box",cat:"celebration",price:35000,icon:"🎉",desc:"A versatile package for congratulations, promotions and special milestones."},
 {id:"premium-surprise",name:"Premium Surprise",cat:"celebration",price:55000,icon:"💎",desc:"A fuller, elevated package for a truly unforgettable surprise."},
 {id:"sweet-treats",name:"Sweet Treats",cat:"birthday",price:27000,icon:"🍫",desc:"A delightful gift collection for anyone who loves sweet little surprises."},
 {id:"custom-package",name:"Custom Package",cat:"celebration",price:0,icon:"🎀",desc:"Tell us your budget and idea and we'll create something personal."}
];

let cart = JSON.parse(localStorage.getItem("olaitanCart") || "[]");

const money = n => n ? "₦" + n.toLocaleString("en-NG") : "Custom";
const $ = s => document.querySelector(s);

function renderProducts(filter="all"){
  const list = products.filter(p => filter==="all" || p.cat===filter);
  $("#products").innerHTML = list.map(p => `
    <article class="product">
      <div class="product-image cat-${p.cat}">${p.icon}</div>
      <div class="product-body">
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="price">${money(p.price)}${p.price ? "" : " — ask us"}</div>
        <div class="product-actions">
          <button class="add" onclick="addToCart('${p.id}')">${p.price ? "Add to Cart" : "Request"}</button>
          <button class="details" onclick="showDetails('${p.id}')">Details</button>
        </div>
      </div>
    </article>`).join("");
}

function saveCart(){localStorage.setItem("olaitanCart",JSON.stringify(cart)); updateCart();}
function addToCart(id){
  const item = cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  saveCart(); toast("Added to your surprise cart 🎁");
}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=delta;if(item.qty<=0)removeFromCart(id);else saveCart();
}
function updateCart(){
  $("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const items=cart.map(x=>{
    const p=products.find(y=>y.id===x.id);
    return `<div class="cart-line"><div><b>${p.name}</b><small>${money(p.price)||"Custom"}</small></div><div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button> ${x.qty} <button onclick="changeQty('${p.id}',1)">+</button></div><button class="details" onclick="removeFromCart('${p.id}')">Remove</button></div>`;
  }).join("");
  $("#cartItems").innerHTML=items || `<p style="color:#75676b;padding:15px 0">Your cart is empty. Choose a surprise package to begin.</p>`;
  const total=cart.reduce((s,x)=>{const p=products.find(y=>y.id===x.id);return s+(p.price*x.qty)},0);
  $("#cartTotal").textContent=money(total);
}
function showDetails(id){
  const p=products.find(x=>x.id===id);
  alert(`${p.name}\n\n${p.desc}\n\nPrice: ${money(p.price)}${p.price?"":"\n\nWe'll discuss your budget and package contents on WhatsApp."}`);
}
function openCart(){$("#cartModal").classList.add("show");$("#cartModal").setAttribute("aria-hidden","false");updateCart();}
function closeCart(){$("#cartModal").classList.remove("show");$("#cartModal").setAttribute("aria-hidden","true");}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}

function whatsappText(){
  if(!cart.length)return "";
  const buyer=$("#buyer").value.trim(),recipient=$("#recipient").value.trim(),delivery=$("#delivery").value.trim(),date=$("#deliveryDate").value,note=$("#giftNote").value.trim();
  const lines=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `• ${p.name} x${x.qty} — ${p.price?money(p.price*x.qty):"Custom"}`}).join("\n");
  const total=cart.reduce((s,x)=>{const p=products.find(y=>y.id===x.id);return s+p.price*x.qty},0);
  return `Hello Olaitan Surprise Package! 🎁\n\nI'd like to place an order.\n\nCustomer: ${buyer||"Not provided"}\nRecipient: ${recipient||"Not provided"}\nDelivery area: ${delivery||"Not provided"}\nPreferred date: ${date||"Not provided"}\n\nPackage(s):\n${lines}\n\nEstimated package total: ${money(total)}\n\nGift message / special instruction:\n${note||"None"}\n\nPlease confirm availability, delivery fee and final payment details. Thank you!`;
}

$("#checkout").addEventListener("click",()=>{
  if(!cart.length){toast("Your cart is empty.");return;}
  if(WHATSAPP_NUMBER==="2340000000000"){alert("Add the business WhatsApp number in script.js before launch.");return;}
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText())}`,"_blank");
});
$("#customForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(WHATSAPP_NUMBER==="2340000000000"){alert("Add the business WhatsApp number in script.js before launch.");return;}
  const text=`Hello Olaitan Surprise Package! 🎀\n\nI'd like a CUSTOM surprise package.\n\nMy name: ${$("#cname").value}\nRecipient: ${$("#crecipient").value}\nBudget: ${$("#cbudget").value||"Not specified"}\nOccasion: ${$("#coccasion").value||"Not specified"}\n\nMy idea:\n${$("#cmessage").value}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,"_blank");
});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.filter);
}));
$(".cart-fab").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);
$("#cartModal").addEventListener("click",e=>{if(e.target.id==="cartModal")closeCart();});
$(".hamburger").addEventListener("click",()=>document.querySelector("nav").classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector("nav").classList.remove("open")));
$("#contactWhatsapp").addEventListener("click",e=>{
  if(WHATSAPP_NUMBER==="2340000000000"){e.preventDefault();alert("Add the business WhatsApp number in script.js before launch.");return;}
  e.currentTarget.href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Olaitan Surprise Package! I'd like to make an enquiry.")}`;
});
$("#year").textContent=new Date().getFullYear();
renderProducts();updateCart();
