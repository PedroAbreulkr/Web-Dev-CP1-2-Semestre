const KEY = 'jogadoras'
const INIT = [
  { nome:"Andressa Alves", posicao:"Meio-campo", clube:"Corinthians", foto:"https://static.corinthians.com.br/uploads/1750945125ae85d38ba1ba9d131b2a573de17d66e7.png", gols:15, assistencias:10, jogos:28, favorita:false },
  { nome:"Dayana Rodríguez", posicao:"Meio-campo", clube:"Corinthians", foto:"https://static.corinthians.com.br/uploads/175094526199472a1c51895312eb49e4ae3cdac3bf.png", gols:5, assistencias:12, jogos:30, favorita:false },
  { nome:"Mariza", posicao:"Zagueira", clube:"Corinthians", foto:"https://static.corinthians.com.br/uploads/17509466300ed0cd7ead3e168df256f884ccd24f62.png", gols:2, assistencias:1, jogos:32, favorita:false },
  { nome:"Thaís Regina", posicao:"Zagueira", clube:"Corinthians", foto:"https://static.corinthians.com.br/uploads/1750946971a11dc33d9088b82f80dcda9841636229.png", gols:1, assistencias:2, jogos:25, favorita:false },
  { nome:"Letícia Teles", posicao:"Zagueira", clube:"Corinthians", foto:"https://static.corinthians.com.br/uploads/17509463693cf4a6df3a66e0fbed2cbbe2a7fbaaae.png", gols:0, assistencias:0, jogos:18, favorita:false }
]

const $ = s => document.querySelector(s)

const cards = $('#cards')
const formBox = $('#form')
const form = $('#f')
const formTitle = $('#form-t')
const idx = $('#idx')

const addBtn = $('#add')
const cancelBtn = $('#cancel')

const inNome = $('#nome')
const inPos = $('#pos')
const inClu = $('#clu')
const inFoto = $('#foto')
const inGol = $('#gol')
const inAst = $('#ast')
const inJog = $('#jog')

const search = $('#s')
const clubSel = $('#club')
const sortN = $('#sort-n')
const sortP = $('#sort-p')

let list = []
let currentSort = null

const save = () => localStorage.setItem(KEY, JSON.stringify(list))
const load = () => {
  if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify(INIT))
  list = JSON.parse(localStorage.getItem(KEY))
}

const tpl = (p,i) => `
  <article class="card">
    <div class="topc">
      <img class="ph" src="${p.foto}" alt="${p.nome}" loading="lazy">
      <div class="info">
        <h3>${p.nome}</h3>
        <p>${p.posicao} • ${p.clube}</p>
      </div>
      <button class="icon fav ${p.favorita?'active':''}" title="Favoritar" data-i="${i}">${p.favorita?'★':'☆'}</button>
    </div>
    <div class="stats-c">
      <div><strong>Gols</strong> <span>${p.gols}</span></div>
      <div><strong>Assist.</strong> <span>${p.assistencias}</span></div>
      <div><strong>Jogos</strong> <span>${p.jog}</span></div>
    </div>
    <div class="actions">
      <div class="muted">${p.clube}</div>
      <div class="btns">
        <button class="icon edit" title="Editar" data-i="${i}">✎</button>
        <button class="icon del" title="Excluir" data-i="${i}">🗑</button>
      </div>
    </div>
  </article>
`

const render = arr => {
  cards.innerHTML = arr.length ? arr.map(tpl).join('') : '<p class="muted">Nenhuma jogadora encontrada.</p>'
  cards.querySelectorAll('.fav').forEach(b=>b.onclick=()=>toggle(+b.dataset.i))
  cards.querySelectorAll('.edit').forEach(b=>b.onclick=()=>openEdit(+b.dataset.i))
  cards.querySelectorAll('.del').forEach(b=>b.onclick=()=>remove(+b.dataset.i))
}

const add = p => { list.push(p); save(); ui() }
const upd = (i,p) => { list[i]=p; save(); ui() }
const remove = i => { if(!confirm(`Remover ${list[i].nome}?`)) return; list.splice(i,1); save(); ui() }
const toggle = i => { list[i].favorita = !list[i].favorita; save(); ui() }

const openAdd = () => {
  formTitle.textContent = 'Adicionar Jogadora'
  idx.value = -1
  form.reset()
  formBox.classList.add('show')
  inNome.focus()
}
const openEdit = i => {
  const p = list[i]
  formTitle.textContent = 'Editar Jogadora'
  idx.value = i
  inNome.value = p.nome
  inPos.value = p.posicao
  inClu.value = p.clube
  inFoto.value = p.foto
  inGol.value = p.gols
  inAst.value = p.assistencias
  inJog.value = p.jogos
  formBox.classList.add('show')
  inNome.focus()
}

form.onsubmit = e => {
  e.preventDefault()
  const nome = inNome.value.trim()
  const posicao = inPos.value.trim()
  const clube = inClu.value.trim()
  const foto = inFoto.value.trim()
  const gols = +inGol.value
  const assistencias = +inAst.value
  const jogos = +inJog.value

  if(!nome || !posicao || !clube || !foto) return alert('Preencha todos os campos.')

  const data = { nome, posicao, clube, foto, gols, assistencias, jogos, favorita:false }
  const i = +idx.value
  if(i >= 0){ data.favorita = list[i].favorita; upd(i,data) } else add(data)

  form.reset()
  formBox.classList.remove('show')
}

cancelBtn.onclick = () => { form.reset(); formBox.classList.remove('show') }
addBtn.onclick = openAdd

function clubs(){
  const cs = [...new Set(list.map(p=>p.clube))].sort()
  clubSel.innerHTML = '<option value="">Todos os clubes</option>' + cs.map(c=>`<option value="${c}">${c}</option>`).join('')
}

function filterAndRender(){
  let arr = list.slice()
  const q = search.value.trim().toLowerCase()
  if(q){
    arr = arr.filter(p => p.nome.toLowerCase().includes(q) || p.posicao.toLowerCase().includes(q))
  }
  if(clubSel.value) arr = arr.filter(p => p.clube === clubSel.value)

  if(currentSort === 'nome') arr.sort((a,b)=>a.nome.localeCompare(b.nome))
  else if(currentSort === 'posicao') arr.sort((a,b)=>a.posicao.localeCompare(b.posicao))

  render(arr)
}

search.oninput = filterAndRender
clubSel.onchange = filterAndRender
sortN.onclick = ()=>{ currentSort = 'nome'; filterAndRender() }
sortP.onclick = ()=>{ currentSort = 'posicao'; filterAndRender() }

function ui(){ clubs(); filterAndRender() }
function init(){ load(); ui() }
init()
