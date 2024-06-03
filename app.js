const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')


// Flujo Menu para la configuración de impresiones
const flowMenu = addKeyword(['prueba.stl'])
    .addAnswer([
        '⚙️ *Configuración estándar:* \n' +
        '🔍 *Detalles:* básico, *detallado*, ultra detallado\n' +
        '🔧 *Resistencia:* básica, *resistente*, ultra resistente\n' +
        '📏 *Tamaño:* *predeterminado*, personalizado'
    ])
    .addAnswer(
        '🤔 ¿Continuar con la configuración recomendada?\n' +
        '*1.* Sí ✅\n' +
        '*2.* Cambiar configuración 🔄\n' +
        '*3.* Elegir otro archivo 3D 📂', {capture: true},
        async (ctx, {gotoFlow, fallBack, flowDynamic}) => {
            if(!["1", "2", "3"].includes(ctx.body)){
                return fallBack( "Respuesta no válida, por favor slecciona una de las opciones");
            }
            switch (ctx.body){
                case "1":
                    return await flowDynamic("⌛ En unos instantes nuestro personal se comunicará contigo para decirte cuándo estará disponible tu pedido y solucionar cualquier otra duda que puedas tener. 💬")
                case "2":
                    return await flowDynamic("🛠️ ¡Perfecto! Siéntete libre de explicarme tus requerimientos para que podamos ayudarte mejor. 🤓✏️")
                case "3":
                    return await flowDynamic("Saliendo del menu....")
            }
        }
    )

// Flujo principal para los saludos iniciales
const flowPrincipal = addKeyword(['hola', 'ole', 'alo', 'holq', 'holz'])
    .addAnswer('🙌 ¡Hola! Bienvenido a *Impresiones 3D San Marcos* 🎉')
    .addAnswer('📄 Pásame tu archivo STL y te armaré un presupuesto. Recuerda que tenemos delivery gratis en toda la universidad. 🚚🎓')

// Función principal para iniciar el bot
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowMenu])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
