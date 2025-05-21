
const db = require('../db');

exports.listarPlaylists = async (req, res) => {
  const busca = `%${req.query.busca || ''}%`;

  try {
    const [rows] = await db.query(\`
      SELECT p.id_playlist, p.nome_playlist, p.descricao_playlist, p.categoria_playlist, p.data_conclusao, u.id_usuario
      FROM playlist p
      JOIN usuario u ON u.id_usuario = p.id_usuario
      WHERE p.nome_playlist LIKE ? OR p.descricao_playlist LIKE ?
      ORDER BY p.data_conclusao DESC
    \`, [busca, busca]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar playlists.' });
  }
};

exports.listarMetasDaPlaylist = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_metas, nome_meta, descricao_meta, prioridade_meta, concluida FROM metas WHERE id_playlist = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar metas.' });
  }
};

exports.detalhesPerfilDaPlaylist = async (req, res) => {
  try {
    const [[{ id_usuario }]] = await db.query(
      'SELECT id_usuario FROM playlist WHERE id_playlist = ?',
      [req.params.id]
    );

    const [rows] = await db.query(
      'SELECT nome, sobrenome, descricao, url_image_perfil, tag_perfil, media_avaliacao FROM perfil WHERE id_perfil = ?',
      [id_usuario]
    );

    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
};

exports.listarMetasComArquivos = async (req, res) => {
  try {
    const [metas] = await db.query('SELECT * FROM metas WHERE id_playlist = ?', [req.params.id]);
    for (const meta of metas) {
      const [arquivos] = await db.query('SELECT * FROM arquivos_meta WHERE id_meta = ?', [meta.id_metas]);
      meta.arquivos = arquivos;
    }
    res.json(metas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar metas com arquivos.' });
  }
};

exports.avaliarPlaylist = async (req, res) => {
  const id = req.params.id;
  const { nota } = req.body;

  if (!nota || nota < 1 || nota > 5) {
    return res.status(400).json({ error: 'Nota deve ser entre 1 e 5.' });
  }

  try {
    const [[playlist]] = await db.query('SELECT media_avaliacao, qtd_avaliacoes FROM playlist WHERE id_playlist = ?', [id]);
    const novaQtd = playlist.qtd_avaliacoes + 1;
    const novaMedia = ((playlist.media_avaliacao * playlist.qtd_avaliacoes) + nota) / novaQtd;

    await db.query(
      'UPDATE playlist SET media_avaliacao = ?, qtd_avaliacoes = ? WHERE id_playlist = ?',
      [novaMedia, novaQtd, id]
    );

    res.json({ success: true, media_avaliacao: novaMedia.toFixed(2), qtd_avaliacoes: novaQtd });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao avaliar playlist.' });
  }
};

exports.criarPlaylistComMetas = async (req, res) => {
  const {
    nome_playlist,
    descricao_playlist,
    categoria_playlist,
    tag_playlist,
    prioridade,
    visibilidade,
    metas,
  } = req.body;

  const id_usuario = 1;
  const data_conclusao = 0;
  const media_avaliacao = 0;
  const qtd_avaliacoes = 0;
  const url_imagem = req.file ? \`/uploads/\${req.file.filename}\` : null;

  try {
    const [playlist] = await db.query(
      \`INSERT INTO playlist (id_usuario, nome_playlist, descricao_playlist, categoria_playlist, tag_playlist, prioridade, data_conclusao, visibilidade, media_avaliacao, qtd_avaliacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
      [id_usuario, nome_playlist, descricao_playlist, categoria_playlist, tag_playlist, prioridade, data_conclusao, visibilidade, media_avaliacao, qtd_avaliacoes]
    );

    const id_playlist = playlist.insertId;
    const metasArray = JSON.parse(metas);

    for (const meta of metasArray) {
      await db.query(
        'INSERT INTO metas (id_playlist, nome_meta, descricao_meta, url_imagem_meta, prioridade_meta, concluida) VALUES (?, ?, ?, NULL, ?, 0)',
        [id_playlist, meta.nome_meta, meta.descricao_meta, meta.prioridade_meta || 'baixa']
      );
    }

    res.status(201).json({ id_playlist, metas_criadas: metasArray.length });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar playlist.' });
  }
};
