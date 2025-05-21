
const db = require('../db');

exports.uploadArquivo = async (req, res) => {
  const { id_meta, descricao_arquivo } = req.body;
  const nome_arquivo = req.file.originalname;
  const url_arquivo = `/uploads/${req.file.filename}`;

  try {
    const [arquivo] = await db.query(
      'INSERT INTO arquivos_meta (id_meta, nome_arquivo, descricao_arquivo, url_arquivo) VALUES (?, ?, ?, ?)',
      [id_meta, nome_arquivo, descricao_arquivo, url_arquivo]
    );

    res.status(201).json({ id_arquivo: arquivo.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar arquivo.' });
  }
};
