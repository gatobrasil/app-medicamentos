
const supabaseUrl = 'https://cgeegfrrixpasggjrbzt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZWVnZnJyaXhwYXNnZ2pyYnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTIwNzgsImV4cCI6MjA2MDgyODA3OH0.hkO5j8ejfA6DN9iT8L2xDGbLE5HR0GE9evKMLKcOI2E'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)
let usuarioLogado = null

function mostrarLogin() {
  document.getElementById('cadastro-container').style.display = 'none'
  document.getElementById('login-container').style.display = 'block'
}

function mostrarPainel() {
  document.getElementById('cadastro-container').style.display = 'none'
  document.getElementById('login-container').style.display = 'none'
  document.getElementById('painel-container').style.display = 'block'
  carregarMedicamentos()
}

async function cadastrarUsuario() {
  const nome = document.getElementById('nome').value
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value

  const { error } = await supabase.from('usuarios').insert({ nome, email, senha })

  if (error) alert(error.message)
  else {
    alert('Usuário cadastrado com sucesso!')
    mostrarLogin()
  }
}

async function fazerLogin() {
  const email = document.getElementById('login_email').value
  const senha = document.getElementById('login_senha').value

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .eq('senha', senha)
    .single()

  if (error || !usuario) {
    alert('Email ou senha inválidos')
  } else {
    usuarioLogado = usuario
    mostrarPainel()
  }
}

async function adicionarMedicamento() {
  const nome_medicamento = document.getElementById('nome_medicamento').value
  const dose = document.getElementById('dose').value
  const horario = document.getElementById('horario').value

  const { error } = await supabase
    .from('medicamentos')
    .insert({ usuario_id: usuarioLogado.id, nome_medicamento, dose, horario })

  if (error) alert(error.message)
  else {
    alert('Medicamento adicionado!')
    programarAlarme(nome_medicamento, dose, horario)
    carregarMedicamentos()
  }
}

async function carregarMedicamentos() {
  const { data, error } = await supabase
    .from('medicamentos')
    .select('*')
    .eq('usuario_id', usuarioLogado.id)

  const lista = document.getElementById('medicamentos-lista')
  lista.innerHTML = '<h3>Seus medicamentos</h3>'
  if (data.length === 0) {
    lista.innerHTML += '<p>Nenhum medicamento cadastrado.</p>'
  } else {
    data.forEach(med => {
      lista.innerHTML += `<p><strong>${med.nome_medicamento}</strong> - ${med.dose} às ${med.horario}</p>`
    })
  }
}

function programarAlarme(nome, dose, horario) {
  const [h, m] = horario.split(':')
  const horaAlarme = new Date()
  horaAlarme.setHours(h, m, 0, 0)
  if (horaAlarme < new Date()) horaAlarme.setDate(horaAlarme.getDate() + 1)
  setTimeout(() => tocarAlarme(nome, dose), horaAlarme - new Date())
}

function tocarAlarme(nome, dose) {
  new Audio('https://www.soundjay.com/button/beep-07.wav').play()
  speechSynthesis.speak(new SpeechSynthesisUtterance(`Hora de tomar ${nome}, dose ${dose}`))
}
