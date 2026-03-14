-- =============================================
-- GUIA DE ATIVAÇÃO MUSCULAR — Bertoldo Performance
-- Rodar no Supabase Dashboard → SQL Editor
-- =============================================

-- Tabela de grupos musculares
CREATE TABLE IF NOT EXISTS muscle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '💪',
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de exercícios
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  muscle_group_id UUID REFERENCES muscle_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  activation_pct INTEGER DEFAULT 70 CHECK (activation_pct BETWEEN 1 AND 100),
  secondary_muscles TEXT,
  scientific_note TEXT,
  reference TEXT,
  media_url TEXT,
  video_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS — acesso público de leitura
ALTER TABLE muscle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_groups" ON muscle_groups FOR SELECT USING (true);
CREATE POLICY "public_read_exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "all_write_groups" ON muscle_groups FOR ALL USING (true);
CREATE POLICY "all_write_exercises" ON exercises FOR ALL USING (true);

-- Storage para mídias
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_media_read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "public_media_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "public_media_update" ON storage.objects FOR UPDATE USING (bucket_id = 'media');
CREATE POLICY "public_media_delete" ON storage.objects FOR DELETE USING (bucket_id = 'media');

-- =============================================
-- SEED: Grupos Musculares
-- =============================================
INSERT INTO muscle_groups (name, emoji, description, sort_order) VALUES
('Glúteo Máximo', '🍑', 'O maior músculo do corpo humano. Principal extensor e rotador externo do quadril. Estudos EMG mostram alta variação de ativação conforme o exercício.', 1),
('Glúteo Médio', '🦋', 'Fundamental para estabilização pélvica e abdução do quadril. Sua fraqueza está associada a lesões no joelho, quadril e lombar.', 2),
('Quadríceps', '🦵', 'Composto por 4 cabeças: reto femoral, vasto lateral, vasto medial e vasto intermédio. Principal extensor do joelho.', 3),
('Isquiotibiais', '🔙', 'Grupo com bíceps femoral, semitendíneo e semimembranoso. Flexores do joelho e extensores do quadril.', 4),
('Peitoral', '💪', 'Dividido em porção clavicular (superior), esternal (média) e costal (inferior). Responsável pela adução e flexão do úmero.', 5),
('Dorsal (Latíssimo)', '🏊', 'Principal músculo das costas, responsável pela adução, extensão e rotação interna do úmero. Fundamental para a largura do dorso.', 6),
('Trapézio e Rombóides', '🎯', 'Trapézio com 3 porções: superior (elevação), médio (retração) e inferior (depressão). Rombóides atuam na retração escapular.', 7),
('Deltóide', '🎽', 'Três feixes: anterior (flexão), médio (abdução) e posterior (extensão). Cada feixe exige exercícios específicos.', 8),
('Bíceps Braquial', '💪', 'Músculo biarticular com cabeça longa e curta. Responsável pela flexão do cotovelo e supinação do antebraço.', 9),
('Tríceps Braquial', '🔱', 'Três cabeças: longa (biarticular), lateral e medial. Extensores do cotovelo. A posição do ombro influencia o recrutamento.', 10),
('Panturrilha', '🦶', 'Gastrocnêmio (biarticular, dominante com joelhos estendidos) e Sóleo (monoarticular, dominante com joelhos flexionados).', 11),
('Abdômen e Core', '⚡', 'Reto abdominal (flexão do tronco), oblíquos (rotação e flexão lateral) e transverso (estabilização profunda do core).', 12),
('Eretores da Espinha', '🏗', 'Conjunto de músculos paravertebrais que realizam extensão, flexão lateral e rotação da coluna. Fundamentais para postura.', 13);

-- =============================================
-- SEED: Exercícios por grupo
-- (Inserido dinamicamente após grupos)
-- =============================================
DO $$
DECLARE
  g_gluteo_max UUID;
  g_gluteo_med UUID;
  g_quad UUID;
  g_isch UUID;
  g_peit UUID;
  g_dorsal UUID;
  g_trap UUID;
  g_delt UUID;
  g_biceps UUID;
  g_triceps UUID;
  g_pant UUID;
  g_abd UUID;
  g_eret UUID;
BEGIN
  SELECT id INTO g_gluteo_max FROM muscle_groups WHERE name = 'Glúteo Máximo';
  SELECT id INTO g_gluteo_med FROM muscle_groups WHERE name = 'Glúteo Médio';
  SELECT id INTO g_quad FROM muscle_groups WHERE name = 'Quadríceps';
  SELECT id INTO g_isch FROM muscle_groups WHERE name = 'Isquiotibiais';
  SELECT id INTO g_peit FROM muscle_groups WHERE name = 'Peitoral';
  SELECT id INTO g_dorsal FROM muscle_groups WHERE name = 'Dorsal (Latíssimo)';
  SELECT id INTO g_trap FROM muscle_groups WHERE name = 'Trapézio e Rombóides';
  SELECT id INTO g_delt FROM muscle_groups WHERE name = 'Deltóide';
  SELECT id INTO g_biceps FROM muscle_groups WHERE name = 'Bíceps Braquial';
  SELECT id INTO g_triceps FROM muscle_groups WHERE name = 'Tríceps Braquial';
  SELECT id INTO g_pant FROM muscle_groups WHERE name = 'Panturrilha';
  SELECT id INTO g_abd FROM muscle_groups WHERE name = 'Abdômen e Core';
  SELECT id INTO g_eret FROM muscle_groups WHERE name = 'Eretores da Espinha';

  -- GLÚTEO MÁXIMO
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_gluteo_max, 'Hip Thrust (Elevação Pélvica)', 87, 'Isquiotibiais, Eretores', 'Maior ativação do glúteo máximo documentada. Posição de extensão completa maximiza o recrutamento.', 'Contreras et al. (2015) — J Strength Cond Res'),
  (g_gluteo_max, 'Agachamento Profundo (ATG)', 78, 'Quadríceps, Adutores', 'Profundidade acima de 90° aumenta ativação do glúteo vs. agachamento parcial.', 'Caterisano et al. (2002) — J Strength Cond Res'),
  (g_gluteo_max, 'Stiff-Leg Deadlift', 72, 'Eretores, Isquiotibiais', 'Alta ativação de glúteo e cadeia posterior. Joelhos levemente flexionados.', 'Contreras et al. (2010) — J Strength Cond Res'),
  (g_gluteo_max, 'Agachamento Búlgaro', 70, 'Quadríceps, Adutores', 'Posição unilateral com tronco inclinado à frente potencializa recrutamento glúteo.', 'Speirs et al. (2016) — J Strength Cond Res'),
  (g_gluteo_max, 'Leg Press (pés altos e afastados)', 65, 'Quadríceps, Adutores', 'Posicionamento dos pés mais alto e afastado direciona ativação ao glúteo.', 'Escamilla et al. (2001) — Med Sci Sports Exerc'),
  (g_gluteo_max, 'Kickback na Polia', 62, 'Isquiotibiais', 'Isolamento eficiente em extensão de quadril. Útil como exercício complementar finalizador.', 'Contreras EMG Study (2013)');

  -- GLÚTEO MÉDIO
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_gluteo_med, 'Abdução Lateral com Elástico (em pé)', 81, 'TFL, Glúteo Máximo', 'Exercício de isolamento com altíssima ativação. Ideal para reabilitação e hipertrofia.', 'Selkowitz et al. (2013) — J Orthop Sports Phys Ther'),
  (g_gluteo_med, 'Clamshell com Elástico', 76, 'Rotadores externos do quadril', 'Rotação externa com quadril flexionado recruta predominantemente glúteo médio.', 'Boren et al. (2011) — J Orthop Sports Phys Ther'),
  (g_gluteo_med, 'Hip Thrust Unilateral', 73, 'Glúteo Máximo, Isquiotibiais', 'Versão unilateral amplifica ativação de glúteo médio como estabilizador.', 'Contreras et al. (2015) — J Strength Cond Res'),
  (g_gluteo_med, 'Single Leg Squat', 68, 'Quadríceps, Eretores', 'Alta demanda de estabilização pélvica ativa glúteo médio como sinergista.', 'Stastny et al. (2016) — J Hum Kinet'),
  (g_gluteo_med, 'Agachamento Lateral', 70, 'Quadríceps, Adutores', 'Movimento frontal em plano sagital com ativação bilateral do glúteo médio.', 'Lubahn et al. (2011) — N Am J Sports Phys Ther');

  -- QUADRÍCEPS
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_quad, 'Agachamento Livre (back squat)', 88, 'Glúteo, Isquiotibiais, Core', 'Exercício rainha do quadríceps. Variações de postura alteram distribuição entre as cabeças.', 'Escamilla et al. (1998) — Med Sci Sports Exerc'),
  (g_quad, 'Cadeira Extensora', 86, '—', 'Isolamento superior do quadríceps. Ângulo de 90° a 40° apresenta maior ativação do VMO.', 'Signorile et al. (1995) — J Strength Cond Res'),
  (g_quad, 'Leg Press 45°', 82, 'Glúteo, Adutores', 'Pés baixos e próximos maximizam ativação de quadríceps. Alta carga absoluta possível.', 'Escamilla et al. (2001) — Med Sci Sports Exerc'),
  (g_quad, 'Hack Squat', 80, 'Glúteo, Isquiotibiais', 'Posição vertical do tronco favorece ativação anterior. Menos impacto na lombar.', 'Boyden et al. (2000) — J Strength Cond Res'),
  (g_quad, 'Agachamento Búlgaro', 78, 'Glúteo, Adutores', 'Unilateral com maior amplitude. Reto femoral e vasto lateral altamente recrutados.', 'Speirs et al. (2016) — J Strength Cond Res'),
  (g_quad, 'Avanço (Lunge) com Passada', 75, 'Glúteo, Isquiotibiais', 'Fase excêntrica com alta demanda de quadríceps. Tronco ereto enfatiza o reto femoral.', 'Farrokhi et al. (2008) — J Orthop Sports Phys Ther');

  -- ISQUIOTIBIAIS
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_isch, 'Nordic Hamstring Curl', 92, 'Gastrocnêmio, Glúteo', 'Exercício excêntrico com EMG mais alto já registrado para isquiotibiais. Previne lesões.', 'Mjolsnes et al. (2004) — Scand J Med Sci Sports'),
  (g_isch, 'Deadlift Romeno (RDL)', 85, 'Glúteo Máximo, Eretores', 'Maior ativação de isquiotibiais por elongação máxima com carga. Técnica é crucial.', 'Contreras et al. (2010) — J Strength Cond Res'),
  (g_isch, 'Flexora Deitada (Leg Curl)', 80, 'Gastrocnêmio', 'Isolamento com flexão de joelho. Posição prona favorece bíceps femoral.', 'Onishi et al. (2002) — J Electromyogr Kinesiol'),
  (g_isch, 'Flexora em Pé (Unilateral)', 78, 'Gastrocnêmio', 'Unilateral permite melhor controle e pode apresentar maior ativação proporcional.', 'Onishi et al. (2002) — J Electromyogr Kinesiol'),
  (g_isch, 'Good Morning', 74, 'Eretores, Glúteo', 'Alta ativação por extensão do quadril com joelhos levemente flexionados e carga axial.', 'Schellenberg et al. (2013) — J Strength Cond Res');

  -- PEITORAL
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_peit, 'Supino Reto com Barra', 85, 'Tríceps, Deltóide Anterior', 'Exercício base do peitoral médio. Amplitude completa aumenta ativação.', 'Lauver et al. (2016) — J Strength Cond Res'),
  (g_peit, 'Supino Inclinado com Halteres', 83, 'Deltóide Anterior, Tríceps', 'Inclinação de 30-45° maximiza recrutamento da porção clavicular (superior).', 'Trebs et al. (2010) — J Strength Cond Res'),
  (g_peit, 'Crucifixo na Máquina (Peck Deck)', 78, 'Deltóide Anterior', 'Comparável ao crucifixo livre. Tensão constante durante todo o arco.', 'Saeterbakken et al. (2011) — J Hum Kinet'),
  (g_peit, 'Crossover na Polia (baixo para cima)', 80, 'Deltóide Anterior, Serrátil', 'Direção ascendente ativa predominantemente o feixe clavicular (superior).', 'Calatayud et al. (2015) — J Hum Kinet'),
  (g_peit, 'Crucifixo com Halteres', 76, 'Deltóide Anterior, Bíceps', 'Isolamento com alta elongação. Ativação superior com cotovelos levemente flexionados.', 'Barnett et al. (1995) — J Strength Cond Res'),
  (g_peit, 'Supino Declinado', 77, 'Tríceps, Peitoral Inferior', 'Ativa preferencialmente as fibras inferiores do peitoral costal.', 'Lauver et al. (2016) — J Strength Cond Res');

  -- DORSAL
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_dorsal, 'Barra Fixa (pegada pronada larga)', 90, 'Bíceps, Rombóides, Infraespinhoso', 'Exercício com maior ativação de dorsal registrada em EMG. Amplitude completa é essencial.', 'Ronai & Scibek (2014) — NSCA Strength & Conditioning'),
  (g_dorsal, 'Remada Curvada com Barra', 85, 'Rombóides, Trapézio Médio, Bíceps', 'Alta ativação de toda a região dorsal. Cotovelos próximos ao corpo favorecem o latíssimo.', 'Fenwick et al. (2009) — J Strength Cond Res'),
  (g_dorsal, 'Puxada Frontal (Lat Pulldown)', 82, 'Bíceps, Rombóides, Infraespinhoso', 'Alternativa à barra fixa. Pegada supinada estreita aumenta ativação do bíceps.', 'Lehman et al. (2004) — J Strength Cond Res'),
  (g_dorsal, 'Remada Unilateral com Halter', 80, 'Rombóides, Bíceps, Deltóide Posterior', 'Maior amplitude de movimento unilateral. Rotação do tronco amplifica recrutamento.', 'Fenwick et al. (2009) — J Strength Cond Res'),
  (g_dorsal, 'Pullover com Halter', 72, 'Peitoral, Serrátil, Tríceps', 'Exercício único que integra peitoral e dorsal. Maior ativação de latíssimo no ponto de alongamento.', 'Marchetti et al. (2010) — J Electromyogr Kinesiol');

  -- TRAPÉZIO
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_trap, 'Encolhimento de Ombros (Shrug)', 90, 'Elevadores da escápula', 'Isolamento máximo do trapézio superior. Rotação do ombro no topo aumenta ativação.', 'Cools et al. (2007) — Br J Sports Med'),
  (g_trap, 'Remada Baixa Fechada (Seated Row)', 80, 'Rombóides, Latíssimo, Bíceps', 'Contração na retração máxima ativa intensamente trapézio médio e rombóides.', 'Fenwick et al. (2009) — J Strength Cond Res'),
  (g_trap, 'Face Pull na Polia', 78, 'Deltóide Posterior, Infraespinhoso', 'Excelente para trapézio médio/inferior e saúde do manguito rotador.', 'Cools et al. (2007) — Br J Sports Med'),
  (g_trap, 'Remada Alta com Barra', 85, 'Deltóide Médio, Bíceps', 'Alta ativação de trapézio médio/superior. Cuidado com a altura do puxão.', 'NSCA Shoulder EMG Review (2015)');

  -- DELTÓIDE
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_delt, 'Desenvolvimento com Halteres', 84, 'Trapézio Superior, Tríceps', 'Ativação balanceada dos 3 feixes. Mais recrutamento de deltóide médio que com barra.', 'Saeterbakken & Fimland (2013) — J Strength Cond Res'),
  (g_delt, 'Elevação Lateral com Halteres', 82, 'Trapézio Superior, Supra-espinhoso', 'Isolamento do feixe médio. Leve inclinação à frente (30°) maximiza recrutamento.', 'Coratella et al. (2020) — Int J Environ Res Public Health'),
  (g_delt, 'Crucifixo Invertido (Reverse Fly)', 80, 'Infraespinhoso, Rombóides', 'Principal exercício para feixe posterior. Cotovelos levemente flexionados.', 'Cools et al. (2007) — Br J Sports Med'),
  (g_delt, 'Desenvolvimento Arnold', 81, 'Trapézio, Tríceps, Peitoral', 'Rotação durante o movimento ativa todos os feixes em arco amplo.', 'Saeterbakken & Fimland (2013) — J Strength Cond Res'),
  (g_delt, 'Elevação Lateral na Polia Baixa', 78, 'Trapézio Superior', 'Tensão constante durante todo o arco de movimento, superior à versão com halter.', 'Coratella et al. (2020) — Int J Environ Res Public Health'),
  (g_delt, 'Elevação Frontal', 79, 'Peitoral Superior, Trapézio', 'Isolamento do feixe anterior. Pegada neutra reduz impacto no manguito.', 'Coratella et al. (2020) — Int J Environ Res Public Health');

  -- BÍCEPS
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_biceps, 'Rosca Concentrada', 88, 'Braquial', 'Maior pico de ativação do bíceps em estudos EMG. Cotovelo apoiado isola o movimento.', 'ACE-sponsored EMG Study — Bret Contreras (2014)'),
  (g_biceps, 'Rosca no Banco Scott', 86, 'Braquial, Braquiorradial', 'Ombro em flexão aumenta tensão na cabeça longa. Alta ativação no ponto de alongamento.', 'Oliveira et al. (2009) — J Electromyogr Kinesiol'),
  (g_biceps, 'Rosca Direta com Barra', 85, 'Braquial, Braquiorradial', 'Exercício base de bíceps. Pegada supinada durante todo o movimento maximiza ativação.', 'Oliveira et al. (2009) — J Electromyogr Kinesiol'),
  (g_biceps, 'Rosca Inclinada com Halteres', 82, 'Braquial', 'Ombro em extensão máxima aumenta o alongamento da cabeça longa do bíceps.', 'Oliveira et al. (2009) — J Electromyogr Kinesiol'),
  (g_biceps, 'Rosca na Polia Baixa', 80, 'Braquial, Braquiorradial', 'Tensão constante e curva de força favorável. Útil como último exercício do treino.', 'Calatayud et al. (2015) — J Hum Kinet'),
  (g_biceps, 'Rosca Martelo com Halteres', 75, 'Braquiorradial, Braquial', 'Posição neutra enfatiza braquiorradial e braquial. Menor ativação de bíceps braquial.', 'Oliveira et al. (2009) — J Electromyogr Kinesiol');

  -- TRÍCEPS
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_triceps, 'Mergulho (Dip) em Paralelas', 88, 'Peitoral Inferior, Deltóide Anterior', 'Maior carga absoluta para tríceps. Tronco ereto enfatiza tríceps vs. peitoral.', 'Calatayud et al. (2015) — J Hum Kinet'),
  (g_triceps, 'Tríceps Testa (Skull Crusher)', 87, 'Anconeo', 'Alta ativação de todas as cabeças. Barra EZ reduz estresse no punho.', 'Boeckh-Behrens & Buskies (2000) — Fitness-Krafttraining'),
  (g_triceps, 'Tríceps Francês (Overhead)', 86, '—', 'Ombro em flexão alonga a cabeça longa, maximizando seu recrutamento.', 'Boeckh-Behrens & Buskies (2000) — Fitness-Krafttraining'),
  (g_triceps, 'Supino Fechado', 85, 'Peitoral, Deltóide Anterior', 'Pegada estreita (mãos a ~20cm) ativa preferencialmente tríceps vs. peitoral.', 'Barnett et al. (1995) — J Strength Cond Res'),
  (g_triceps, 'Tríceps Pulley (Polia Alta)', 83, 'Anconeo', 'Carga constante durante toda a extensão. Cotovelos fixos maximizam isolamento.', 'Boeckh-Behrens & Buskies (2000) — Fitness-Krafttraining'),
  (g_triceps, 'Tríceps Coice (Kickback)', 70, 'Anconeo', 'Isolamento eficiente mas com limitação de carga. Útil como exercício finalizador.', 'Boeckh-Behrens & Buskies (2000) — Fitness-Krafttraining');

  -- PANTURRILHA
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_pant, 'Elevação de Calcanhares em Pé (Standing Calf Raise)', 88, 'Sóleo, Tibial Posterior', 'Joelho estendido maximiza ativação do gastrocnêmio. Amplitude completa é essencial.', 'Riemann et al. (2011) — J Strength Cond Res'),
  (g_pant, 'Elevação Unilateral com Halter', 85, 'Tibial Posterior', 'Maior recrutamento por instabilidade. Melhor controle da amplitude de movimento.', 'Riemann et al. (2011) — J Strength Cond Res'),
  (g_pant, 'Elevação no Leg Press', 82, 'Sóleo, Gastrocnêmio Medial', 'Permite alta sobrecarga. Posição do joelho determina qual músculo é mais recrutado.', 'Riemann et al. (2011) — J Strength Cond Res'),
  (g_pant, 'Elevação Sentado (Seated Calf Raise)', 80, 'Flexores dos dedos', 'Joelho flexionado a 90° recruta preferencialmente o sóleo. Exercício complementar.', 'Riemann et al. (2011) — J Strength Cond Res');

  -- ABDÔMEN
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_abd, 'Abdominal na Polia (Rope Crunch)', 84, 'Oblíquos, Psoas', 'Permite progressão de carga sistematicamente. Alta ativação com carga moderada.', 'Escamilla et al. (2006) — J Orthop Sports Phys Ther'),
  (g_abd, 'Abdominal Infra (Elevação de Pernas)', 82, 'Iliopsoas, TFL', 'Maior ativação da porção inferior do reto abdominal. Joelhos estendidos aumentam dificuldade.', 'Escamilla et al. (2006) — J Orthop Sports Phys Ther'),
  (g_abd, 'Giro Russo (Russian Twist)', 78, 'Oblíquo Interno, Quadrado Lombar', 'Principal exercício para oblíquos. Pés suspensos aumentam intensidade.', 'Konrad et al. (2001) — J Sports Sci'),
  (g_abd, 'Prancha (Plank)', 70, 'Transverso, Eretores, Glúteo', 'Alta ativação do core como unidade. Excelente para estabilidade da coluna.', 'Escamilla et al. (2010) — J Orthop Sports Phys Ther'),
  (g_abd, 'Crunch Reto', 75, 'Oblíquos', 'Clássico para reto abdominal. Amplitude parcial de movimento. Cervical deve ser neutra.', 'Axler & McGill (1997) — Med Sci Sports Exerc'),
  (g_abd, 'Dead Bug', 72, 'Transverso, Eretores, Glúteo', 'Alta ativação do core profundo com coluna neutra. Recomendado por McGill para proteção lombar.', 'McGill (2010) — Low Back Disorders, 2nd ed.');

  -- ERETORES
  INSERT INTO exercises (muscle_group_id, name, activation_pct, secondary_muscles, scientific_note, reference) VALUES
  (g_eret, 'Levantamento Terra (Deadlift)', 88, 'Glúteo, Isquiotibiais, Trapézio', 'Maior ativação de eretores entre todos os exercícios. Técnica precisa é indispensável.', 'Escamilla et al. (2002) — Med Sci Sports Exerc'),
  (g_eret, 'Hiperextensão (Back Extension)', 82, 'Glúteo, Isquiotibiais', 'Isolamento eficiente. Manter posição neutra da lombar é preferível à flexão completa.', 'Mayer et al. (2003) — Spine'),
  (g_eret, 'Good Morning com Barra', 78, 'Isquiotibiais, Glúteo', 'Alta ativação por momento de força sobre a coluna. Técnica rigorosa necessária.', 'Schellenberg et al. (2013) — J Strength Cond Res'),
  (g_eret, 'Remada Curvada com Barra', 72, 'Latíssimo, Trapézio, Rombóides', 'Eretores atuam isometricamente para manter posição do tronco durante o movimento.', 'Fenwick et al. (2009) — J Strength Cond Res');

END $$;
