// ============================================================
// MOTOR DE GERAÇÃO DE TREINOS — BERTOLDO PERFORMANCE
// Base científica: Schoenfeld (2010, 2017), Krieger (2010),
// Rhea et al. (2003), Figueiredo et al. (2017)
// ============================================================

const REFERENCIAS = [
  "Schoenfeld, B.J. (2010). The mechanisms of muscle hypertrophy and their application to resistance training. J Strength Cond Res.",
  "Schoenfeld, B.J. et al. (2017). Dose-response relationship between weekly resistance training volume and increases in muscle mass. J Sports Sci.",
  "Krieger, J.W. (2010). Single vs. multiple sets of resistance exercise for muscle hypertrophy: a meta-analysis. J Strength Cond Res.",
  "Rhea, M.R. et al. (2003). A meta-analysis to determine the dose response for strength development. Med Sci Sports Exerc.",
  "Figueiredo, V.C. et al. (2017). Intensity of resistance exercise determines adaptations in muscle fascia and minimum myofiber diameter. J Appl Physiol.",
  "Contreras, B. et al. (2015). Hip thrust and back squat EMG activity. J Strength Cond Res.",
  "Schoenfeld, B.J. (2011). The use of specialized training techniques to maximize muscle hypertrophy. Strength Cond J.",
  "Goto, K. et al. (2004). The impact of metabolic stress on hormonal responses and muscular adaptations. Med Sci Sports Exerc.",
]

const EX = {
  gluteo: [
    "Hip Thrust (Elevação Pélvica)",
    "Agachamento Búlgaro",
    "Stiff-Leg Deadlift",
    "Kickback na Polia",
    "Leg Press (pés altos e afastados)",
    "Agachamento Profundo (ATG)",
  ],
  gluteo_medio: [
    "Abdução Lateral com Elástico",
    "Clamshell com Elástico",
    "Hip Thrust Unilateral",
    "Agachamento Lateral",
  ],
  quadriceps: [
    "Agachamento Livre (back squat)",
    "Leg Press 45°",
    "Cadeira Extensora",
    "Hack Squat",
    "Agachamento Búlgaro",
    "Avanço (Lunge) com Passada",
  ],
  ischiotibiais: [
    "Deadlift Romeno (RDL)",
    "Nordic Hamstring Curl",
    "Flexora Deitada (Leg Curl)",
    "Flexora em Pé (Unilateral)",
    "Good Morning",
  ],
  panturrilha: [
    "Elevação de Calcanhares em Pé",
    "Elevação Unilateral com Halter",
    "Elevação no Leg Press",
    "Elevação Sentado (Seated Calf Raise)",
  ],
  peito: [
    "Supino Reto com Barra",
    "Supino Inclinado com Halteres",
    "Crucifixo na Máquina (Peck Deck)",
    "Crossover na Polia (baixo para cima)",
    "Crucifixo com Halteres",
    "Supino Declinado",
  ],
  dorsal: [
    "Barra Fixa (pegada pronada larga)",
    "Remada Curvada com Barra",
    "Puxada Frontal (Lat Pulldown)",
    "Remada Unilateral com Halter",
    "Pullover com Halter",
  ],
  trapezio: [
    "Encolhimento de Ombros (Shrug)",
    "Remada Baixa Fechada (Seated Row)",
    "Face Pull na Polia",
    "Remada Alta com Barra",
  ],
  deltoide: [
    "Desenvolvimento com Halteres",
    "Elevação Lateral com Halteres",
    "Elevação Lateral na Polia Baixa",
    "Crucifixo Invertido (Reverse Fly)",
    "Desenvolvimento Arnold",
    "Elevação Frontal",
  ],
  biceps: [
    "Rosca Direta com Barra",
    "Rosca Concentrada",
    "Rosca no Banco Scott",
    "Rosca Inclinada com Halteres",
    "Rosca na Polia Baixa",
    "Rosca Martelo com Halteres",
  ],
  triceps: [
    "Mergulho (Dip) em Paralelas",
    "Tríceps Testa (Skull Crusher)",
    "Tríceps Pulley (Polia Alta)",
    "Tríceps Francês (Overhead)",
    "Supino Fechado",
    "Tríceps Coice (Kickback)",
  ],
  abdomen: [
    "Prancha (Plank)",
    "Abdominal na Polia (Rope Crunch)",
    "Abdominal Infra (Elevação de Pernas)",
    "Crunch Reto",
    "Giro Russo (Russian Twist)",
    "Dead Bug",
  ],
}

function getConfig(nivel) {
  if (nivel === 'iniciante') return {
    series: 3, repsBase: '10-12', descanso: '60-90s',
    metodoBase: 'Série Simples', usaMetodosAvancados: false,
    obs: 'Foco em aprender a execução correta antes de aumentar carga.'
  }
  if (nivel === 'intermediario') return {
    series: 4, repsBase: '8-12', descanso: '60-90s',
    metodoBase: 'Série Simples', usaMetodosAvancados: true,
    metodosAvancados: ['Drop Set', 'Rest-Pause', 'Isometria no pico'],
  }
  return {
    series: 4, repsBase: '6-12', descanso: '45-75s',
    metodoBase: 'Série Simples', usaMetodosAvancados: true,
    metodosAvancados: ['Drop Set', 'Cluster Set', 'Rest-Pause', 'Isometria no pico', 'Método 3/7'],
  }
}

function metodoAvancado(config, isPrincipal) {
  if (!config.usaMetodosAvancados || !isPrincipal) return config.metodoBase
  const m = config.metodosAvancados
  return m[Math.floor(Math.random() * m.length)]
}

function ex(nome, config, isPrincipal = false, seriesCustom = null, repsCustom = null) {
  return {
    nome,
    series: seriesCustom || config.series,
    reps: repsCustom || config.repsBase,
    metodo: metodoAvancado(config, isPrincipal),
    descanso: config.descanso,
    principal: isPrincipal,
    destaque: isPrincipal,
  }
}

function gerarDias(foco, dias, config) {
  const semana = []

  // ============================================================
  // INFERIORES
  // ============================================================
  if (foco === 'inferiores') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Posterior', grupos: 'Glúteo + Isquiotibiais', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[2], config), ex(EX.ischiotibiais[2], config), ex(EX.gluteo_medio[0], config), ex(EX.panturrilha[0], config)], obs: 'Volume concentrado — 2 dias exige máxima eficiência por sessão.' })
      semana.push({ dia: 2, nome: 'TREINO B — Anterior', grupos: 'Quadríceps + Panturrilha', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[1], config, true), ex(EX.quadriceps[2], config), ex(EX.quadriceps[5], config), ex(EX.panturrilha[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Posterior', grupos: 'Glúteo + Isquiotibiais', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[2], config), ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[2], config), ex(EX.gluteo_medio[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Anterior', grupos: 'Quadríceps + Panturrilha', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[1], config, true), ex(EX.quadriceps[2], config), ex(EX.quadriceps[5], config), ex(EX.panturrilha[0], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Full Inferior', grupos: 'Integração Completa', exercicios: [ex(EX.gluteo[1], config, true), ex(EX.quadriceps[3], config), ex(EX.ischiotibiais[1], config, true), ex(EX.gluteo[4], config), ex(EX.panturrilha[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Glúteo + Posterior', grupos: 'Glúteo + Isquiotibiais', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[2], config), ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[2], config), ex(EX.gluteo_medio[0], config), ex(EX.gluteo_medio[1], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Quadríceps', grupos: 'Quadríceps + Panturrilha', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[1], config), ex(EX.quadriceps[2], config), ex(EX.quadriceps[3], config), ex(EX.panturrilha[0], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Glúteo Médio + Isquiotibiais', grupos: 'Glúteo Médio + Posterior', exercicios: [ex(EX.gluteo[1], config, true), ex(EX.ischiotibiais[1], config, true), ex(EX.gluteo_medio[2], config), ex(EX.ischiotibiais[3], config), ex(EX.gluteo[5], config), ex(EX.abdomen[1], config, false, 3, '45s')], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Full Inferior', grupos: 'Integração Completa', exercicios: [ex(EX.quadriceps[4], config, true), ex(EX.gluteo[3], config), ex(EX.ischiotibiais[4], config), ex(EX.panturrilha[1], config), ex(EX.gluteo_medio[3], config), ex(EX.abdomen[2], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Glúteo', grupos: 'Glúteo Máximo + Médio', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[1], config, true), ex(EX.gluteo[5], config), ex(EX.gluteo_medio[0], config), ex(EX.gluteo_medio[1], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Quadríceps', grupos: 'Quadríceps anterior', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[3], config), ex(EX.quadriceps[1], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Isquiotibiais', grupos: 'Posterior da Coxa', exercicios: [ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[1], config, true), ex(EX.ischiotibiais[2], config), ex(EX.ischiotibiais[4], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Glúteo + Cadeia Posterior', grupos: 'Integração Posterior', exercicios: [ex(EX.gluteo[4], config, true), ex(EX.gluteo[2], config), ex(EX.ischiotibiais[3], config), ex(EX.gluteo_medio[2], config), ex(EX.gluteo_medio[3], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Full Inferior', grupos: 'Integração + Core', exercicios: [ex(EX.quadriceps[4], config, true), ex(EX.gluteo[3], config), ex(EX.ischiotibiais[2], config), ex(EX.panturrilha[1], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  // ============================================================
  // INFERIORES ÊNFASE GLÚTEO
  // ============================================================
  else if (foco === 'inferiores_gluteo') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Glúteo Hip-Dominant', grupos: 'Glúteo Máximo + Médio', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[1], config, true), ex(EX.gluteo_medio[0], config), ex(EX.gluteo[5], config), ex(EX.ischiotibiais[0], config), ex(EX.panturrilha[0], config)], obs: 'Hip thrust primeiro — maior ativação EMG de glúteo documentada.' })
      semana.push({ dia: 2, nome: 'TREINO B — Glúteo + Isquiotibiais', grupos: 'Cadeia Posterior', exercicios: [ex(EX.gluteo[2], config, true), ex(EX.ischiotibiais[1], config, true), ex(EX.gluteo_medio[2], config), ex(EX.ischiotibiais[2], config), ex(EX.gluteo[3], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Glúteo Hip-Dominant', grupos: 'Glúteo Máximo + Médio', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[1], config, true), ex(EX.gluteo_medio[0], config), ex(EX.gluteo_medio[1], config), ex(EX.gluteo[5], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Glúteo + Isquiotibiais', grupos: 'Cadeia Posterior', exercicios: [ex(EX.gluteo[2], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[4], config), ex(EX.ischiotibiais[2], config), ex(EX.gluteo_medio[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Glúteo + Quadríceps', grupos: 'Volume Total', exercicios: [ex(EX.gluteo[3], config, true), ex(EX.quadriceps[0], config), ex(EX.gluteo[1], config), ex(EX.quadriceps[5], config), ex(EX.gluteo_medio[3], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Glúteo Hip-Dominant', grupos: 'Glúteo Máximo + Médio', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[2], config, true), ex(EX.gluteo_medio[0], config), ex(EX.gluteo_medio[2], config), ex(EX.gluteo[5], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Glúteo Knee-Dominant', grupos: 'Glúteo + Quadríceps', exercicios: [ex(EX.gluteo[1], config, true), ex(EX.quadriceps[0], config), ex(EX.gluteo[4], config), ex(EX.quadriceps[5], config), ex(EX.gluteo_medio[1], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Isquiotibiais + Glúteo Médio', grupos: 'Posterior + Abdutores', exercicios: [ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[1], config), ex(EX.gluteo_medio[3], config), ex(EX.ischiotibiais[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Glúteo + Volume', grupos: 'Full Posterior', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[3], config), ex(EX.ischiotibiais[3], config), ex(EX.gluteo_medio[0], config), ex(EX.panturrilha[2], config), ex(EX.abdomen[1], config, false, 3, '15')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Hip Thrust Day', grupos: 'Glúteo Máximo', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[3], config, true), ex(EX.gluteo_medio[0], config), ex(EX.gluteo[5], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Glúteo Knee-Dominant', grupos: 'Glúteo + Quad', exercicios: [ex(EX.gluteo[1], config, true), ex(EX.quadriceps[0], config), ex(EX.gluteo[4], config), ex(EX.quadriceps[5], config), ex(EX.gluteo_medio[1], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Posterior Pura', grupos: 'Isquiotibiais + Glúteo', exercicios: [ex(EX.gluteo[2], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[1], config), ex(EX.gluteo_medio[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Glúteo Médio', grupos: 'Glúteo Médio + Abdutores', exercicios: [ex(EX.gluteo_medio[0], config, true), ex(EX.gluteo_medio[2], config, true), ex(EX.gluteo_medio[1], config), ex(EX.gluteo_medio[3], config), ex(EX.ischiotibiais[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Volume Total', grupos: 'Full Inferior', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.quadriceps[2], config), ex(EX.ischiotibiais[3], config), ex(EX.panturrilha[1], config), ex(EX.abdomen[2], config, false, 3, '12')], obs: null })
    }
  }

  // ============================================================
  // INFERIORES ÊNFASE PERNA
  // ============================================================
  else if (foco === 'inferiores_perna') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Quadríceps', grupos: 'Anterior da Coxa + Panturrilha', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[1], config, true), ex(EX.quadriceps[2], config), ex(EX.quadriceps[3], config), ex(EX.panturrilha[0], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Isquiotibiais + Glúteo', grupos: 'Posterior da Coxa + Glúteo', exercicios: [ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[1], config, true), ex(EX.ischiotibiais[2], config), ex(EX.gluteo[0], config), ex(EX.panturrilha[3], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Anterior (Quadríceps)', grupos: 'Quadríceps + Panturrilha', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[1], config, true), ex(EX.quadriceps[2], config), ex(EX.quadriceps[5], config), ex(EX.panturrilha[0], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Posterior (Isquiotibiais)', grupos: 'Isquiotibiais + Glúteo', exercicios: [ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[1], config, true), ex(EX.ischiotibiais[2], config), ex(EX.gluteo[0], config), ex(EX.panturrilha[3], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Full Perna', grupos: 'Anterior + Posterior', exercicios: [ex(EX.quadriceps[3], config, true), ex(EX.ischiotibiais[4], config), ex(EX.quadriceps[4], config), ex(EX.ischiotibiais[3], config), ex(EX.panturrilha[1], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Quadríceps', grupos: 'Anterior da Coxa', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[3], config), ex(EX.quadriceps[1], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Isquiotibiais', grupos: 'Posterior da Coxa', exercicios: [ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[1], config, true), ex(EX.ischiotibiais[2], config), ex(EX.ischiotibiais[4], config), ex(EX.panturrilha[3], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Quadríceps + Glúteo', grupos: 'Anterior + Posterior', exercicios: [ex(EX.quadriceps[4], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[5], config), ex(EX.gluteo[1], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Full Inferior', grupos: 'Integração Total', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.quadriceps[2], config), ex(EX.ischiotibiais[3], config), ex(EX.panturrilha[1], config), ex(EX.abdomen[1], config, false, 3, '15')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Quadríceps Heavy', grupos: 'Anterior da Coxa', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[3], config), ex(EX.quadriceps[1], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Isquiotibiais Heavy', grupos: 'Posterior da Coxa', exercicios: [ex(EX.ischiotibiais[1], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[2], config), ex(EX.ischiotibiais[4], config), ex(EX.panturrilha[3], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Glúteo + Core', grupos: 'Glúteo + Estabilização', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo_medio[0], config), ex(EX.gluteo[2], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[2], config, false, 3, '12')], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Quadríceps Volume', grupos: 'Anterior + Panturrilha', exercicios: [ex(EX.quadriceps[4], config, true), ex(EX.quadriceps[5], config), ex(EX.quadriceps[1], config), ex(EX.panturrilha[1], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Isquiotibiais + Full', grupos: 'Posterior + Integração', exercicios: [ex(EX.ischiotibiais[3], config, true), ex(EX.quadriceps[2], config), ex(EX.gluteo[1], config), ex(EX.panturrilha[0], config), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  // ============================================================
  // SUPERIORES
  // ============================================================
  else if (foco === 'superiores') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Push (Empurrar)', grupos: 'Peito + Ombro + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config), ex(EX.triceps[0], config), ex(EX.triceps[2], config)], obs: 'Push day: todos os músculos de empurrar em uma sessão.' })
      semana.push({ dia: 2, nome: 'TREINO B — Pull (Puxar)', grupos: 'Costas + Bíceps + Trapézio', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config, true), ex(EX.dorsal[2], config), ex(EX.biceps[0], config), ex(EX.biceps[2], config), ex(EX.trapezio[0], config)], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps', grupos: 'Peitoral + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.peito[2], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps', grupos: 'Dorsal + Trapézio + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.dorsal[2], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Ombro + Core', grupos: 'Deltóide Completo + Core', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config), ex(EX.deltoide[2], config), ex(EX.trapezio[2], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps', grupos: 'Peitoral + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.peito[2], config), ex(EX.triceps[0], config, true), ex(EX.triceps[1], config), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps', grupos: 'Dorsal + Trapézio + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config, true), ex(EX.dorsal[2], config), ex(EX.biceps[0], config), ex(EX.biceps[2], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Ombro', grupos: 'Deltóide Completo + Trapézio', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config, true), ex(EX.deltoide[2], config), ex(EX.trapezio[2], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Peito + Costas + Core', grupos: 'Pull/Push + Core', exercicios: [ex(EX.peito[4], config, true), ex(EX.dorsal[3], config, true), ex(EX.peito[3], config), ex(EX.dorsal[4], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito', grupos: 'Peitoral Completo', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config, true), ex(EX.peito[5], config), ex(EX.peito[2], config), ex(EX.peito[3], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas', grupos: 'Dorsal + Trapézio + Rombóides', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.dorsal[2], config), ex(EX.trapezio[1], config), ex(EX.trapezio[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Ombro', grupos: 'Deltóide Anterior, Médio e Posterior', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config, true), ex(EX.deltoide[5], config), ex(EX.trapezio[2], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Bíceps + Tríceps', grupos: 'Braços Completo', exercicios: [ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.biceps[3], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.triceps[3], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Push/Pull + Core', grupos: 'Integração + Core', exercicios: [ex(EX.peito[4], config, true), ex(EX.dorsal[3], config, true), ex(EX.deltoide[4], config), ex(EX.biceps[4], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  // ============================================================
  // SUPERIORES ÊNFASE BÍCEPS
  // ============================================================
  else if (foco === 'superiores_biceps') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[2], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config, true), ex(EX.biceps[1], config), ex(EX.trapezio[1], config)], obs: 'Costas + bíceps na mesma sessão — puxadas pré-ativam bíceps maximizando o estímulo.' })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Ombro + Tríceps', grupos: 'Push + Bíceps Finalizador', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.biceps[4], config), ex(EX.biceps[5], config)], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas + Bíceps Heavy', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config, true), ex(EX.biceps[3], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Bíceps Isolado + Ombro', grupos: 'Bíceps + Deltóide', exercicios: [ex(EX.biceps[1], config, true), ex(EX.biceps[4], config), ex(EX.biceps[5], config), ex(EX.deltoide[1], config), ex(EX.deltoide[3], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.dorsal[2], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.biceps[3], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Tríceps', grupos: 'Peitoral + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.peito[2], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.triceps[3], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Bíceps Isolado + Ombro', grupos: 'Bíceps + Deltóide', exercicios: [ex(EX.biceps[1], config, true), ex(EX.biceps[3], config, true), ex(EX.biceps[4], config), ex(EX.deltoide[0], config), ex(EX.deltoide[1], config), ex(EX.trapezio[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Full Upper + Core', grupos: 'Integração Superior', exercicios: [ex(EX.dorsal[3], config, true), ex(EX.peito[4], config), ex(EX.biceps[5], config), ex(EX.triceps[4], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Tríceps', grupos: 'Peitoral + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Bíceps Isolamento', grupos: 'Bíceps Foco Total', exercicios: [ex(EX.biceps[1], config, true), ex(EX.biceps[3], config, true), ex(EX.biceps[4], config), ex(EX.biceps[5], config), ex(EX.dorsal[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Ombro + Trapézio', grupos: 'Deltóide Completo', exercicios: [ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config), ex(EX.deltoide[0], config), ex(EX.trapezio[0], config), ex(EX.trapezio[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Bíceps Volume + Core', grupos: 'Bíceps + Core', exercicios: [ex(EX.biceps[0], config, true), ex(EX.biceps[3], config), ex(EX.dorsal[3], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  // ============================================================
  // SUPERIORES ÊNFASE TRÍCEPS
  // ============================================================
  else if (foco === 'superiores_triceps') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps', grupos: 'Peitoral + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[3], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: 'Peito pré-ativa tríceps — supino antes do isolamento maximiza o estímulo total.' })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Tríceps Isolado', grupos: 'Costas + Tríceps + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[2], config), ex(EX.triceps[1], config, true), ex(EX.triceps[4], config, true), ex(EX.biceps[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps Heavy', grupos: 'Peitoral + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[1], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[2], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Tríceps Isolado + Ombro', grupos: 'Tríceps + Deltóide', exercicios: [ex(EX.triceps[3], config, true), ex(EX.triceps[4], config, true), ex(EX.triceps[5], config), ex(EX.deltoide[1], config), ex(EX.deltoide[3], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps', grupos: 'Push completo', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[1], config), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps', grupos: 'Pull completo', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Tríceps Isolamento', grupos: 'Tríceps Foco Total', exercicios: [ex(EX.triceps[3], config, true), ex(EX.triceps[4], config, true), ex(EX.triceps[2], config), ex(EX.triceps[5], config), ex(EX.peito[4], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Ombro + Core', grupos: 'Deltóide + Core', exercicios: [ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config), ex(EX.deltoide[0], config), ex(EX.trapezio[2], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[1], config), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps', grupos: 'Pull', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Tríceps Isolamento', grupos: 'Tríceps Foco Total', exercicios: [ex(EX.triceps[3], config, true), ex(EX.triceps[1], config, true), ex(EX.triceps[4], config), ex(EX.triceps[5], config), ex(EX.peito[4], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Ombro', grupos: 'Deltóide Completo', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config), ex(EX.trapezio[0], config), ex(EX.trapezio[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Tríceps + Core', grupos: 'Tríceps + Core', exercicios: [ex(EX.triceps[2], config, true), ex(EX.triceps[4], config), ex(EX.peito[2], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
  }

  // ============================================================
  // SUPERIORES ÊNFASE PEITO
  // ============================================================
  else if (foco === 'superiores_peito') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito Heavy', grupos: 'Peitoral Completo + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config, true), ex(EX.peito[5], config), ex(EX.peito[2], config), ex(EX.triceps[0], config), ex(EX.deltoide[0], config)], obs: 'Volume total de peitoral em uma sessão — supino reto + inclinado + declinado.' })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps + Ombro', grupos: 'Pull + Deltóide', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.deltoide[1], config), ex(EX.trapezio[2], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito Heavy', grupos: 'Peitoral Médio + Inferior', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[5], config), ex(EX.peito[2], config), ex(EX.triceps[0], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Peito Superior + Tríceps', grupos: 'Peitoral Superior + Tríceps', exercicios: [ex(EX.peito[1], config, true), ex(EX.peito[3], config, true), ex(EX.peito[4], config), ex(EX.triceps[2], config), ex(EX.triceps[4], config)], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito Heavy', grupos: 'Peitoral Médio + Inferior', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[5], config), ex(EX.peito[2], config), ex(EX.triceps[0], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Peito Superior', grupos: 'Peitoral Superior + Tríceps', exercicios: [ex(EX.peito[1], config, true), ex(EX.peito[3], config, true), ex(EX.peito[4], config), ex(EX.triceps[2], config), ex(EX.triceps[4], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Ombro + Core', grupos: 'Deltóide + Core', exercicios: [ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config), ex(EX.deltoide[0], config), ex(EX.trapezio[2], config), ex(EX.abdomen[1], config, false, 3, '15')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito Médio', grupos: 'Peitoral Médio', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[2], config), ex(EX.peito[4], config), ex(EX.triceps[0], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Peito Superior', grupos: 'Peitoral Superior', exercicios: [ex(EX.peito[1], config, true), ex(EX.peito[3], config, true), ex(EX.peito[4], config), ex(EX.triceps[2], config), ex(EX.triceps[4], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Ombro', grupos: 'Deltóide Completo', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config), ex(EX.trapezio[0], config), ex(EX.trapezio[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Peito Volume + Core', grupos: 'Peitoral + Core', exercicios: [ex(EX.peito[5], config, true), ex(EX.peito[2], config), ex(EX.peito[0], config), ex(EX.abdomen[4], config, false, 3, '12'), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
  }

  // ============================================================
  // SUPERIORES ÊNFASE COSTAS
  // ============================================================
  else if (foco === 'superiores_costas') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas Heavy + Bíceps', grupos: 'Dorsal + Trapézio + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config, true), ex(EX.dorsal[2], config), ex(EX.trapezio[0], config), ex(EX.biceps[0], config), ex(EX.biceps[2], config)], obs: 'Barra fixa com pegada larga — maior ativação de dorsal documentada em EMG.' })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Ombro + Tríceps', grupos: 'Push + Costas Finalizador', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.dorsal[3], config), ex(EX.trapezio[2], config)], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas Heavy', grupos: 'Dorsal + Trapézio', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config, true), ex(EX.dorsal[2], config), ex(EX.trapezio[0], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Costas + Bíceps', grupos: 'Dorsal + Rombóides + Bíceps', exercicios: [ex(EX.dorsal[3], config, true), ex(EX.trapezio[2], config, true), ex(EX.dorsal[4], config), ex(EX.biceps[0], config), ex(EX.biceps[2], config)], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas Heavy', grupos: 'Dorsal + Trapézio', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config, true), ex(EX.dorsal[2], config), ex(EX.trapezio[0], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Costas + Bíceps', grupos: 'Dorsal + Rombóides + Bíceps', exercicios: [ex(EX.dorsal[3], config, true), ex(EX.trapezio[2], config, true), ex(EX.dorsal[4], config), ex(EX.biceps[0], config), ex(EX.biceps[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Ombro + Core', grupos: 'Deltóide + Core', exercicios: [ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config, true), ex(EX.deltoide[0], config), ex(EX.trapezio[2], config), ex(EX.abdomen[1], config, false, 3, '15')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas Heavy', grupos: 'Dorsal + Trapézio', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.dorsal[2], config), ex(EX.trapezio[1], config), ex(EX.trapezio[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Costas Volume + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[3], config, true), ex(EX.dorsal[4], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Ombro', grupos: 'Deltóide Completo', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config), ex(EX.trapezio[0], config), ex(EX.trapezio[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Costas Volume', grupos: 'Full Pull + Core', exercicios: [ex(EX.dorsal[2], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[3], config), ex(EX.abdomen[4], config, false, 3, '12'), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
  }

  // ============================================================
  // SUPERIORES ÊNFASE OMBRO
  // ============================================================
  else if (foco === 'superior_ombro') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Ombro Heavy + Peito', grupos: 'Deltóide Completo + Peitoral', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config, true), ex(EX.peito[0], config), ex(EX.trapezio[2], config), ex(EX.triceps[2], config)], obs: 'Todos os 3 feixes do deltóide — essencial para correção de proporção.' })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps + Ombro Posterior', grupos: 'Pull + Deltóide Posterior', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.deltoide[3], config, true), ex(EX.trapezio[2], config), ex(EX.biceps[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Ombro Heavy', grupos: 'Deltóide Anterior + Médio', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[4], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[5], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Ombro Posterior + Trapézio', grupos: 'Deltóide Posterior + Trapézio Médio', exercicios: [ex(EX.deltoide[3], config, true), ex(EX.trapezio[2], config, true), ex(EX.deltoide[4], config), ex(EX.trapezio[1], config), ex(EX.deltoide[1], config)], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Ombro Heavy', grupos: 'Deltóide Anterior + Médio', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[4], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[5], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Ombro Posterior + Trapézio', grupos: 'Deltóide Posterior + Trapézio Médio', exercicios: [ex(EX.deltoide[3], config, true), ex(EX.trapezio[2], config, true), ex(EX.deltoide[4], config), ex(EX.trapezio[1], config), ex(EX.deltoide[1], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[0], config)], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Ombro Heavy', grupos: 'Deltóide Anterior + Médio', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[4], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[5], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Ombro Posterior', grupos: 'Deltóide Posterior + Trapézio', exercicios: [ex(EX.deltoide[3], config, true), ex(EX.trapezio[2], config, true), ex(EX.deltoide[4], config), ex(EX.trapezio[1], config), ex(EX.deltoide[1], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Ombro Volume + Core', grupos: 'Deltóide Completo + Core', exercicios: [ex(EX.deltoide[2], config, true), ex(EX.deltoide[1], config), ex(EX.deltoide[5], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  // ============================================================
  // SUPERIOR + INFERIOR — FULL BODY COM ÊNFASES
  // ============================================================
  else if (foco === 'full_gluteo') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Inferior + Glúteo', grupos: 'Glúteo + Isquiotibiais + Quadríceps', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.quadriceps[0], config), ex(EX.ischiotibiais[0], config), ex(EX.gluteo_medio[0], config), ex(EX.panturrilha[0], config)], obs: 'Hip thrust primeiro — máxima ativação de glúteo antes da fadiga.' })
      semana.push({ dia: 2, nome: 'TREINO B — Superior + Glúteo', grupos: 'Peito + Costas + Ombro + Glúteo', exercicios: [ex(EX.peito[0], config, true), ex(EX.dorsal[0], config, true), ex(EX.deltoide[0], config), ex(EX.gluteo[0], config, true), ex(EX.gluteo[1], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: 'Sessão full body com ênfase em glúteo.' })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Inferior Glúteo', grupos: 'Glúteo + Isquiotibiais', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[1], config, true), ex(EX.ischiotibiais[0], config), ex(EX.gluteo_medio[0], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior', grupos: 'Peito + Costas + Ombro', exercicios: [ex(EX.peito[0], config, true), ex(EX.dorsal[0], config, true), ex(EX.deltoide[0], config), ex(EX.biceps[0], config), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Full Body + Glúteo', grupos: 'Full Body + Ênfase Glúteo', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.quadriceps[0], config), ex(EX.peito[1], config), ex(EX.dorsal[2], config), ex(EX.gluteo_medio[2], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Inferior Glúteo', grupos: 'Glúteo + Isquiotibiais', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[2], config), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo_medio[0], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior Push', grupos: 'Peito + Ombro + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Inferior Quadríceps + Glúteo', grupos: 'Quadríceps + Glúteo', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.gluteo[1], config, true), ex(EX.quadriceps[2], config), ex(EX.gluteo_medio[2], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Superior Pull + Core', grupos: 'Costas + Bíceps + Core', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.trapezio[2], config), ex(EX.abdomen[1], config, false, 3, '15')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Glúteo', grupos: 'Glúteo Máximo + Médio', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[1], config, true), ex(EX.gluteo_medio[0], config), ex(EX.gluteo[5], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior Push', grupos: 'Peito + Ombro + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Inferior Posterior', grupos: 'Isquiotibiais + Glúteo', exercicios: [ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[2], config, true), ex(EX.ischiotibiais[2], config), ex(EX.gluteo_medio[2], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Superior Pull', grupos: 'Costas + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.trapezio[1], config), ex(EX.biceps[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Full Body + Core', grupos: 'Full + Core', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.peito[4], config), ex(EX.quadriceps[2], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  else if (foco === 'full_perna') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Inferior Perna', grupos: 'Quadríceps + Isquiotibiais + Panturrilha', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.quadriceps[2], config), ex(EX.ischiotibiais[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior + Perna Finalizador', grupos: 'Peito + Costas + Ombro + Perna', exercicios: [ex(EX.peito[0], config, true), ex(EX.dorsal[0], config, true), ex(EX.deltoide[0], config), ex(EX.quadriceps[4], config), ex(EX.ischiotibiais[1], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Quadríceps', grupos: 'Anterior da Coxa', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[1], config), ex(EX.quadriceps[2], config), ex(EX.quadriceps[5], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior', grupos: 'Peito + Costas + Ombro', exercicios: [ex(EX.peito[0], config, true), ex(EX.dorsal[0], config, true), ex(EX.deltoide[0], config), ex(EX.biceps[0], config), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Isquiotibiais + Full', grupos: 'Posterior + Integração', exercicios: [ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[1], config, true), ex(EX.quadriceps[3], config), ex(EX.panturrilha[2], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Quadríceps', grupos: 'Anterior da Coxa', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[3], config), ex(EX.quadriceps[2], config), ex(EX.quadriceps[5], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior Push', grupos: 'Peito + Ombro + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Isquiotibiais', grupos: 'Posterior da Coxa + Glúteo', exercicios: [ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[1], config, true), ex(EX.gluteo[0], config), ex(EX.ischiotibiais[2], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Superior Pull + Core', grupos: 'Costas + Bíceps + Core', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.trapezio[2], config), ex(EX.abdomen[1], config, false, 3, '15')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Quadríceps Heavy', grupos: 'Anterior da Coxa', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[3], config), ex(EX.quadriceps[1], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior Push', grupos: 'Peito + Ombro + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Isquiotibiais Heavy', grupos: 'Posterior da Coxa', exercicios: [ex(EX.ischiotibiais[1], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.ischiotibiais[2], config), ex(EX.gluteo[0], config), ex(EX.panturrilha[3], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Superior Pull', grupos: 'Costas + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.trapezio[1], config), ex(EX.biceps[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Full Body + Core', grupos: 'Integração + Core', exercicios: [ex(EX.quadriceps[4], config, true), ex(EX.peito[4], config), ex(EX.ischiotibiais[3], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  else if (foco === 'full_biceps') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas + Bíceps + Inferior', grupos: 'Dorsal + Bíceps + Quadríceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.quadriceps[0], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Ombro + Inferior + Bíceps', grupos: 'Push + Isquiotibiais + Bíceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.deltoide[0], config), ex(EX.ischiotibiais[0], config, true), ex(EX.biceps[1], config, true), ex(EX.triceps[2], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config, true), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais + Glúteo', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Push + Bíceps Isolado', grupos: 'Peito + Ombro + Bíceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.deltoide[1], config), ex(EX.biceps[1], config, true), ex(EX.biceps[4], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[2], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.biceps[3], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Bíceps Isolado + Ombro', grupos: 'Bíceps + Deltóide', exercicios: [ex(EX.biceps[1], config, true), ex(EX.biceps[3], config, true), ex(EX.biceps[4], config), ex(EX.deltoide[0], config), ex(EX.deltoide[1], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Peito + Tríceps + Core', grupos: 'Push + Core', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Bíceps Isolamento', grupos: 'Bíceps Foco Total', exercicios: [ex(EX.biceps[1], config, true), ex(EX.biceps[3], config, true), ex(EX.biceps[4], config), ex(EX.biceps[5], config), ex(EX.dorsal[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Peito + Ombro', grupos: 'Push Completo', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.deltoide[1], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Full + Core', grupos: 'Integração + Core', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.biceps[0], config), ex(EX.peito[4], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  else if (foco === 'full_triceps') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps + Inferior', grupos: 'Peitoral + Tríceps + Quadríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.triceps[0], config, true), ex(EX.triceps[3], config, true), ex(EX.quadriceps[0], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Bíceps + Inferior + Tríceps', grupos: 'Pull + Isquiotibiais + Tríceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.triceps[4], config, true), ex(EX.biceps[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps', grupos: 'Push + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[3], config, true), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais + Glúteo', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Costas + Tríceps Isolado', grupos: 'Costas + Tríceps + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.triceps[3], config, true), ex(EX.triceps[4], config), ex(EX.biceps[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps', grupos: 'Push + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[1], config), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Tríceps Isolamento', grupos: 'Tríceps Foco Total', exercicios: [ex(EX.triceps[3], config, true), ex(EX.triceps[4], config, true), ex(EX.triceps[2], config), ex(EX.peito[4], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Costas + Bíceps + Core', grupos: 'Pull + Core', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[1], config), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Tríceps Isolamento', grupos: 'Tríceps Foco Total', exercicios: [ex(EX.triceps[3], config, true), ex(EX.triceps[1], config, true), ex(EX.triceps[4], config), ex(EX.triceps[5], config), ex(EX.peito[4], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Costas + Bíceps', grupos: 'Pull', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.trapezio[1], config), ex(EX.biceps[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Full + Core', grupos: 'Integração + Core', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.triceps[2], config), ex(EX.peito[2], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
  }

  else if (foco === 'full_peito') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Inferior', grupos: 'Peitoral + Quadríceps + Glúteo', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config, true), ex(EX.quadriceps[0], config), ex(EX.gluteo[0], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Costas + Inferior + Peito', grupos: 'Pull + Isquiotibiais + Peito Finalizador', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.peito[2], config, true), ex(EX.biceps[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito Heavy', grupos: 'Peitoral + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[5], config), ex(EX.peito[2], config), ex(EX.triceps[0], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais + Glúteo', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Peito Superior + Costas', grupos: 'Peitoral Superior + Dorsal', exercicios: [ex(EX.peito[1], config, true), ex(EX.peito[3], config, true), ex(EX.dorsal[0], config), ex(EX.biceps[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito Heavy', grupos: 'Peitoral', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[5], config), ex(EX.peito[2], config), ex(EX.triceps[0], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Peito Superior + Ombro', grupos: 'Peitoral Superior + Deltóide', exercicios: [ex(EX.peito[1], config, true), ex(EX.peito[3], config, true), ex(EX.deltoide[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Costas + Bíceps + Core', grupos: 'Pull + Core', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito Médio', grupos: 'Peitoral Médio', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[2], config), ex(EX.peito[4], config), ex(EX.triceps[0], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Peito Superior', grupos: 'Peitoral Superior', exercicios: [ex(EX.peito[1], config, true), ex(EX.peito[3], config, true), ex(EX.peito[4], config), ex(EX.triceps[2], config), ex(EX.deltoide[1], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Costas + Bíceps', grupos: 'Pull', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.trapezio[1], config), ex(EX.biceps[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Peito Volume + Core', grupos: 'Peitoral + Core', exercicios: [ex(EX.peito[5], config, true), ex(EX.peito[2], config), ex(EX.peito[0], config), ex(EX.abdomen[4], config, false, 3, '12'), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
  }

  else if (foco === 'full_costas') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas Heavy + Inferior', grupos: 'Dorsal + Trapézio + Quadríceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config, true), ex(EX.trapezio[0], config), ex(EX.quadriceps[0], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Peito + Bíceps + Inferior + Costas', grupos: 'Push + Isquiotibiais + Costas Finalizador', exercicios: [ex(EX.peito[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.dorsal[3], config, true), ex(EX.biceps[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas Heavy + Bíceps', grupos: 'Dorsal + Trapézio + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config, true), ex(EX.trapezio[0], config), ex(EX.biceps[0], config), ex(EX.biceps[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais + Glúteo', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Costas Volume + Peito', grupos: 'Dorsal + Peitoral + Ombro', exercicios: [ex(EX.dorsal[3], config, true), ex(EX.trapezio[2], config, true), ex(EX.peito[0], config), ex(EX.deltoide[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas Heavy', grupos: 'Dorsal + Trapézio', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config, true), ex(EX.dorsal[2], config), ex(EX.trapezio[0], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Costas + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[3], config, true), ex(EX.trapezio[2], config, true), ex(EX.dorsal[4], config), ex(EX.biceps[0], config), ex(EX.biceps[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Peito + Ombro + Core', grupos: 'Push + Core', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Costas Heavy', grupos: 'Dorsal + Trapézio', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.dorsal[2], config), ex(EX.trapezio[1], config), ex(EX.trapezio[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Costas Volume + Bíceps', grupos: 'Dorsal + Bíceps', exercicios: [ex(EX.dorsal[3], config, true), ex(EX.dorsal[4], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Peito + Ombro', grupos: 'Push Completo', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.deltoide[1], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Costas Volume + Core', grupos: 'Full Pull + Core', exercicios: [ex(EX.dorsal[2], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[3], config), ex(EX.abdomen[4], config, false, 3, '12'), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
  }

  else if (foco === 'full_ombro') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Ombro + Superior + Inferior', grupos: 'Deltóide + Peito + Quadríceps', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config, true), ex(EX.peito[0], config), ex(EX.quadriceps[0], config), ex(EX.panturrilha[0], config)], obs: 'Ombro primeiro — máxima ativação antes da fadiga acumular.' })
      semana.push({ dia: 2, nome: 'TREINO B — Ombro Posterior + Costas + Inferior', grupos: 'Deltóide Posterior + Dorsal + Isquiotibiais', exercicios: [ex(EX.deltoide[3], config, true), ex(EX.trapezio[2], config, true), ex(EX.dorsal[0], config), ex(EX.ischiotibiais[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Ombro Heavy + Peito', grupos: 'Deltóide + Peitoral', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config), ex(EX.peito[0], config), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais + Glúteo', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Ombro Posterior + Costas', grupos: 'Deltóide Posterior + Trapézio + Costas', exercicios: [ex(EX.deltoide[3], config, true), ex(EX.trapezio[2], config, true), ex(EX.dorsal[0], config), ex(EX.biceps[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Ombro Heavy', grupos: 'Deltóide Completo', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[4], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Costas + Bíceps + Core', grupos: 'Pull + Core', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Ombro Heavy', grupos: 'Deltóide Anterior + Médio', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[4], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[5], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Ombro Posterior', grupos: 'Deltóide Posterior + Trapézio', exercicios: [ex(EX.deltoide[3], config, true), ex(EX.trapezio[2], config, true), ex(EX.deltoide[4], config), ex(EX.trapezio[1], config), ex(EX.deltoide[1], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Peito + Costas', grupos: 'Push + Pull', exercicios: [ex(EX.peito[0], config, true), ex(EX.dorsal[0], config, true), ex(EX.triceps[0], config), ex(EX.biceps[0], config), ex(EX.deltoide[0], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Ombro Volume + Core', grupos: 'Deltóide Completo + Core', exercicios: [ex(EX.deltoide[2], config, true), ex(EX.deltoide[1], config), ex(EX.deltoide[5], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  else if (foco === 'full_inferior') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Inferior Completo', grupos: 'Quadríceps + Glúteo + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.gluteo[0], config, true), ex(EX.ischiotibiais[0], config), ex(EX.gluteo_medio[0], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior + Inferior Finalizador', grupos: 'Peito + Costas + Ombro + Inferior', exercicios: [ex(EX.peito[0], config, true), ex(EX.dorsal[0], config, true), ex(EX.deltoide[0], config), ex(EX.quadriceps[2], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Inferior Posterior', grupos: 'Glúteo + Isquiotibiais', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[2], config), ex(EX.ischiotibiais[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior', grupos: 'Peito + Costas + Ombro', exercicios: [ex(EX.peito[0], config, true), ex(EX.dorsal[0], config, true), ex(EX.deltoide[0], config), ex(EX.biceps[0], config), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Inferior Anterior + Core', grupos: 'Quadríceps + Panturrilha + Core', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[2], config), ex(EX.gluteo[1], config), ex(EX.panturrilha[2], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Inferior Posterior', grupos: 'Glúteo + Isquiotibiais', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[2], config), ex(EX.ischiotibiais[2], config), ex(EX.gluteo_medio[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior Push', grupos: 'Peito + Ombro + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Inferior Anterior', grupos: 'Quadríceps + Panturrilha', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.quadriceps[1], config), ex(EX.quadriceps[2], config), ex(EX.gluteo[1], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Superior Pull + Core', grupos: 'Costas + Bíceps + Core', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Glúteo', grupos: 'Glúteo Máximo + Médio', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.gluteo[1], config, true), ex(EX.gluteo_medio[0], config), ex(EX.gluteo[5], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Superior Push', grupos: 'Peito + Ombro + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Quadríceps + Isquiotibiais', grupos: 'Anterior + Posterior', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.quadriceps[2], config), ex(EX.ischiotibiais[2], config), ex(EX.panturrilha[2], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Superior Pull', grupos: 'Costas + Bíceps', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.trapezio[1], config), ex(EX.biceps[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Full + Core', grupos: 'Integração + Core', exercicios: [ex(EX.gluteo[0], config, true), ex(EX.peito[4], config), ex(EX.quadriceps[2], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  else if (foco === 'full_superior') {
    if (dias === 2) {
      semana.push({ dia: 1, nome: 'TREINO A — Push + Inferior', grupos: 'Peito + Ombro + Tríceps + Quadríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.quadriceps[0], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Pull + Inferior', grupos: 'Costas + Bíceps + Isquiotibiais', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.biceps[0], config, true), ex(EX.trapezio[2], config), ex(EX.ischiotibiais[0], config), ex(EX.abdomen[0], config, false, 3, '30s')], obs: null })
    }
    if (dias === 3) {
      semana.push({ dia: 1, nome: 'TREINO A — Superior Push', grupos: 'Peito + Ombro + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais + Glúteo', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Superior Pull + Ombro', grupos: 'Costas + Bíceps + Deltóide', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.deltoide[1], config), ex(EX.trapezio[2], config)], obs: null })
    }
    if (dias === 4) {
      semana.push({ dia: 1, nome: 'TREINO A — Superior Push', grupos: 'Peito + Ombro + Tríceps', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.deltoide[0], config), ex(EX.triceps[0], config, true), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Superior Pull', grupos: 'Costas + Bíceps + Trapézio', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config, true), ex(EX.biceps[0], config), ex(EX.biceps[2], config), ex(EX.trapezio[0], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Ombro + Core', grupos: 'Deltóide Completo + Core', exercicios: [ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config, true), ex(EX.deltoide[0], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
    if (dias === 5) {
      semana.push({ dia: 1, nome: 'TREINO A — Peito + Tríceps', grupos: 'Push', exercicios: [ex(EX.peito[0], config, true), ex(EX.peito[1], config), ex(EX.triceps[0], config, true), ex(EX.triceps[1], config), ex(EX.triceps[2], config)], obs: null })
      semana.push({ dia: 2, nome: 'TREINO B — Inferior', grupos: 'Quadríceps + Isquiotibiais + Glúteo', exercicios: [ex(EX.quadriceps[0], config, true), ex(EX.ischiotibiais[0], config, true), ex(EX.gluteo[0], config), ex(EX.quadriceps[2], config), ex(EX.panturrilha[0], config)], obs: null })
      semana.push({ dia: 3, nome: 'TREINO C — Costas + Bíceps', grupos: 'Pull', exercicios: [ex(EX.dorsal[0], config, true), ex(EX.dorsal[1], config), ex(EX.biceps[0], config, true), ex(EX.biceps[2], config), ex(EX.trapezio[1], config)], obs: null })
      semana.push({ dia: 4, nome: 'TREINO D — Ombro Completo', grupos: 'Deltóide Completo', exercicios: [ex(EX.deltoide[0], config, true), ex(EX.deltoide[1], config, true), ex(EX.deltoide[3], config), ex(EX.trapezio[0], config), ex(EX.trapezio[2], config)], obs: null })
      semana.push({ dia: 5, nome: 'TREINO E — Full + Core', grupos: 'Integração + Core', exercicios: [ex(EX.peito[4], config, true), ex(EX.dorsal[3], config, true), ex(EX.deltoide[4], config), ex(EX.abdomen[1], config, false, 3, '15'), ex(EX.abdomen[4], config, false, 3, '12')], obs: null })
    }
  }

  return semana
}

const CIENCIA = {
  iniciante: 'Volume inicial: 10-15 séries por grupo/semana. Repetições 10-12 com técnica prioritária. Schoenfeld (2017): iniciantes respondem bem a volumes moderados com ênfase em aprendizado neuromuscular. Descanso de 60-90s favorece adaptação metabólica.',
  intermediario: 'Volume de 15-20 séries por grupo/semana (Krieger, 2010). Métodos avançados (drop set, rest-pause) aumentam estresse metabólico sem volume excessivo (Goto et al., 2004). Repetições 8-12 na zona ideal de hipertrofia (Schoenfeld, 2010).',
  avancado: 'Volume de 20+ séries por grupo/semana. Cluster sets preservam força com alto volume. Método 3/7 (Maton et al., 2012) demonstrou maior hipertrofia vs série tradicional. Rest-pause amplia tempo sob tensão com alta carga.'
}

const NIVEL_LABELS = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' }

const FOCO_LABELS = {
  inferiores: 'Membros Inferiores',
  inferiores_gluteo: 'Inferiores — Ênfase Glúteo',
  inferiores_perna: 'Inferiores — Ênfase Perna',
  superiores: 'Membros Superiores',
  superiores_biceps: 'Superiores — Ênfase Bíceps',
  superiores_triceps: 'Superiores — Ênfase Tríceps',
  superiores_peito: 'Superiores — Ênfase Peito',
  superiores_costas: 'Superiores — Ênfase Costas',
  superior_ombro: 'Superiores — Ênfase Ombro',
  full_gluteo: 'Superior + Inferior — Ênfase Glúteo',
  full_perna: 'Superior + Inferior — Ênfase Perna',
  full_biceps: 'Superior + Inferior — Ênfase Bíceps',
  full_triceps: 'Superior + Inferior — Ênfase Tríceps',
  full_peito: 'Superior + Inferior — Ênfase Peito',
  full_costas: 'Superior + Inferior — Ênfase Costas',
  full_ombro: 'Superior + Inferior — Ênfase Ombro',
  full_inferior: 'Superior + Inferior — Foco Inferior',
  full_superior: 'Superior + Inferior — Foco Superior',
}

export function gerarTreino({ nivel, foco, dias, nomeAluno }) {
  const config = getConfig(nivel)
  const semana = gerarDias(foco, dias, config)
  return {
    nomeAluno,
    nivel,
    nivelLabel: NIVEL_LABELS[nivel],
    foco,
    focoLabel: FOCO_LABELS[foco],
    dias,
    semana,
    baseciencia: CIENCIA[nivel],
    referencias: REFERENCIAS,
    dataGeracao: new Date().toLocaleDateString('pt-BR'),
  }
}
