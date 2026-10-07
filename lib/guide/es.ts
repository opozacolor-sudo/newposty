import type { GuideDoc } from "./types";

export const ES: GuideDoc = {
  title: "Guía de uso",
  subtitle:
    "Todo lo que puedes hacer en posty.now: asistente, conexiones, publicaciones, analítica, mensajes, leads, anuncios y voz — paso a paso, con ejemplos.",
  toc: "Índice",
  tipLabel: "Consejo",
  tryLabel: "Dile al asistente",
  ctaTitle: "¿Listo para probarlo?",
  ctaButton: "Abrir el asistente",
  downloadLabel: "Descargar PDF",
  pdfHref: "/manual-posty-now-es.pdf",
  quoteStart: "«",
  quoteEnd: "»",
  networkLabels: {
    can: "Puede crear",
    boost: "Boost",
    audiences: "Audiencias",
    stats: "Analítica",
  },
  sections: [
    {
      id: "start",
      title: "Qué es posty.now",
      body: [
        "posty.now es un estudio con asistente de IA. Dices lo que quieres — por texto o por voz — y Posty redacta, programa y publica en las redes conectadas. No saltas de app en app para poner la misma foto en Instagram, TikTok y Facebook.",
        "Junto a las publicaciones orgánicas están los anuncios de pago, la bandeja (mensajes y comentarios) y un agente de leads que entrenas en tu web. Publicaciones y anuncios son dos trabajos distintos; el estudio los tiene ambos y no los mezcla.",
        "Arriba: Asistente, Conexiones, Publicaciones, Analítica, Mensajes, Leads, Anuncios y Guía. Mensajes se abre en dos pestañas: mensajes directos y comentarios. Abajo: hora local, idioma y cuenta. En Team también eliges el cliente — conexiones, publicaciones y leads son del cliente seleccionado. Toda programación sigue este reloj, no otra zona horaria.",
      ],
      tips: [
        {
          title: "Empieza por las conexiones",
          body: "El asistente puede escribir al momento. Para publicar, ver cifras o responder en la bandeja, conecta primero las redes en Conexiones — SOCIAL para publicar, ADS si haces anuncios.",
        },
      ],
    },
    {
      id: "accounts-posts",
      title: "Conexiones: publicaciones",
      body: [
        "Ve a Conexiones. En SOCIAL conecta Instagram, Facebook, Threads, TikTok, YouTube, LinkedIn, Pinterest, Google Business, X, Bluesky y Reddit.",
        "Pulsa Connect, autoriza, listo. Facebook pide una Página, LinkedIn un perfil o una página de empresa, Pinterest un tablero, Google Business una ubicación.",
        "Bluesky no usa un login clásico: necesita un App Password, no la contraseña habitual. El enlace de ayuda de la tarjeta explica cómo crear uno.",
        "Puedes conectar varias cuentas en la misma red. Lo que está conectado aquí es lo que el asistente puede publicar — y lo que aparece en Publicaciones, Analítica y Mensajes.",
      ],
      tips: [
        {
          title: "Esto no es publicidad",
          body: "Conectar Instagram para publicar no abre Meta Ads. Las cuentas de pago están más abajo en Conexiones, en ADS.",
        },
      ],
    },
    {
      id: "accounts-ads",
      title: "Conexiones: anuncios",
      lead: "Las publicaciones dan alcance orgánico. Los anuncios pagan por ser vistos. En posty.now caben ambos — se conectan por separado.",
      body: [
        "Sigue en Conexiones, más abajo en ADS: Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads, Pinterest Ads, X Ads y OpenAI Ads.",
        "Una cuenta de anuncios no publica en el feed. Desbloquea campañas de pago: qué está en marcha, cuánto gastas, qué vuelve. La lista de campañas está en Anuncios en la barra de arriba. Las campañas nuevas se piden al Asistente.",
        "OpenAI Ads no tiene ventana de login: pegas una clave API de ChatGPT Ads Manager. Esos anuncios son tarjetas en ChatGPT (título, texto, imagen, enlace), solo imágenes estáticas, presupuesto fijo para toda la campaña (mínimo 1 $) y elegibilidad de negocio — por ahora Estados Unidos, Canadá, Australia y Nueva Zelanda.",
      ],
      tips: [
        {
          title: "Orgánico + de pago en Meta",
          body: "Si publicas en Instagram/Facebook y también haces campañas de pago, conecta ambos: SOCIAL (Instagram, Facebook) y ADS (Meta Ads). Uno sin el otro es la mitad del cuadro.",
        },
        {
          title: "El creativo de campaña no es un archivo de serie",
          body: "Una promo o un anuncio con fecha se sube solo, con una hora clara. Mezclado con otros 29 archivos del día a día, puede caer el día equivocado.",
        },
      ],
    },
    {
      id: "ads-networks",
      title: "Qué admite cada red de anuncios",
      body: [
        "Cada plataforma de anuncios funciona distinto. La tarjeta en Conexiones → ADS muestra qué puedes crear, si puedes hacer boost de un contenido existente, qué audiencias tienes y lo completas que están las cifras.",
        "Boost es poner dinero detrás de algo que ya existe (una publicación, un Pin, un tweet). Una campaña independiente es un anuncio nuevo. No todas las redes hacen las dos cosas.",
      ],
      networks: [
        {
          name: "Meta Ads",
          can: "Campañas completas: Campaign → Ad set → Ad.",
          boost: "Sí — boost de publicaciones orgánicas existentes.",
          audiences: "Custom y Lookalike.",
          stats: "Gasto, impresiones, alcance, CTR, CPC, CPM, ROAS, conversiones.",
        },
        {
          name: "Google Ads",
          can: "Search (Responsive Search Ads) y Display (Responsive Display Ads).",
          boost: "No aplica — Google no hace boost de un post social.",
          audiences: "Sin targeting de audiencias desde Posty; Search y Display.",
          stats: "Informes agregados completos.",
        },
        {
          name: "LinkedIn Ads",
          can: "Imagen, vídeo, carrusel, documento, evento, text ad, conversation ads y más.",
          boost: "Sí.",
          audiences: "Listas de contactos/empresas y retargeting — solo lectura; no creas audiencias nuevas desde Posty.",
          stats: "Gasto, CPC, CPM, más cargo, seniority, sector, tamaño de empresa.",
        },
        {
          name: "TikTok Ads",
          can: "Campañas de vídeo independientes.",
          boost: "Spark Ads — promocionar contenido nativo de TikTok.",
          audiences: "Custom y Lookalike.",
          stats: "Gasto, views, CTR, CPM, casi en tiempo real.",
        },
        {
          name: "Pinterest Ads",
          can: "Promoted Pins nuevos.",
          boost: "Sí — promocionar Pins orgánicos existentes.",
          audiences: "Básico: demografía y país.",
          stats: "Gasto, saves, closeups, clics.",
        },
        {
          name: "X Ads",
          can: "Boost de tweets existentes o campañas independientes (texto hasta 280 caracteres + tarjeta con enlace).",
          boost: "Sí.",
          audiences: "Ubicación e idioma. Las listas de email son avanzadas (al menos 100 usuarios activos recientemente).",
          stats: "Gasto, CPE, CPM, clics en el enlace.",
        },
        {
          name: "OpenAI Ads",
          can: "Tarjetas en ChatGPT Free/Go: título, texto, imagen, URL. Sin vídeo.",
          boost: "No aplica.",
          audiences: "Solo ubicación (país/región).",
          stats: "Impresiones, clics, gasto, diario.",
          note: "Solo presupuesto de duración completa, mínimo 1 $. Elegibilidad de negocio y mercados: Estados Unidos, Canadá, Australia, Nueva Zelanda.",
        },
      ],
      tips: [
        {
          title: "Dónde se trabaja la publicidad",
          body: "La conexión está en Conexiones → ADS. La lista de campañas y el gasto, en Anuncios. El contenido orgánico — fotos, vídeo, series, promos con fecha — lo lanzas desde el Asistente. No le pidas al asistente «cuánto gasté en Meta»; abre Anuncios.",
        },
      ],
    },
    {
      id: "assistant",
      title: "El asistente",
      body: [
        "El asistente es el corazón del estudio. Pides ideas, textos, publicación, programación, un mes de contenido o una promo en una fecha concreta.",
        "Escribe con naturalidad, como a un compañero. Sin comandos especiales. Nombra las redes, cuándo debe salir y si quieres texto. Si no nombras una red (y no es una serie para todas), Posty pregunta — no adivina.",
        "Adjunta hasta 50 fotos o vídeos, 100 MB cada uno. El orden del selector es el orden de la serie. Espera a que terminen las subidas (badge naranja) y luego envía.",
        "Chat nuevo vacía el hilo. Úsalo cuando cambias de tema o quieres resetear «no preguntes otra vez».",
      ],
      examples: [
        "Dame tres textos de Instagram para un café en un lunes lluvioso.",
        "Publica esto ahora en Instagram y TikTok.",
        "A partir de mañana, uno al día, en cada red, a la mejor hora.",
      ],
      tips: [
        {
          title: "Un mensaje, una intención clara",
          body: "«Publica esto como reel de Instagram y TikTok ahora, y mañana a las 9 ponlo en stories de Instagram» funciona en un mensaje. Mezclar una promo del viernes con 20 fotos del mes, no.",
        },
      ],
    },
    {
      id: "voice",
      title: "Dictado por voz",
      featured: "voice",
      lead: "Hablas. Posty escribe. La forma más rápida de dar una instrucción larga sin teclado.",
      body: [
        "El micrófono junto a los adjuntos no es un extra — es la forma natural de trabajar en posty.now. Pulsas, hablas como a un compañero, aparecen las palabras, corriges una, envías. Ideal con 50 archivos, en el teléfono, para una campaña con fecha, redes y tono — o cuando simplemente no quieres teclear.",
        "Funciona mejor en Chrome o Edge. La primera vez el navegador pide el micrófono: Allow. Si pulsaste Block, el candado de la barra de direcciones, permite el micrófono, recarga.",
        "Mientras el micrófono está naranja, Posty sigue escuchando — puedes pausar y continuar. El placeholder pasa a «Listening… speak now». Vuelve a pulsar el micrófono para parar y luego Enviar.",
        "Puedes dictar en español. Si una frase sale mal, la editas en el recuadro — no empiezas de cero. Los adjuntos se quedan; la voz completa la instrucción.",
      ],
      examples: [
        "A partir de mañana, uno al día, en Instagram, TikTok y Facebook, a la mejor hora, sin texto.",
        "Programa esta foto el viernes a las 10, es la promo de otoño, solo Instagram y Facebook, con una línea corta de venta.",
      ],
      tips: [
        {
          title: "Dilo todo de una vez",
          body: "Redes, día, hora o «mejor hora», texto sí o no, el mismo archivo en todas o uno por red. Cuanto más completa la frase, más limpia sale la tarjeta de confirmación.",
        },
        {
          title: "¿No aparece nada en el recuadro?",
          body: "Casi siempre es el permiso del micrófono, no un micrófono roto. Chrome → candado → Micrófono → Allow.",
        },
      ],
    },
    {
      id: "ideas",
      title: "Textos, ideas, voz de marca",
      body: [
        "Si solo quieres inspiración, dilo. Posty ofrece 1–3 opciones y no publica.",
        "Un texto se escribe solo si lo pides («hazle una descripción», «caption»). Si mandas una foto y dices solo «publica en Instagram ahora», sale sin texto — no recicla un caption viejo del hilo.",
        "Cuando das tú el texto, se usa tal cual. Si es demasiado largo para una red (280 caracteres en X), se recorta al límite y te lo dice.",
        "Puedes describir la voz de marca: «somos una panadería cálida, sin emoji, sin slang». Posty lo guarda en la conversación para que los siguientes borradores sigan el tono.",
      ],
      examples: [
        "Escribe una descripción corta, cinco hashtags, tono cálido.",
        "Somos un estudio de foto. Voz: clara, sin superlativos. Recuérdalo.",
      ],
      tips: [
        {
          title: "Tu texto manda",
          body: "Si ya tienes el copy de campaña, pégalo o díctalo. Posty no lo reescribe. Pide a la IA solo cuando quieras variantes.",
        },
      ],
    },
    {
      id: "publish",
      title: "Publicar ahora",
      body: [
        "Adjunta media si la red lo exige (Instagram, TikTok, YouTube, Pinterest). Nombra las redes. Confirma en la tarjeta.",
        "«Todas las redes», «en todas partes», «everywhere» son todas las cuentas de publicación conectadas. Puedes excluir: «en todas partes menos LinkedIn».",
        "No está en vivo hasta que ves el visto verde en esa red. «Publishing now» en TikTok significa que aún procesa — no es un error. Espera el visto.",
      ],
      examples: [
        "Publica este vídeo ahora en Instagram como reel y en TikTok.",
        "Publica en todas las redes menos Reddit.",
      ],
    },
    {
      id: "schedule",
      title: "Programar a una hora concreta",
      body: [
        "Di el día y la hora. Posty usa el reloj de la barra de abajo (tu hora local), no una zona oculta. «Mañana a las 18:00» es 18:00 en ese reloj.",
        "Puedes combinar: story ahora en Instagram y TikTok, y el reel mañana a las 12:00 en Instagram.",
      ],
      examples: [
        "Programa esto mañana a las 18:00 en TikTok e Instagram.",
        "Viernes 15:00 en LinkedIn, este texto, sin foto.",
      ],
      tips: [
        {
          title: "Mira el reloj",
          body: "Si viajas o usas VPN, mira Hora local abajo en la barra del estudio. Las programaciones siguen ese reloj.",
        },
      ],
    },
    {
      id: "best-time",
      title: "La mejor hora",
      body: [
        "Di «a la mejor hora», «hora óptima», «peak time». Posty no inventa las 18:00. Elige la siguiente ventana pico de investigación de sector (Sprout, Hootsuite, Later, Buffer), en tu zona, como aproximación a la audiencia local.",
        "No son tus analíticas personales — el panel de publicaciones es diario, no por hora. Es un buen valor por defecto; si sabes que tu público está despierto de noche, pon la hora. Una hora explícita gana siempre.",
        "Cada red tiene su ritmo. Instagram entre semana tiende a ~11:00 (stories ~12:00), reserva de tarde ~19:00. TikTok hacia ~19:00. LinkedIn salta los fines de semana. Instagram y TikTok «a la mejor hora» pueden salir a horas distintas — es a propósito.",
      ],
      examples: [
        "Mañana a la mejor hora, en Instagram y TikTok.",
        "Mueve la publicación del viernes a la mejor hora.",
      ],
    },
    {
      id: "series",
      title: "Un mes de contenido: serie diaria",
      body: [
        "Adjunta hasta 50 archivos, en el orden en que deben salir. Di «a partir de mañana, uno al día, en cada red, a la mejor hora» o «100 publicaciones carrusel con 5 fotos mezcladas cada una». Puedes mezclar fotos y vídeos.",
        "Por defecto es cross, no copiar y pegar. El mismo día, cada red recibe un archivo distinto. Facebook puede llevar el media 1, X el 2, TikTok el 3. El mismo archivo no sale en dos redes ese día. A lo largo del mes los archivos rotan para que el calendario se quede lleno.",
        "Si quieres el mismo archivo en todas las redes ese día, dilo: «el mismo en todas». Si no, se queda cross.",
        "TikTok acepta fotos (modo foto / carrusel) y vídeo. YouTube se salta las fotos — no recibe stills. La tarjeta de confirmación muestra, por día, qué red recibe qué archivo. Las series grandes siempre piden la tarjeta; no se la saltan.",
      ],
      examples: [
        "A partir de mañana, uno al día, en cada red, a la mejor hora.",
        "Estos 10 vídeos, el mismo archivo en cada red cada día, a las 19:00.",
      ],
      tips: [
        {
          title: "El orden del selector cuenta",
          body: "El archivo 1 es el día 1. No los elijas al azar si ya tienes un orden. Puedes quitar un adjunto con X antes de enviar.",
        },
      ],
    },
    {
      id: "campaign",
      title: "Promos, lanzamientos, fechas concretas",
      lead: "Una campaña no es una serie. Una fecha concreta no es «uno al día».",
      body: [
        "Si tienes una promo, un lanzamiento, un Black Friday, un evento — sube ese asset solo. Di claramente cuándo y en qué redes. Un archivo, una instrucción, una confirmación.",
        "Si pones el creativo de campaña junto a otras 29 fotos del día a día, la serie lo trata como un día más del mes. Puede salir el martes en vez del viernes, en TikTok en vez de Facebook, o junto a un reel que no tiene nada que ver con la oferta.",
        "La misma regla si el asset es para anuncios. La serie diaria es contenido orgánico en cascada. Un anuncio de pago, un boost, una promo con fecha límite — aparte, con fecha.",
      ],
      examples: [
        "Programa esta foto el 15 de septiembre a las 10:00, Instagram y Facebook, es la promo de otoño. Este texto, tal cual.",
        "Publica el vídeo de lanzamiento el viernes a las 12:00 en Instagram como reel y en TikTok. No forma parte de la serie.",
      ],
      tips: [
        {
          title: "Dos trabajos, dos mensajes",
          body: "Primero el lote de 50 (el mes). Luego un chat nuevo o un mensaje nuevo, un solo archivo, la promo. No los juntes en la misma subida.",
        },
      ],
    },
    {
      id: "formats",
      title: "Formatos por red",
      body: [
        "El reel existe en Instagram, no en TikTok. La story existe en Instagram (y Facebook), no en TikTok. «En Instagram como reel y en TikTok» = Reel de Instagram + vídeo normal de TikTok.",
        "«Instagram como story y TikTok» = Story de Instagram + vídeo de TikTok. «Como vídeo en Instagram y TikTok» = Instagram publica el vídeo como Reel automáticamente, TikTok como vídeo.",
        "TikTok también admite fotos (una foto o un carrusel), no solo vídeo.",
        "Nombra un formato solo en la red que lo tiene. No pidas un reel en YouTube ni una story en LinkedIn.",
        "Instagram, TikTok, YouTube y Pinterest exigen media. LinkedIn, X, Threads, Bluesky, Facebook y Reddit pueden ser texto. X recorta a 280 caracteres. No mezcles imagen y vídeo en el mismo tweet.",
      ],
      examples: [
        "Este vídeo: reel de Instagram y TikTok, ahora. Y mañana a las 9:00, story de Instagram.",
      ],
    },
    {
      id: "confirm",
      title: "La tarjeta de confirmación",
      body: [
        "Antes de que salga algo, ves una tarjeta: redes, hora, vista previa, y en series un hueco por día. Confirma o Cancela / edita.",
        "Puedes marcar «Don’t ask again in this chat» si quieres velocidad. Solo vale para este hilo; un chat nuevo lo resetea. Las series grandes siguen queriendo ojos en la tarjeta — es demasiado fácil programar 50 días mal.",
        "Si cancelas, envía una instrucción nueva. La confirmación caduca a las pocas horas; si dejaste la pestaña abierta toda la noche, vuelve a enviar el comando.",
      ],
    },
    {
      id: "manage",
      title: "Cancelar, reprogramar, editar",
      body: [
        "Para una publicación programada desde el chat puedes pedir cancelarla, moverla o cambiar el texto. Identifícala por red, hora o un trozo del caption.",
        "Reprogramar puede ser una hora nueva o «a la mejor hora».",
      ],
      examples: [
        "Cancela la publicación de TikTok de mañana.",
        "Mueve la publicación de Instagram del viernes a las 19:00.",
        "Cambia el texto del lunes a: …",
      ],
    },
    {
      id: "posts-list",
      title: "Publicaciones (historial)",
      body: [
        "Publicaciones en la barra es tu calendario: borradores, programadas y publicadas, solo de las cuentas conectadas aquí. Filtras por red, cuenta, estado, origen y periodo.",
        "Desde aquí compruebas si una serie salió, si una programación sigue pendiente, o abres la publicación en la red. Publicar y programar se hace en el Asistente; esta página es el historial.",
      ],
    },
    {
      id: "messages",
      title: "Mensajes y comentarios",
      body: [
        "Mensajes en la barra tiene dos pestañas: mensajes directos y comentarios. Ves los hilos de las cuentas conectadas y puedes responder desde esta página, sin abrir la app de la red.",
        "Filtras por plataforma, cuenta y estado. Solo aparece algo si hay una cuenta de publicación conectada en Conexiones → SOCIAL.",
        "Esta bandeja eres tú. El agente de leads, si está encendido, responde aparte a mensajes nuevos de entrada con intención — no sustituye esta bandeja.",
      ],
    },
    {
      id: "leads",
      title: "Leads",
      lead: "Cada cliente tiene su agente. Pones el enlace del sitio, lo entrenas, le dices cómo hablar y luego enciendes la generación.",
      body: [
        "En Leads pegas la URL del sitio y pulsas Train the agent. Lee las páginas públicas y los productos. Si ya está entrenado, el botón dice Ya entrenado.",
        "En el recuadro de abajo le dices cómo quieres que vaya la conversación: precios, qué debe detectar («cuánto cuesta», «estoy libre en una fecha») y tu enlace de reserva si tienes. Ese es tu briefing; no sustituye el crawl.",
        "Después del entrenamiento pulsas AI lead generation. A partir de ahí solo responde a mensajes nuevos recibidos después de encenderla — no a hilos viejos ni a mensajes que enviaste tú. Responde cuando llega el mensaje, no al día siguiente.",
        "Se presenta como el agente posty.now, pide consentimiento (SÍ) y envía los términos, luego responde con lo que leyó en el sitio. Los leads salen en la lista (mensaje, comentario o anuncio) como nuevo / contactado / rechazado. El mismo control apaga la generación.",
      ],
      tips: [
        {
          title: "Instagram conectado",
          body: "Para DMs hace falta un Instagram (u otro canal con bandeja) en Conexiones. Entrenar el sitio no publica y no escribe solo en las redes.",
        },
        {
          title: "No es un blast",
          body: "La generación no escribe a hilos viejos. Un DM de prueba tiene que llegar después de encender el botón, y la respuesta puede esperar al siguiente pase diario.",
        },
      ],
    },
    {
      id: "stats-posts",
      title: "Analítica",
      body: [
        "Analítica es el tablero de publicaciones orgánicas: tasa de interacción, alcance, seguidores, publicaciones en el periodo, mejor publicación, gráficos por plataforma y en el tiempo, heatmap de una buena hora.",
        "Filtras por plataforma, cuenta, origen (creadas aquí o desde la plataforma) y los últimos 7 / 30 / 90 días. El enlace de la mejor publicación la abre en la red. La miniatura es la imagen; en vídeo aparece el icono de la red si no hay vista previa.",
        "Bluesky y Reddit dan cifras limitadas (likes, comentarios, compartidos — sin impresiones). El resto de redes conectadas dan el cuadro completo, dentro de lo que da cada API.",
        "Aquí ves si el contenido orgánico funciona. El gasto en anuncios no está aquí — está en Anuncios.",
      ],
    },
    {
      id: "stats-ads",
      title: "Anuncios",
      lead: "Aquí se ven campañas y dinero. Si no hay una cuenta de anuncios conectada, la página está vacía — no es un error.",
      body: [
        "Anuncios en la barra: campañas activas y pasadas, en las redes de anuncios conectadas. Filtras por plataforma, cuenta, estado y periodo. Las campañas nuevas se crean desde el Asistente.",
        "Úsalo para decidir si una campaña merece seguir, no para confundirla con una publicación que fue bien en orgánico. Un reel con muchos likes y una campaña con buen CTR son victorias distintas.",
        "¿No aparecen campañas? Revisa Conexiones → ADS: ¿la cuenta está conectada y activa en el periodo elegido?",
      ],
      tips: [
        {
          title: "Una rutina semanal corta",
          body: "Una vez por semana: Analítica (qué funcionó en orgánico) y Anuncios (qué costó y qué trajo). Luego, en el asistente, ajustas la serie — o preparas un creativo nuevo con fecha si es una promo. Pasa los leads a contactado cuando hayas hablado con la persona.",
        },
      ],
    },
    {
      id: "phrases",
      title: "Frases que funcionan bien",
      body: [
        "No hace falta memorizar comandos. Estos ejemplos cubren casi todo lo que puede hacer el estudio.",
      ],
      examples: [
        "Dame tres textos de Instagram para una panadería un lunes por la mañana.",
        "Publica esto ahora en Instagram como reel y en TikTok.",
        "Programa mañana a las 18:00 en LinkedIn, este texto.",
        "Mañana a la mejor hora, en Instagram y TikTok.",
        "A partir de mañana, uno al día, en cada red, a la mejor hora.",
        "El mismo vídeo en cada red, uno al día, a las 19:00.",
        "Programa esta foto el 15 de septiembre a las 10:00, solo Instagram y Facebook — es la promo, no es de la serie.",
        "Todas las redes menos LinkedIn.",
        "Cancela la publicación de TikTok de mañana.",
        "Mueve la publicación del viernes a la mejor hora.",
        "Escribe una descripción, tono cálido, sin emoji.",
        "No pidas otra vez la confirmación en este chat.",
        "Crea una campaña de Meta ads, tráfico al sitio, 10 € al día.",
      ],
    },
    {
      id: "troubleshoot",
      title: "Si algo no va",
      body: [
        "El dictado no escribe nada: Chrome o Edge, Allow en el micrófono, candado de la barra de direcciones. Recarga. Luego el micrófono del chat — debe quedarse naranja mientras hablas.",
        "«Publishing now» en TikTok: espera. El procesado no es un error. El visto verde es la señal.",
        "No publica: Conexiones → SOCIAL, ¿está la red conectada? ¿Instagram/TikTok/YouTube/Pinterest tienen un archivo?",
        "Archivo rechazado: 100 MB máx., 50 archivos máx. YouTube se salta las fotos. TikTok acepta fotos (carrusel).",
        "Confirmación desaparecida: caducó. Vuelve a enviar el comando.",
        "Analítica vacía: conecta una cuenta de publicación en Conexiones. Campañas de anuncios vacías: Conexiones → ADS, luego Anuncios en la barra. Un Instagram de publicaciones no llena el panel de anuncios.",
        "El agente de leads no responde: ¿está entrenado? ¿AI lead generation está encendido? El mensaje tiene que ser nuevo, recibido después de encenderlo.",
        "Idioma equivocado: el selector de idioma está abajo en la barra del estudio, junto al reloj.",
      ],
    },
  ],
};
