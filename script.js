const $ = id => document.getElementById(id);

function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) if (n % i === 0) return false;
  return true;
}

function classify(n) {
  if (isPrime(n)) return "Prime";
  return n % 2 === 0 ? "Even" : "Odd";
}

$("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

$("mobileMenu").onclick = () => $("nav").classList.toggle("open");
document.querySelectorAll("#nav a").forEach(a => a.onclick = () => $("nav").classList.remove("open"));

$("checkNumber").onclick = () => {
  const raw = $("singleNumber").value;
  const box = $("singleResult");
  if (raw === "") { box.innerHTML = '<span class="answer">Please enter a number.</span>'; return; }
  const n = Number(raw);
  if (!Number.isInteger(n)) { box.innerHTML = '<span class="answer">Please enter a whole number.</span>'; return; }
  if (n < 2) {
    box.innerHTML = `<span class="answer"><b>${n}</b> is ${n % 2 === 0 ? "Even" : "Odd"} and is not prime because prime numbers are greater than 1.</span>`;
    return;
  }
  const type = classify(n);
  const reason = type === "Prime" ? "It has exactly two positive factors: 1 and itself." : `It is divisible by 2 ${type === "Even" ? "with no remainder" : "with a remainder of 1"}.`;
  box.innerHTML = `<span class="answer"><b>${n}</b> is <b>${type}</b>. ${reason}</span>`;
};

function renderNumbers(id, arr) {
  $(id).innerHTML = arr.length ? arr.map(n => `<span class="num">${n}</span>`).join("") : "<span>No numbers found.</span>";
}

$("classifyRange").onclick = () => {
  const start = Number($("startNumber").value), end = Number($("endNumber").value);
  const error = $("rangeError");
  error.textContent = "";
  if (!Number.isInteger(start) || !Number.isInteger(end)) { error.textContent = "Enter whole numbers in both fields."; return; }
  if (start > end) { error.textContent = "The start number must not be greater than the end number."; return; }
  if (end - start > 10000) { error.textContent = "Please keep the range at 10,000 numbers or fewer."; return; }

  const even=[], odd=[], prime=[];
  for(let n=start;n<=end;n++){ (n%2===0?even:odd).push(n); if(isPrime(n)) prime.push(n); }
  renderNumbers("evenNumbers", even); renderNumbers("oddNumbers", odd); renderNumbers("primeNumbers", prime);
  $("evenCount").textContent=even.length; $("oddCount").textContent=odd.length; $("primeCount").textContent=prime.length;
  $("rangeLabel").textContent=`(${start} to ${end})`;
  $("rangeResults").classList.remove("hidden");
};

$("findFactors").onclick = () => {
  const n = Number($("factorNumber").value), box=$("factorResult");
  if (!Number.isInteger(n) || n < 1) { box.innerHTML='<span class="answer">Enter a positive whole number.</span>'; return; }
  const factors=[];
  for(let i=1;i<=Math.sqrt(n);i++){
    if(n%i===0){ factors.push(i); if(i!==n/i) factors.push(n/i); }
  }
  factors.sort((a,b)=>a-b);
  box.innerHTML='<div class="factors">'+factors.map(x=>`<span class="factor">${x}</span>`).join("")+'</div>';
};

let lastResults = {};
$("exportResults").onclick = () => {
  const text = `MATH NUMBER LEARNING HUB\nRange: ${$("rangeLabel").textContent}\n\nEven:\n${$("evenNumbers").innerText}\n\nOdd:\n${$("oddNumbers").innerText}\n\nPrime:\n${$("primeNumbers").innerText}`;
  const a=document.createElement("a"), url=URL.createObjectURL(new Blob([text],{type:"text/plain"}));
  a.href=url; a.download="math-number-results.txt"; a.click(); URL.revokeObjectURL(url);
};

let quizNumber = 37;
function newQuestion(){
  quizNumber = Math.floor(Math.random()*98)+2;
  $("quizNumber").textContent=quizNumber;
  $("quizFeedback").textContent="";
  $("quizFeedback").className="quiz-feedback";
}
document.querySelectorAll(".quiz-options button").forEach(btn=>{
  btn.onclick=()=>{
    const answer=btn.dataset.answer;
    const actual=isPrime(quizNumber) ? "Prime" : (quizNumber%2===0 ? "Even" : "Odd");
    $("quizFeedback").className="quiz-feedback "+(answer===actual?"correct":"wrong");
    $("quizFeedback").textContent=answer===actual ? `Correct! ${quizNumber} is ${actual}.` : `Not quite. ${quizNumber} is ${actual}. Try the next one!`;
  };
});
$("nextQuestion").onclick=newQuestion;

["singleNumber","factorNumber"].forEach(id=>$(id).addEventListener("keydown",e=>{if(e.key==="Enter") $(id==="singleNumber"?"checkNumber":"findFactors").click()}));
["startNumber","endNumber"].forEach(id=>$(id).addEventListener("keydown",e=>{if(e.key==="Enter") $("classifyRange").click()}));
