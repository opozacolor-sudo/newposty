import { REFUND_MONTHLY_REFERENCE_EUR as price, WITHDRAWAL_DAYS as days } from "@/lib/billing";
import type { LegalCompany, LegalPage } from "@/lib/legal-types";

function operator(c: LegalCompany) {
  return `${c.name}, NIF ${c.cui}, registro mercantil ${c.reg}, EUID ${c.euid}, constituida el ${c.founded}. El servicio es posty.now (${c.site}). Contacto: ${c.email}.`;
}

export function legalPagesEs(c: LegalCompany): LegalPage[] {
  return [
    {
      id: "terms",
      href: "/terms",
      label: "Términos",
      title: "Términos y condiciones",
      description: "El contrato de uso de posty.now con VLN MOTORS SRL.",
      updated: "Última actualización: 6 de octubre de 2026",
      intro: [
        operator(c),
        "Estos términos se aplican al sitio, a la preinscripción y al estudio posty.now. Pago, suscripción y reembolsos están en las Condiciones de suscripción y en la Política de desistimiento y reembolso. Los datos personales están en la Política de privacidad.",
      ],
      sections: [
        {
          id: "service",
          heading: "1. El servicio",
          body: [
            "posty.now es un estudio: conectas redes sociales y cuentas de anuncios, escribes o dictas qué publicar y el asistente prepara el texto, la hora y la publicación o la programación. Ves analítica, mensajes y comentarios, puedes entrenar un agente de leads en un sitio público y pedir campañas de pago en las cuentas ads que conectas tú.",
            "Las cuentas nuevas siguen cerradas hasta el 15 de octubre de 2026. Hasta entonces puedes dejar un correo en la lista de preinscripción. Ese correo no es una suscripción y no cuesta nada.",
          ],
        },
        {
          id: "account",
          heading: "2. La cuenta",
          body: [
            "Para el estudio necesitas una cuenta, al menos 16 años y capacidad para celebrar un contrato. Eres responsable de la contraseña y de todo lo que ocurre desde la cuenta.",
            "Puedes elegir Individual o Team. Team es un inicio de agencia y clientes por nombre. Las invitaciones a colegas no forman parte de esta fase. Una cuenta de red conectada pertenece a un cliente.",
          ],
        },
        {
          id: "networks",
          heading: "3. Redes conectadas",
          body: [
            "Cuando conectas Instagram, Facebook, TikTok, YouTube, LinkedIn, Pinterest, Google Business, Bluesky, Reddit o una cuenta ads, nos autorizas a usar la conexión solo para lo que pides en el estudio: publicar, programar, analítica, leer mensajes y comentarios, el agente de leads de la sección 5 o una campaña.",
            "Cumples las normas de cada red. posty.now no es Meta, Google, TikTok, LinkedIn, Pinterest ni las demás redes. El presupuesto publicitario lo pagas a esas redes, desde su cuenta ads. No forma parte de la suscripción a VLN MOTORS SRL.",
          ],
        },
        {
          id: "content",
          heading: "4. Tus contenidos y los textos de IA",
          body: [
            "Los contenidos que subes siguen siendo tuyos. Nos das una licencia limitada para almacenarlos, tratarlos y enviarlos a las redes, solo para que el servicio funcione.",
            "Los textos generados pueden ser incorrectos. Revisas el pie de foto, los hashtags y la hora antes de confirmar. No prometemos alcance, engagement ni que una red acepte la publicación.",
            "El dictado usa el reconocimiento de voz del navegador. Recibimos el texto en el recuadro. No almacenamos el audio.",
          ],
        },
        {
          id: "leads",
          heading: "5. El agente de leads y el consentimiento en el chat",
          body: [
            "Puedes entrenar un agente en las páginas públicas de un sitio (la URL que indiques) y activar la generación de leads con IA. Cuando está activo, lee mensajes y comentarios nuevos que llegan después de activarlo, en las cuentas de publicación conectadas. No escribe en hilos antiguos ni escribe a quien no te haya escrito después.",
            "El agente se presenta como agente de posty.now. Antes de seguir, envía un enlace a estos términos y pide consentimiento expreso: la respuesta SÍ (o YES, DA, JA, OUI, SÌ). Sin SÍ no pide teléfono, correo ni otros datos de contacto y no marca a la persona como lead cualificado.",
            "Si la persona responde SÍ, acepta que VLN MOTORS SRL, a través de posty.now en nombre de la página o cuenta a la que escribió, continúe la conversación, use su mensaje, responda desde las páginas públicas del sitio entrenado y recoja el nombre, teléfono y correo que deje (y, si los escribe, datos de precalificación como forma de pago o ingresos), para que una persona de esa página pueda contactarla. El tratamiento de datos está en la Política de privacidad. Puede negarse: no responder SÍ, o escribir NO.",
            "El lead (mensaje, datos de contacto, transcripción, estado) permanece en la lista del estudio, en el cliente al que está asignada la cuenta. Eres responsable de usar esta función según las normas de la red y la ley, incluido el RGPD, frente a quienes te han escrito. Desactivas la generación en el mismo control del estudio. No prometemos ventas, reservas ni que la persona responda.",
          ],
        },
        {
          id: "use",
          heading: "6. Uso prohibido",
          body: [
            "No usas el servicio para spam, fraude, acoso u otros actos ilícitos, para eludir los límites de una red, para contenidos que vulneren derechos de autor o privacidad, ni para vender o compartir la cuenta.",
          ],
        },
        {
          id: "pay",
          heading: "7. Qué pagas, y a quién",
          body: [
            `El contrato de pago es entre tú y ${c.name}. Stripe solo procesa el pago: el dinero pasa por Stripe a la cuenta de la empresa. Stripe no es el vendedor.`,
            `La suscripción es el acceso al estudio, ${price} EUR al mes, después del mes gratis en las Condiciones de suscripción. La lista de espera es gratuita. No nos pagas tu presupuesto publicitario.`,
            "El importe debido es el que se muestra en la página de pago antes de confirmar. Si la empresa está o pasa a estar sujeta a IVA, el impuesto aparece ahí y en la factura antes del cargo.",
          ],
        },
        {
          id: "delete",
          heading: "8. Eliminar la cuenta",
          body: [
            "En el estudio abres el menú de la cuenta, eliges Eliminar cuenta y confirmas. Se desconectan las redes y se eliminan el usuario y los datos en vivo del estudio (conversaciones, publicaciones, archivos, leads). Si no puedes iniciar sesión, usa la página de Contacto desde el mismo correo y pide la eliminación.",
            "Eliminar la cuenta no anula por sí sola un pago ya cobrado. El dinero sigue la Política de desistimiento y reembolso. Las facturas se conservan el tiempo que exige el derecho fiscal, aunque la cuenta del estudio ya no exista.",
          ],
        },
        {
          id: "end",
          heading: "9. Suspensión, derecho, contacto",
          body: [
            "Puedes dejar de usar el servicio en cualquier momento. Podemos suspender el acceso si incumples estos términos o si la ley lo exige.",
            "No excluimos la responsabilidad por dolo, negligencia grave o derechos que la ley nos prohíbe limitar, incluidos los derechos de los consumidores. En lo demás, la responsabilidad por una reclamación relativa al servicio se limita al importe que nos hayas pagado en los últimos 12 meses.",
            "Se aplica el derecho rumano. Los consumidores pueden acudir a la ANPC. Los tribunales son los de Rumanía, salvo normas imperativas de protección de consumidores de tu país.",
            `Preguntas: ${c.email}.`,
          ],
        },
      ],
    },
    {
      id: "privacy",
      href: "/privacy",
      label: "Privacidad",
      title: "Privacidad y RGPD",
      description: "Qué datos trata VLN MOTORS SRL para posty.now, por qué y cómo los eliminas.",
      updated: "Última actualización: 6 de octubre de 2026",
      intro: [
        `${operator(c)} ${c.name} es el responsable del tratamiento para posty.now.`,
        "No vendemos datos personales. No usamos tus datos para entrenar un modelo de IA.",
      ],
      sections: [
        {
          id: "what",
          heading: "1. Qué datos, y por qué",
          body: [
            "Preinscripción: correo e idioma (rumano, inglés, alemán, italiano, francés o español). Base: pasos precontractuales y consentimiento mediante el formulario. Finalidad: avisar de la apertura el 15 de octubre de 2026. Puedes pedir la baja en la dirección de contacto.",
            "Cuenta: correo, identificador de auth y hash de la contraseña en el proveedor de auth. Base: contrato. Finalidad: iniciar sesión.",
            "Estudio: mensajes del chat, archivos (hasta 50, 100 MB cada uno), publicaciones, programaciones, clientes Team (solo el nombre), el cliente elegido y los leads (mensaje, transcripción, nombre, teléfono, correo, estado). Base: contrato. Finalidad: publicar, programar, historial y lista de leads.",
            "Redes: identificadores y nombres de las cuentas conectadas más tokens para publicar y leer la bandeja. Leemos mensajes y comentarios de las cuentas conectadas para detectar interés, responder (cualificación en privado; un comentario público solo invita al chat privado) y guardar un lead cualificado tras el consentimiento expreso SÍ/YES a estos términos en el chat. Teléfono, correo o salario no aparecen en comentarios públicos. Base: contrato. Finalidad: la acción que pediste.",
            "La persona que escribe a la página: si responde SÍ, tratamos el mensaje y el nombre, teléfono y correo que deje, para que el titular de la cuenta del estudio pueda contactarla. Base: el consentimiento mediante SÍ. Puede pedir la eliminación en la dirección de contacto. Sin SÍ no recogemos datos de contacto.",
            "Voz: el navegador convierte la voz en texto. Guardamos el texto del mensaje si lo envías. No guardamos el audio.",
            "Pagos: Stripe procesa la tarjeta. Conservamos el ID de cliente de Stripe, el estado del pago, el importe y la fecha, para saber si la suscripción está activa y para facturar. No almacenamos el número completo de la tarjeta. Base: contrato y obligación legal de contabilidad.",
            "Formulario de contacto: nombre, correo y mensaje. Base: interés legítimo o pasos precontractuales, para poder responder.",
          ],
        },
        {
          id: "who",
          heading: "2. Quién recibe datos",
          body: [
            "Alojamiento (Vercel), base de datos y autenticación (Supabase), pagos (Stripe), correo transaccional (Resend), un proveedor de modelo de IA que recibe el mensaje del chat para redactar texto, y un proveedor de publicación que envía la publicación confirmada a la red conectada.",
            "Las redes conectadas reciben el contenido que confirmas. Tienen sus propias normas.",
            "Un lead cualificado (nombre, teléfono, correo, transcripción) es visible en el estudio para el titular de la cuenta, en el cliente elegido. No lo vendemos.",
            "Comunicamos datos si la ley lo exige, por ejemplo una factura o una solicitud de una autoridad.",
          ],
        },
        {
          id: "keep",
          heading: "3. Cuánto tiempo",
          body: [
            "Un correo de lista de espera permanece hasta la apertura y el aviso, o hasta que pidas la eliminación, lo que ocurra primero.",
            "Los datos del estudio se eliminan cuando eliminas la cuenta: usuario, conversaciones, publicaciones en vivo, archivos y leads. Las copias cifradas de la base rotan solas y no sirven para el tratamiento cotidiano.",
            "Los documentos contables y las facturas se conservan el tiempo que exige el derecho fiscal rumano, aunque el estudio se haya eliminado.",
          ],
        },
        {
          id: "rights",
          heading: "4. Tus derechos",
          body: [
            "Puedes pedir acceso, rectificación, supresión, limitación, oposición y portabilidad, y retirar el consentimiento de la preinscripción. Si escribiste a una página y respondiste SÍ en el chat, puedes retirar ese consentimiento y pedir la eliminación del lead. Eliminar la cuenta en el estudio es el camino directo para borrar los datos del estudio.",
            "Puedes presentar una reclamación ante la ANSPDCP, la autoridad rumana de protección de datos.",
            `Solicitudes a ${c.email} o a través de la página de Contacto, desde el correo de la cuenta. Respondemos en el plazo del RGPD, normalmente un mes.`,
          ],
        },
        {
          id: "delete",
          heading: "5. Eliminar la cuenta",
          body: [
            "Con sesión: menú de cuenta → Eliminar cuenta → confirmar. Se desconectan las redes y luego se eliminan el usuario y los datos en vivo.",
            "Sin sesión: mensaje desde la página de Contacto, el mismo correo, con la petición de eliminación. Comprobamos que eres el titular antes de eliminar.",
            "La eliminación por sí sola no anula una tarifa de un periodo ya iniciado y no borra las facturas que la ley nos obliga a conservar.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      href: "/cookies",
      label: "Cookies",
      title: "Política de cookies",
      description: "Las cookies estrictamente necesarias que usa posty.now.",
      updated: "Última actualización: 22 de septiembre de 2026",
      intro: [
        operator(c),
        "Solo usamos cookies estrictamente necesarias. No hay cookies de analítica, publicidad o redes sociales en el sitio. Por eso no hay banner de consentimiento: la ley permite las cookies sin las cuales el servicio no puede funcionar.",
      ],
      sections: [
        {
          id: "list",
          heading: "1. Qué cookies",
          body: [
            "La sesión de inicio, establecida por el proveedor de auth, para permanecer conectado. Duración: la sesión y su renovación.",
            "NEXT_LOCALE: el idioma elegido (rumano, inglés, alemán, italiano, francés o español).",
            "posty_client: el cliente Team elegido en el estudio, para que las publicaciones no salten a otro cliente. Es httpOnly. Duración: hasta 400 días, o hasta que cambies de cliente o elimines la cuenta.",
            "Cookies OAuth breves solo mientras conectas una red, para que el retorno desde la ventana de la red sea tuyo.",
          ],
        },
        {
          id: "control",
          heading: "2. Cómo las controlas",
          body: [
            "Puedes borrarlas en el navegador. Sin cookie de sesión estás desconectado. Sin NEXT_LOCALE el sitio vuelve a elegir el idioma. Sin posty_client un estudio Team ya no sabe qué cliente estaba abierto.",
            "No vendemos identificadores de cookies ni los vinculamos a publicidad fuera del sitio.",
          ],
        },
      ],
    },
    {
      id: "refunds",
      href: "/refunds",
      label: "Reembolso",
      title: "Desistimiento y reembolso",
      description: "Cómo cancelas una suscripción posty.now y cuándo vuelve el dinero.",
      updated: "Última actualización: 22 de septiembre de 2026",
      intro: [
        operator(c),
        "La cancelación detiene la renovación. Un reembolso devuelve el dinero ya cobrado. No es lo mismo. Eliminar la cuenta no es, por sí sola, una solicitud de reembolso.",
      ],
      sections: [
        {
          id: "free",
          heading: "1. Lista de espera y mes gratis",
          body: [
            "La preinscripción no cuesta nada. No hay nada que reembolsar.",
            "Si estás en la lista y creas una cuenta en la apertura del 15 de octubre de 2026, el primer mes de estudio es gratis. Si cancelas en ese mes, no se cobra nada.",
          ],
        },
        {
          id: "withdraw",
          heading: `2. El desistimiento de ${days} días`,
          body: [
            `Como consumidor puedes desistir del contrato a distancia en ${days} días desde la celebración, sin motivo, según la ordenanza de urgencia rumana 34/2014.`,
            "Si pides que el estudio empiece de inmediato durante el plazo de desistimiento y confirmas que pierdes el derecho de desistimiento por la prestación digital ya realizada, el periodo ya usado no se reembolsa por completo.",
            `Si no pediste el inicio inmediato y desistes en ${days} días, devolvemos íntegramente el importe cobrado por esta suscripción.`,
          ],
        },
        {
          id: "cancel",
          heading: "3. Cancelación después",
          body: [
            "Cancelas la suscripción en la cuenta. Sigue activa hasta el final del periodo ya pagado y luego no se renueva. El mes iniciado no se reembolsa, porque el acceso estaba disponible.",
            "Los presupuestos ads a Meta, Google, TikTok, LinkedIn, Pinterest u otros no pasan por nosotros. Los detienes en su cuenta. No los reembolsamos.",
          ],
        },
        {
          id: "lifetime",
          heading: "4. Compras lifetime anteriores",
          body: [
            `Si pagaste una vez por un acceso lifetime, antes de la suscripción mensual, el reembolso es el importe pagado menos ${price} EUR por cada mes iniciado desde la activación, no menos de cero. En ${days} días, sin consentimiento al inicio inmediato, el reembolso es íntegro.`,
            "Ejemplo: pagaste 150 EUR y han empezado dos meses, fuera de la ventana de desistimiento completo. El reembolso es 150 − 30 = 120 EUR.",
          ],
        },
        {
          id: "how",
          heading: "5. Cómo",
          body: [
            `Cancelar en la cuenta. Para un reembolso que no llega solo, escribe a ${c.email} desde el correo de la cuenta, con la fecha de pago. El dinero vuelve por Stripe al mismo método, según el cálculo anterior.`,
            "La eliminación de la cuenta es aparte, en el menú de la cuenta. Si también quieres el dinero, dilo mientras aún tengas el derecho.",
          ],
        },
      ],
    },
    {
      id: "subscription",
      href: "/subscription",
      label: "Suscripción",
      title: "Condiciones de suscripción",
      description: "Qué compras a VLN MOTORS SRL, cuánto cuesta y cuándo se renueva.",
      updated: "Última actualización: 22 de septiembre de 2026",
      intro: [
        operator(c),
        "Estas condiciones son el contrato de suscripción. Las aceptas cuando confirmas el pago. Hasta entonces la preinscripción no te obliga a nada.",
      ],
      sections: [
        {
          id: "what",
          heading: "1. Qué compras",
          body: [
            `Compras acceso mensual al estudio posty.now, operado por ${c.name}: asistente (texto y dictado), publicación y programación en las redes conectadas, analítica, bandeja (mensajes y comentarios), un agente de leads entrenado en un sitio, conexión de cuentas ads y, en Team, clientes bajo el mismo inicio.`,
            "No compras presupuesto publicitario, alcance garantizado ni un lugar en una red social. Eso lo pagas, si quieres, directamente a la red, desde su cuenta ads.",
            "En esta suscripción no hay una tarifa aparte por cliente. Una cuenta, una suscripción. Si introducimos un precio por cliente, lo verás en la página de pago antes de cualquier importe nuevo, y la suscripción anterior no cambia sin aviso.",
          ],
        },
        {
          id: "price",
          heading: "2. Cuánto, y por qué",
          body: [
            `El precio de la suscripción es ${price} EUR al mes por el acceso descrito arriba.`,
            "El primer mes es gratis si tu correo está en la preinscripción y creas la cuenta en la apertura de altas el 15 de octubre de 2026. Tras el mes gratis, el mes siguiente solo se cobra si no has cancelado.",
            "Antes del primer cargo ves el importe en la página de Stripe. La moneda se confirma allí. Si aplica IVA, aparece antes del pago, no después.",
            `${c.name} factura la suma cobrada según el derecho fiscal rumano, incluida e-Factura si la norma aplica (particular o empresa). Para una factura de empresa das datos de facturación correctos.`,
          ],
        },
        {
          id: "renew",
          heading: "3. Renovación y cancelación",
          body: [
            "La suscripción se renueva cada mes hasta que canceles. La cancelación detiene el siguiente cargo. El acceso permanece hasta el final del periodo ya pagado o gratuito.",
            `El desistimiento de ${days} días y los reembolsos están en la Política de desistimiento y reembolso.`,
          ],
        },
        {
          id: "fail",
          heading: "4. Si un pago falla",
          body: [
            "Si falla la renovación, Stripe puede reintentar. Si no se cobra nada, el acceso al estudio termina al final del periodo pagado. Los datos no se eliminan solo por un pago fallido. Los eliminas en la cuenta o por escrito.",
          ],
        },
      ],
    },
  ];
}
