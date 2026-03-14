// Gerador de PDF para treinos — usa jsPDF via CDN dinâmico
export async function gerarPDFTreino(treino) {
  // Carrega jsPDF dinamicamente se não estiver carregado
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
  }

  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 14
  const colW = W - margin * 2
  let y = 0

  const VERDE = [26, 71, 42]
  const AMARELO = [234, 179, 8]
  const PRETO = [17, 17, 17]
  const BRANCO = [255, 255, 255]
  const CINZA = [40, 40, 40]
  const CINZA_CLARO = [60, 60, 60]
  const TEXTO_SUAVE = [130, 130, 130]

  function pintarFundo() {
    doc.setFillColor(...PRETO)
    doc.rect(0, 0, W, 297, 'F')
  }

  function novaPagina() {
    doc.addPage()
    pintarFundo()
    y = 14
  }

  function checkY(needed = 20) {
    if (y + needed > 280) novaPagina()
  }

  // PÁGINA 1 — CAPA
  pintarFundo()

  // Faixa verde topo
  doc.setFillColor(...VERDE)
  doc.rect(0, 0, W, 60, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.setTextColor(...AMARELO)
  doc.text('BERTOLDO PERFORMANCE', W / 2, 22, { align: 'center' })

  doc.setFontSize(12)
  doc.setTextColor(...BRANCO)
  doc.text('PLANO DE TREINO SEMANAL — HIPERTROFIA', W / 2, 34, { align: 'center' })

  doc.setFontSize(9)
  doc.setTextColor(200, 230, 200)
  doc.text('Base Cientifica: Schoenfeld, Krieger, Rhea et al.', W / 2, 44, { align: 'center' })

  // Dados do aluno
  y = 76
  doc.setFillColor(...CINZA)
  doc.roundedRect(margin, y, colW, 52, 3, 3, 'F')

  doc.setFontSize(8)
  doc.setTextColor(...AMARELO)
  doc.text('DADOS DO ALUNO', margin + 8, y + 10)

  doc.setFontSize(13)
  doc.setTextColor(...BRANCO)
  doc.setFont('helvetica', 'bold')
  doc.text(treino.nomeAluno, margin + 8, y + 22)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXTO_SUAVE)
  doc.text(`Nivel: ${treino.nivelLabel}`, margin + 8, y + 32)
  doc.text(`Foco: ${treino.focoLabel}`, margin + 8, y + 40)
  doc.text(`${treino.dias} dias/semana  •  Duracao: ~60 min  •  Gerado em: ${treino.dataGeracao}`, margin + 8, y + 48)

  // Base científica
  y += 62
  doc.setFillColor(20, 50, 30)
  doc.roundedRect(margin, y, colW, 38, 3, 3, 'F')

  doc.setFontSize(7)
  doc.setTextColor(...AMARELO)
  doc.setFont('helvetica', 'bold')
  doc.text('BASE CIENTIFICA — HIPERTROFIA', margin + 8, y + 10)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 210, 160)
  doc.setFontSize(7.5)
  const cienciaLines = doc.splitTextToSize(treino.baseciencia, colW - 16)
  cienciaLines.slice(0, 4).forEach((line, i) => {
    doc.text(line, margin + 8, y + 18 + i * 5.5)
  })

  // Resumo da semana
  y += 48
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...AMARELO)
  doc.text('RESUMO DA SEMANA', margin, y)

  y += 8
  treino.semana.forEach((dia) => {
    checkY(12)
    doc.setFillColor(...CINZA)
    doc.roundedRect(margin, y, colW, 10, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...AMARELO)
    doc.text(`DIA ${dia.dia} — ${dia.nome}`, margin + 4, y + 6.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...TEXTO_SUAVE)
    doc.setFontSize(7)
    doc.text(dia.grupos, W - margin - 4, y + 6.5, { align: 'right' })
    y += 12
  })

  // PÁGINAS DE TREINO
  treino.semana.forEach((dia) => {
    novaPagina()

    // Header do dia
    doc.setFillColor(...VERDE)
    doc.rect(0, 0, W, 28, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(...AMARELO)
    doc.text(`DIA ${dia.dia}`, margin, 14)

    doc.setFontSize(11)
    doc.setTextColor(...BRANCO)
    doc.text(dia.nome, margin + 24, 14)

    doc.setFontSize(8)
    doc.setTextColor(180, 230, 180)
    doc.text(dia.grupos, margin, 23)

    y = 36

    // Cabeçalho da tabela
    doc.setFillColor(...CINZA_CLARO)
    doc.rect(margin, y, colW, 8, 'F')

    const cols = [colW * 0.38, colW * 0.15, colW * 0.27, colW * 0.2]
    const colX = [margin, margin + cols[0], margin + cols[0] + cols[1], margin + cols[0] + cols[1] + cols[2]]
    const headers = ['EXERCICIO', 'SERIES x REPS', 'METODO', 'DESCANSO']

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(...TEXTO_SUAVE)
    headers.forEach((h, i) => {
      doc.text(h, colX[i] + 3, y + 5.5)
    })
    y += 10

    // Exercícios
    dia.exercicios.forEach((ex, i) => {
      checkY(12)
      const bg = ex.principal ? [20, 50, 25] : (i % 2 === 0 ? [28, 28, 28] : [22, 22, 22])
      doc.setFillColor(...bg)
      doc.rect(margin, y, colW, 11, 'F')

      if (ex.principal) {
        doc.setFillColor(...AMARELO)
        doc.rect(margin, y, 2, 11, 'F')
      }

      doc.setFont('helvetica', ex.principal ? 'bold' : 'normal')
      doc.setFontSize(8)
      doc.setTextColor(ex.principal ? ...AMARELO : ...BRANCO)
      doc.text(ex.nome, colX[0] + 4, y + 7)

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...AMARELO)
      doc.setFontSize(8)
      doc.text(`${ex.series}x${ex.reps}`, colX[1] + 3, y + 7)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 200, 140)
      doc.setFontSize(7.5)
      doc.text(ex.metodo || 'Serie Simples', colX[2] + 3, y + 7)

      doc.setTextColor(...TEXTO_SUAVE)
      doc.text(ex.descanso || '60-90s', colX[3] + 3, y + 7)

      y += 12
    })

    // Observação
    if (dia.obs) {
      checkY(14)
      y += 4
      doc.setFillColor(20, 50, 30)
      doc.roundedRect(margin, y, colW, 12, 2, 2, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(160, 210, 160)
      const obsLines = doc.splitTextToSize(`Dica: ${dia.obs}`, colW - 10)
      doc.text(obsLines[0], margin + 5, y + 8)
      y += 16
    }
  })

  // PÁGINA FINAL — Referências
  novaPagina()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...AMARELO)
  doc.text('REFERENCIAS CIENTIFICAS', margin, y)

  doc.setFillColor(...VERDE)
  doc.rect(margin, y + 3, 40, 1, 'F')

  y += 16
  treino.referencias.forEach((ref) => {
    checkY(12)
    doc.setFillColor(...CINZA)
    doc.roundedRect(margin, y, colW, 10, 2, 2, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...TEXTO_SUAVE)
    const refLines = doc.splitTextToSize(`• ${ref}`, colW - 10)
    doc.text(refLines[0], margin + 5, y + 7)
    y += 12
  })

  // Rodapé em todas as páginas
  const totalPags = doc.getNumberOfPages()
  for (let i = 1; i <= totalPags; i++) {
    doc.setPage(i)
    doc.setFillColor(...VERDE)
    doc.rect(0, 287, W, 10, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...BRANCO)
    doc.text('Bertoldo Performance — Plano de Hipertrofia', margin, 293)
    doc.text(`Pagina ${i} de ${totalPags}`, W - margin, 293, { align: 'right' })
  }

  doc.save(`Treino_${treino.nomeAluno.replace(/\s+/g, '_')}_${treino.focoLabel.replace(/\s+/g, '_')}.pdf`)
}
