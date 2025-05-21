import express from 'express'
import sql from './db.js'

const app = express()
const port = 3000

app.use(express.json()) // para receber JSON no body

// CREATE - Criar nova meta
app.post('/metas', async (req, res) => {
  const {
    id_playlist,
    nome_meta,
    descricao_meta,
    url_imagem_meta,
    prioridade_meta,
    concluida
  } = req.body

  try {
    const novaMeta = await sql`
      INSERT INTO metas (
        id_playlist, nome_meta, descricao_meta,
        url_imagem_meta, prioridade_meta, concluida
      ) VALUES (
        ${id_playlist}, ${nome_meta}, ${descricao_meta},
        ${url_imagem_meta}, ${prioridade_meta}, ${concluida}
      ) RETURNING *
    `
    res.status(201).json(novaMeta[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// READ - Listar todas as metas
app.get('/metas', async (req, res) => {
  try {
    const metas = await sql`SELECT * FROM metas`
    res.json(metas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// READ - Buscar uma meta por ID
app.get('/metas/:id', async (req, res) => {
  const { id } = req.params
  try {
    const meta = await sql`SELECT * FROM metas WHERE id_metas = ${id}`
    if (meta.length === 0) {
      return res.status(404).json({ error: 'Meta não encontrada' })
    }
    res.json(meta[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPDATE - Atualizar uma meta
app.put('/metas/:id', async (req, res) => {
  const { id } = req.params
  const {
    id_playlist,
    nome_meta,
    descricao_meta,
    url_imagem_meta,
    prioridade_meta,
    concluida
  } = req.body

  try {
    const updated = await sql`
      UPDATE metas SET
        id_playlist = ${id_playlist},
        nome_meta = ${nome_meta},
        descricao_meta = ${descricao_meta},
        url_imagem_meta = ${url_imagem_meta},
        prioridade_meta = ${prioridade_meta},
        concluida = ${concluida}
      WHERE id_metas = ${id}
      RETURNING *
    `
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Meta não encontrada' })
    }
    res.json(updated[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE - Remover uma meta
app.delete('/metas/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deleted = await sql`DELETE FROM metas WHERE id_metas = ${id} RETURNING *`
    if (deleted.length === 0) {
      return res.status(404).json({ error: 'Meta não encontrada' })
    }
    res.json({ message: 'Meta deletada com sucesso' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// TESTE BÁSICO
app.get('/', async (req, res) => {
  res.send('API de Metas está rodando!')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})


