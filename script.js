
const supabaseUrl = 'https://cgeegfrrixpasggjrbzt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZWVnZnJyaXhwYXNnZ2pyYnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTIwNzgsImV4cCI6MjA2MDgyODA3OH0.hkO5j8ejfA6DN9iT8L2xDGbLE5HR0GE9evKMLKcOI2E'
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

async function cadastrarUsuario() {
  const nome = document.getElementById('nome').value
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value

  const { error } = await supabase
    .from('usuarios')
    .insert({ nome, email, senha })

  if (error) alert(error.message)
  else alert('Usuário cadastrado com sucesso!')
}

async function adicionarMedicamento() {
  const email = document.getElementById('email').value
  const nome_medicamento = document.getElementById('nome_medicamento').value
  const dose = document.getElementById('dose').value
  const horario = document.getElementById('horario').value

  let { data: usuario } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .single()

  if (!usuario) return alert('Usuário não encontrado!')

  const { error } = await supabase
    .from('medicamentos')
    .insert({ usuario_id: usuario.id, nome_medicamento, dose, horario })

  if (error) alert(error.message)
  else {
    alert('Medicamento adicionado!')
    programarAlarme(nome_medicamento, dose, horario)
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
