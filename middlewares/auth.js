const supabase = require('../config/supabaseClient')

async function autenticar(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Token não enviado' })
    }

    const token = authHeader.split(' ')[1]
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
        return res.status(401).json({ erro: 'Token inválido ou expirado' })
    }

    req.usuario = data.user // fica disponível nas próximas rotas
    next()
}

module.exports = autenticar