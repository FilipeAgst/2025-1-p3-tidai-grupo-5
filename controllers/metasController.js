
const db = require('../db');

exports.getAllMetas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM metas');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar metas.' });
  }
};

exports.getMetaById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM metas WHERE id_metas = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Meta não encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar meta.' });
  }
};

exports.createMeta = async (req, res) => {
  const { id_playlist, nome_meta, descricao_meta, url_imagem_meta, prioridade_meta, concluida } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO metas (id_playlist, nome_meta, descricao_meta, url_imagem_meta, prioridade_meta, concluida) VALUES (?, ?, ?, ?, ?, ?)',
      [id_playlist, nome_meta, descricao_meta, url_imagem_meta, prioridade_meta, concluida]
    );
    res.status(201).json({ id_metas: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar meta.' });
  }
};

exports.updateMeta = async (req, res) => {
  const { nome_meta, descricao_meta, url_imagem_meta, prioridade_meta, concluida } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE metas SET nome_meta = ?, descricao_meta = ?, url_imagem_meta = ?, prioridade_meta = ?, concluida = ? WHERE id_metas = ?',
      [nome_meta, descricao_meta, url_imagem_meta, prioridade_meta, concluida, req.params.id]
    );
    res.json({ success: result.affectedRows > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar meta.' });
  }
};

exports.deleteMeta = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM metas WHERE id_metas = ?', [req.params.id]);
    res.json({ success: result.affectedRows > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar meta.' });
  }
};
