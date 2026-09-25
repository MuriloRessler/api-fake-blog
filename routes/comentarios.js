const express = require('express')
const router = express.Router()
const supabase = require('../config/supabaseClient')
const autenticar = require('../middlewares/auth')

// LISTAR COMENTÁRIOS DE UMA POSTAGEM
router.get('/postagem/:id/comentarios', async (req, res) => {
    const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('postagem_id', req.params.id)
        .order('created_at', { ascending: true })

    if (error) return res.status(500).json({ erro: error.message })
    res.json(data)
})

// CRIAR COMENTÁRIO (precisa estar logado)
router.post('/postagem/:id/comentarios', autenticar, async (req, res) => {
    const { texto } = req.body
    if (!texto) return res.status(400).json({ erro: 'Texto do comentário é obrigatório' })

    const { data, error } = await supabase
        .from('comentarios')
        .insert({
            postagem_id: req.params.id,
            user_id: req.usuario.id,
            autor_nome: req.usuario.user_metadata?.nome || req.usuario.email,
            texto
        })
        .select()
        .single()

    if (error) return res.status(500).json({ erro: error.message })
    res.status(201).json(data)
})

// EXCLUIR COMENTÁRIO (só quem criou, graças à policy do banco)
router.delete('/comentarios/:id', autenticar, async (req, res) => {
    const { error } = await supabase
        .from('comentarios')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.usuario.id)

    if (error) return res.status(500).json({ erro: error.message })
    res.status(204).send()
})

module.exports = router