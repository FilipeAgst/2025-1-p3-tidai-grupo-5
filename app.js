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










// CREATE - Criar nova playlist
app.post('/playlists', async (req, res) => {
  const {
    id_usuario,
    nome_playlist,
    descricao_playlist,
    categoria_playlist,
    tag_playlist,
    prioridade,
    data_conclusao,
    visibilidade
  } = req.body

  try {
    const novaPlaylist = await sql`
      INSERT INTO playlist (
        id_usuario, nome_playlist, descricao_playlist,
        categoria_playlist, tag_playlist, prioridade,
        data_conclusao, visibilidade
      ) VALUES (
        ${id_usuario}, ${nome_playlist}, ${descricao_playlist},
        ${categoria_playlist}, ${tag_playlist}, ${prioridade},
        ${data_conclusao}, ${visibilidade}
      ) RETURNING *
    `
    res.status(201).json(novaPlaylist[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// READ - Listar todas as playlists
app.get('/playlists', async (req, res) => {
  try {
    const playlists = await sql`SELECT * FROM playlist`
    res.json(playlists)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// READ - Buscar uma playlist por ID
app.get('/playlists/:id', async (req, res) => {
  const { id } = req.params
  try {
    const playlist = await sql`SELECT * FROM playlist WHERE id_playlist = ${id}`
    if (playlist.length === 0) {
      return res.status(404).json({ error: 'Playlist não encontrada' })
    }
    res.json(playlist[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPDATE - Atualizar uma playlist
app.put('/playlists/:id', async (req, res) => {
  const { id } = req.params
  const {
    id_usuario,
    nome_playlist,
    descricao_playlist,
    categoria_playlist,
    tag_playlist,
    prioridade,
    data_conclusao,
    visibilidade
  } = req.body

  try {
    const atualizada = await sql`
      UPDATE playlist SET
        id_usuario = ${id_usuario},
        nome_playlist = ${nome_playlist},
        descricao_playlist = ${descricao_playlist},
        categoria_playlist = ${categoria_playlist},
        tag_playlist = ${tag_playlist},
        prioridade = ${prioridade},
        data_conclusao = ${data_conclusao},
        visibilidade = ${visibilidade}
      WHERE id_playlist = ${id}
      RETURNING *
    `
    if (atualizada.length === 0) {
      return res.status(404).json({ error: 'Playlist não encontrada' })
    }
    res.json(atualizada[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE - Deletar uma playlist
app.delete('/playlists/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deletada = await sql`DELETE FROM playlist WHERE id_playlist = ${id} RETURNING *`
    if (deletada.length === 0) {
      return res.status(404).json({ error: 'Playlist não encontrada' })
    }
    res.json({ message: 'Playlist deletada com sucesso' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})




