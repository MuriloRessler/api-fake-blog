require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.warn(
        '[Supabase] Atenção: SUPABASE_URL e/ou SUPABASE_KEY não foram definidas. ' +
        'Copie o arquivo .env.example para .env e preencha com as credenciais do seu projeto.'
    )
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase