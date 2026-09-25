const express = require('express')
const router = express.Router()
const supabase = require('../config/supabaseClient')

// Converte o formato do banco (snake_case) para o formato que a API sempre retornou (camelCase)
function formatarPostagem(row) {
    if (!row) return null
    return {
        id: row.id,
        thumbImage: row.thumb_image,
        thumbImageAltText: row.thumb_image_alt_text,
        title: row.title,
        description: row.description,
        profileThumbImage: row.profile_thumb_image,
        profileName: row.profile_name,
        postDate: row.post_date,
        categoria: row.categoria
    }
}

// LISTAR TODAS AS POSTAGENS
router.get('/postagens', async (req, res) => {
    const { data, error } = await supabase
        .from('postagens')
        .select('*')
        .order('id', { ascending: true })

    if (error) return res.status(500).json({ erro: error.message })

    res.json(data.map(formatarPostagem))
})

// LISTAR UMA POSTAGEM
router.get('/postagem/:id', async (req, res) => {
    const { id } = req.params

    const { data, error } = await supabase
        .from('postagens')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return res.status(404).json({ erro: 'Postagem não encontrada' })

    res.json(formatarPostagem(data))
})

// LISTAR TODAS AS CATEGORIAS DISPONÍVEIS
router.get('/categorias', async (req, res) => {
    const { data, error } = await supabase
        .from('postagens')
        .select('categoria')

    if (error) return res.status(500).json({ erro: error.message })

    const categorias = [...new Set(data.map((row) => row.categoria))]
    res.json(categorias)
})

// LISTAR POSTAGENS DE UMA CATEGORIA ESPECÍFICA
router.get('/categoria/:nome', async (req, res) => {
    const { nome } = req.params

    const { data, error } = await supabase
        .from('postagens')
        .select('*')
        .eq('categoria', nome)
        .order('id', { ascending: true })

    if (error) return res.status(500).json({ erro: error.message })

    res.json(data.map(formatarPostagem))
})

// EDITAR UMA POSTAGEM EXISTENTE
router.put('/postagem/:id', async (req, res) => {
    const { id } = req.params
    const {
        thumbImage,
        thumbImageAltText,
        title,
        description,
        profileThumbImage,
        profileName,
        postDate,
        categoria
    } = req.body

    // Só inclui no update os campos que realmente vieram no corpo da requisição
    const camposParaAtualizar = {}
    if (thumbImage !== undefined) camposParaAtualizar.thumb_image = thumbImage
    if (thumbImageAltText !== undefined) camposParaAtualizar.thumb_image_alt_text = thumbImageAltText
    if (title !== undefined) camposParaAtualizar.title = title
    if (description !== undefined) camposParaAtualizar.description = description
    if (profileThumbImage !== undefined) camposParaAtualizar.profile_thumb_image = profileThumbImage
    if (profileName !== undefined) camposParaAtualizar.profile_name = profileName
    if (postDate !== undefined) camposParaAtualizar.post_date = postDate
    if (categoria !== undefined) camposParaAtualizar.categoria = categoria

    if (Object.keys(camposParaAtualizar).length === 0) {
        return res.status(400).json({ erro: 'Nenhum campo válido foi enviado para atualização' })
    }

    const { data, error } = await supabase
        .from('postagens')
        .update(camposParaAtualizar)
        .eq('id', id)
        .select()
        .single()

    if (error) return res.status(404).json({ erro: 'Não foi possível editar. Postagem não encontrada.' })

    res.json(formatarPostagem(data))
})

const autenticar = require('../middlewares/auth')

// antes: router.put('/postagem/:id', async (req, res) => { ... })
router.put('/postagem/:id', autenticar, async (req, res) => {
    // ... mesmo código de antes
})

module.exports = router