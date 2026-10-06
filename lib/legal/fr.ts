import { REFUND_MONTHLY_REFERENCE_EUR as price, WITHDRAWAL_DAYS as days } from "@/lib/billing";
import type { LegalCompany, LegalPage } from "@/lib/legal-types";

function operator(c: LegalCompany) {
  return `${c.name}, n° fiscal ${c.cui}, registre du commerce ${c.reg}, EUID ${c.euid}, constituée le ${c.founded}. Le service est posty.now (${c.site}). Contact : ${c.email}.`;
}

export function legalPagesFr(c: LegalCompany): LegalPage[] {
  return [
    {
      id: "terms",
      href: "/terms",
      label: "CGU",
      title: "Conditions générales",
      description: "Le contrat d’utilisation de posty.now avec VLN MOTORS SRL.",
      updated: "Dernière mise à jour : 6 octobre 2026",
      intro: [
        operator(c),
        "Ces conditions s’appliquent au site, à la préinscription et au studio posty.now. Paiement, abonnement et remboursement figurent dans les Conditions d’abonnement et dans la Politique d’annulation et de remboursement. Les données personnelles figurent dans la Politique de confidentialité.",
      ],
      sections: [
        {
          id: "service",
          heading: "1. Le service",
          body: [
            "posty.now est un studio : tu connectes des réseaux sociaux et des comptes pubs, tu écris ou dictes ce qu’il faut publier, et l’assistant prépare le texte, l’heure et la publication ou la programmation. Tu vois les statistiques, les messages et les commentaires, tu peux former un agent de leads sur un site public et demander des campagnes payantes sur les comptes ads que tu connectes toi-même.",
            "Les nouveaux comptes restent fermés jusqu’au 15 octobre 2026. D’ici là tu peux laisser un e-mail sur la liste de préinscription. Cet e-mail n’est pas un abonnement et ne coûte rien.",
          ],
        },
        {
          id: "account",
          heading: "2. Le compte",
          body: [
            "Pour le studio il te faut un compte, au moins 16 ans et la capacité de conclure un contrat. Tu es responsable du mot de passe et de tout ce qui se fait depuis le compte.",
            "Tu peux choisir Individual ou Team. Team est un login d’agence et des clients par nom. Les invitations de collègues ne font pas partie de cette phase. Un compte réseau connecté appartient à un client.",
          ],
        },
        {
          id: "networks",
          heading: "3. Réseaux connectés",
          body: [
            "Quand tu connectes Instagram, Facebook, TikTok, YouTube, LinkedIn, Pinterest, Google Business, Bluesky, Reddit ou un compte ads, tu nous autorises à utiliser la connexion uniquement pour ce que tu demandes dans le studio : publier, programmer, statistiques, lecture des messages et commentaires, l’agent de leads de l’article 5, ou une campagne.",
            "Tu respectes les règles de chaque réseau. posty.now n’est pas Meta, Google, TikTok, LinkedIn, Pinterest ni les autres réseaux. Le budget pub se paie à ces réseaux, depuis leur compte ads. Il n’est pas inclus dans l’abonnement à VLN MOTORS SRL.",
          ],
        },
        {
          id: "content",
          heading: "4. Tes contenus et les textes IA",
          body: [
            "Les contenus que tu téléverses restent les tiens. Tu nous donnes une licence limitée pour les stocker, les traiter et les envoyer aux réseaux, uniquement pour faire fonctionner le service.",
            "Les textes générés peuvent être faux. Tu vérifies la légende, les hashtags et l’heure avant de confirmer. Nous ne promettons ni portée, ni engagement, ni qu’un réseau accepte la publication.",
            "La dictée utilise la reconnaissance vocale du navigateur. Nous recevons le texte dans la zone. Nous ne stockons pas l’audio.",
          ],
        },
        {
          id: "leads",
          heading: "5. L’agent de leads et le consentement dans le chat",
          body: [
            "Tu peux former un agent sur les pages publiques d’un site (l’URL que tu indiques) et activer la génération IA de leads. Une fois activé, il lit les nouveaux messages et commentaires reçus après l’activation, sur les comptes de publication connectés. Il n’écrit pas dans d’anciens fils et n’écrit pas à quelqu’un qui ne t’a pas écrit ensuite.",
            "L’agent se présente comme agent posty.now. Avant de continuer, il envoie un lien vers ces conditions et demande un consentement explicite : la réponse OUI (ou YES, DA, JA, SÌ, SÍ). Sans OUI, il ne demande pas de téléphone, d’e-mail ni d’autres coordonnées, et ne marque pas la personne comme lead qualifié.",
            "Si la personne répond OUI, elle accepte que VLN MOTORS SRL, via posty.now au nom de la page ou du compte auquel elle a écrit, poursuive la conversation, utilise son message, réponde à partir des pages publiques du site formé, et collecte le nom, le téléphone et l’e-mail qu’elle laisse (et, si elle les écrit, des éléments de préqualification, comme le mode de paiement ou le revenu), afin qu’une personne de cette page puisse la contacter. Le traitement des données figure dans la Politique de confidentialité. Elle peut refuser : ne pas répondre OUI, ou écrire NON.",
            "Le lead (message, coordonnées, transcription, statut) reste dans la liste du studio, chez le client auquel le compte est rattaché. Tu es responsable d’utiliser cette fonction selon les règles du réseau et le droit, y compris le RGPD, vis-à-vis des personnes qui t’ont écrit. Tu désactives la génération dans le même contrôle du studio. Nous ne promettons ni ventes, ni réservations, ni que la personne réponde.",
          ],
        },
        {
          id: "use",
          heading: "6. Usage interdit",
          body: [
            "Tu n’utilises pas le service pour du spam, de la fraude, du harcèlement ou d’autres actes illégaux, pour contourner les limites d’un réseau, pour des contenus qui violent le droit d’auteur ou la vie privée, ni pour vendre ou partager le compte.",
          ],
        },
        {
          id: "pay",
          heading: "7. Ce que tu paies, et à qui",
          body: [
            `Le contrat payant est entre toi et ${c.name}. Stripe ne traite que le paiement : l’argent passe par Stripe vers le compte de l’entreprise. Stripe n’est pas le vendeur.`,
            `L’abonnement est l’accès au studio, ${price} EUR par mois, après le mois offert dans les Conditions d’abonnement. La liste d’attente est gratuite. Tu ne nous paies pas ton budget pub.`,
            "Le montant dû est celui affiché sur la page de paiement avant confirmation. Si l’entreprise est ou devient assujettie à la TVA, la taxe apparaît là et sur la facture avant le prélèvement.",
          ],
        },
        {
          id: "delete",
          heading: "8. Supprimer le compte",
          body: [
            "Dans le studio, tu ouvres le menu du compte, tu choisis Supprimer le compte et tu confirmes. Les réseaux sont déconnectés, l’utilisateur et les données live du studio sont supprimés (conversations, publications, fichiers, leads). Si tu ne peux pas te connecter, utilise la page Contact depuis le même e-mail et demande la suppression.",
            "Supprimer le compte n’annule pas automatiquement un paiement déjà encaissé. L’argent suit la Politique d’annulation et de remboursement. Les factures sont conservées aussi longtemps que le droit fiscal l’exige, même si le compte studio a disparu.",
          ],
        },
        {
          id: "end",
          heading: "9. Suspension, droit, contact",
          body: [
            "Tu peux cesser d’utiliser le service à tout moment. Nous pouvons suspendre l’accès si tu romps ces conditions ou si le droit l’exige.",
            "Nous n’excluons pas la responsabilité pour dol, faute lourde, ou les droits que la loi nous interdit de limiter, y compris les droits des consommateurs. Sinon, la responsabilité pour une réclamation liée au service est limitée au montant que tu nous as payé au cours des 12 derniers mois.",
            "Le droit roumain s’applique. Les consommateurs peuvent s’adresser à l’ANPC. Les tribunaux sont ceux de Roumanie, sauf règles impératives de protection des consommateurs de ton pays.",
            `Questions : ${c.email}.`,
          ],
        },
      ],
    },
    {
      id: "privacy",
      href: "/privacy",
      label: "Confidentialité",
      title: "Confidentialité et RGPD",
      description: "Quelles données VLN MOTORS SRL traite pour posty.now, pourquoi, et comment tu les supprimes.",
      updated: "Dernière mise à jour : 6 octobre 2026",
      intro: [
        `${operator(c)} ${c.name} est le responsable du traitement pour posty.now.`,
        "Nous ne vendons pas de données personnelles. Nous n’utilisons pas tes données pour entraîner un modèle d’IA.",
      ],
      sections: [
        {
          id: "what",
          heading: "1. Quelles données, et pourquoi",
          body: [
            "Préinscription : e-mail et langue (roumain, anglais, allemand, italien, français ou espagnol). Base : démarches précontractuelles et consentement via le formulaire. Finalité : informer de l’ouverture le 15 octobre 2026. Tu peux demander le retrait via l’adresse de contact.",
            "Compte : e-mail, identifiant d’auth et hash du mot de passe chez le fournisseur d’auth. Base : contrat. Finalité : connexion.",
            "Studio : messages du chat, fichiers (jusqu’à 50, 100 Mo chacun), publications, programmations, clients Team (nom seulement), le client choisi et les leads (message, transcription, nom, téléphone, e-mail, statut). Base : contrat. Finalité : publier, programmer, historique et liste de leads.",
            "Réseaux : identifiants et noms des comptes connectés plus les jetons pour publier et lire la boîte de réception. Nous lisons les messages et commentaires des comptes connectés pour détecter l’intérêt, répondre (qualification en privé ; un commentaire public invite seulement au chat privé) et enregistrer un lead qualifié après consentement explicite OUI/YES à ces CGU dans le chat. Téléphone, e-mail ou salaire n’apparaissent pas dans les commentaires publics. Base : contrat. Finalité : l’action que tu as demandée.",
            "La personne qui écrit à la page : si elle répond OUI, nous traitons le message ainsi que le nom, le téléphone et l’e-mail qu’elle laisse, pour que le titulaire du compte studio puisse la contacter. Base : le consentement par OUI. Elle peut demander la suppression via l’adresse de contact. Sans OUI, nous ne collectons pas de coordonnées.",
            "Voix : le navigateur transforme la voix en texte. Nous stockons le texte du message si tu l’envoies. Nous ne stockons pas l’audio.",
            "Paiements : Stripe traite la carte. Nous conservons l’identifiant client Stripe, le statut de paiement, le montant et la date, pour savoir si l’abonnement est actif et pour facturer. Nous ne stockons pas le numéro complet de la carte. Base : contrat et obligation légale de tenue de comptes.",
            "Formulaire de contact : nom, e-mail et message. Base : intérêt légitime ou démarches précontractuelles, pour que nous puissions répondre.",
          ],
        },
        {
          id: "who",
          heading: "2. Qui reçoit des données",
          body: [
            "Hébergement (Vercel), base de données et authentification (Supabase), paiements (Stripe), e-mail transactionnel (Resend), un fournisseur de modèle IA qui reçoit le message du chat pour rédiger le texte, et un fournisseur de publication qui envoie la publication confirmée au réseau connecté.",
            "Les réseaux connectés reçoivent le contenu que tu confirmes. Ils ont leurs propres règles.",
            "Un lead qualifié (nom, téléphone, e-mail, transcription) est visible dans le studio pour le titulaire du compte, chez le client choisi. Nous ne le vendons pas.",
            "Nous transmettons des données si la loi l’exige, par exemple une facture ou une demande d’autorité.",
          ],
        },
        {
          id: "keep",
          heading: "3. Combien de temps",
          body: [
            "Un e-mail de liste d’attente reste jusqu’à l’ouverture et l’information, ou jusqu’à ce que tu demandes la suppression, selon ce qui arrive en premier.",
            "Les données du studio sont supprimées quand tu supprimes le compte : utilisateur, conversations, publications live, fichiers et leads. Les sauvegardes chiffrées de la base tournent d’elles-mêmes et ne servent pas au traitement courant.",
            "Les pièces comptables et factures restent aussi longtemps que le droit fiscal roumain l’exige, même si le studio a été supprimé.",
          ],
        },
        {
          id: "rights",
          heading: "4. Tes droits",
          body: [
            "Tu peux demander l’accès, la rectification, l’effacement, la limitation, l’opposition et la portabilité, et retirer le consentement pour la préinscription. Si tu as écrit à une page et répondu OUI dans le chat, tu peux retirer ce consentement et demander la suppression du lead. Supprimer le compte dans le studio est le chemin direct pour supprimer les données du studio.",
            "Tu peux déposer une réclamation auprès de l’ANSPDCP, l’autorité roumaine de protection des données.",
            `Demandes à ${c.email} ou via la page Contact, depuis l’e-mail du compte. Nous répondons dans le délai RGPD, en général un mois.`,
          ],
        },
        {
          id: "delete",
          heading: "5. Supprimer le compte",
          body: [
            "Connecté : menu du compte → Supprimer le compte → confirmer. Les réseaux sont déconnectés, puis l’utilisateur et les données live sont supprimés.",
            "Déconnecté : message via la page Contact, le même e-mail, avec la demande de suppression. Nous vérifions que tu es le titulaire avant de supprimer.",
            "La suppression n’annule pas à elle seule un tarif pour une période déjà commencée et ne supprime pas les factures que la loi nous oblige à conserver.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      href: "/cookies",
      label: "Cookies",
      title: "Politique de cookies",
      description: "Les cookies strictement nécessaires utilisés par posty.now.",
      updated: "Dernière mise à jour : 22 septembre 2026",
      intro: [
        operator(c),
        "Nous n’utilisons que des cookies strictement nécessaires. Il n’y a pas de cookies d’analyse, de publicité ou de réseaux sociaux sur le site. Il n’y a donc pas de bannière de consentement : la loi autorise les cookies sans lesquels le service ne peut pas fonctionner.",
      ],
      sections: [
        {
          id: "list",
          heading: "1. Quels cookies",
          body: [
            "La session de connexion, posée par le fournisseur d’auth, pour rester connecté. Durée : la session et son renouvellement.",
            "NEXT_LOCALE : la langue choisie (roumain, anglais, allemand, italien, français ou espagnol).",
            "posty_client : le client Team choisi dans le studio, pour que les publications ne sautent pas vers un autre client. Il est httpOnly. Durée : jusqu’à 400 jours, ou jusqu’à ce que tu changes de client ou supprimes le compte.",
            "De courts cookies OAuth uniquement pendant que tu connectes un réseau, pour que le retour depuis la fenêtre du réseau t’appartienne.",
          ],
        },
        {
          id: "control",
          heading: "2. Comment tu les contrôles",
          body: [
            "Tu peux les supprimer dans le navigateur. Sans cookie de session tu es déconnecté. Sans NEXT_LOCALE le site choisit à nouveau la langue. Sans posty_client, un studio Team ne sait plus quel client était ouvert.",
            "Nous ne vendons pas d’identifiants de cookies et ne les relions pas à de la publicité hors du site.",
          ],
        },
      ],
    },
    {
      id: "refunds",
      href: "/refunds",
      label: "Remboursement",
      title: "Annulation et remboursement",
      description: "Comment tu résilies un abonnement posty.now et quand l’argent revient.",
      updated: "Dernière mise à jour : 22 septembre 2026",
      intro: [
        operator(c),
        "La résiliation arrête le renouvellement. Un remboursement rend l’argent déjà encaissé. Ce n’est pas la même chose. Supprimer le compte n’est pas, à lui seul, une demande de remboursement.",
      ],
      sections: [
        {
          id: "free",
          heading: "1. Liste d’attente et mois offert",
          body: [
            "La préinscription ne coûte rien. Il n’y a rien à rembourser.",
            "Si tu es sur la liste et que tu crées un compte à l’ouverture le 15 octobre 2026, le premier mois de studio est offert. Si tu résilies pendant ce mois, rien n’est prélevé.",
          ],
        },
        {
          id: "withdraw",
          heading: `2. Le délai de rétractation de ${days} jours`,
          body: [
            `En tant que consommateur, tu peux te rétracter du contrat à distance dans les ${days} jours suivant la conclusion, sans motif, selon l’ordonnance d’urgence roumaine 34/2014.`,
            "Si tu demandes que le studio commence tout de suite pendant le délai de rétractation, et que tu confirmes perdre le droit de rétractation pour la prestation numérique déjà fournie, la période déjà utilisée n’est pas remboursée en entier.",
            `Si tu n’as pas demandé de début immédiat et que tu te rétractes dans les ${days} jours, nous remboursons intégralement le montant encaissé pour cet abonnement.`,
          ],
        },
        {
          id: "cancel",
          heading: "3. Résiliation ensuite",
          body: [
            "Tu résilies l’abonnement dans le compte. Il reste actif jusqu’à la fin de la période déjà payée, puis il ne se renouvelle plus. Le mois commencé n’est pas remboursé, parce que l’accès était disponible.",
            "Les budgets pubs versés à Meta, Google, TikTok, LinkedIn, Pinterest ou d’autres ne passent pas par nous. Tu les arrêtes dans leur compte. Nous ne les remboursons pas.",
          ],
        },
        {
          id: "lifetime",
          heading: "4. Anciens achats lifetime",
          body: [
            `Si tu as payé une fois pour un accès lifetime, avant l’abonnement mensuel, le remboursement est le montant payé moins ${price} EUR pour chaque mois commencé depuis l’activation, pas moins de zéro. Dans les ${days} jours, sans consentement au début immédiat, le remboursement est intégral.`,
            "Exemple : tu as payé 150 EUR et deux mois ont commencé, hors fenêtre de rétractation complète. Le remboursement est 150 − 30 = 120 EUR.",
          ],
        },
        {
          id: "how",
          heading: "5. Comment",
          body: [
            `Résilier dans le compte. Pour un remboursement qui ne vient pas tout seul, écris à ${c.email} depuis l’e-mail du compte, avec la date de paiement. L’argent revient via Stripe sur le même moyen, selon le calcul ci-dessus.`,
            "La suppression du compte est séparée, dans le menu du compte. Si tu veux aussi l’argent, dis-le tant que tu as encore le droit.",
          ],
        },
      ],
    },
    {
      id: "subscription",
      href: "/subscription",
      label: "Abonnement",
      title: "Conditions d’abonnement",
      description: "Ce que tu achètes chez VLN MOTORS SRL, ce que ça coûte et quand ça se renouvelle.",
      updated: "Dernière mise à jour : 22 septembre 2026",
      intro: [
        operator(c),
        "Ces conditions sont le contrat d’abonnement. Tu les acceptes quand tu confirmes le paiement. Jusque-là, la préinscription ne t’engage à rien.",
      ],
      sections: [
        {
          id: "what",
          heading: "1. Ce que tu achètes",
          body: [
            `Tu achètes un accès mensuel au studio posty.now, opéré par ${c.name} : assistant (texte et dictée), publication et programmation sur les réseaux connectés, statistiques, boîte de réception (messages et commentaires), un agent de leads formé sur un site, connexion de comptes ads et, en Team, des clients sous le même login.`,
            "Tu n’achètes pas de budget pub, ni de portée garantie, ni une place sur un réseau social. Tu paies cela, si tu le veux, directement au réseau, depuis son compte ads.",
            "Dans cet abonnement il n’y a pas de frais séparés par client. Un compte, un abonnement. Si nous introduisons un prix par client, tu le verras sur la page de paiement avant tout nouveau montant, et l’ancien abonnement ne change pas sans préavis.",
          ],
        },
        {
          id: "price",
          heading: "2. Combien, et pourquoi",
          body: [
            `Le prix de l’abonnement est ${price} EUR par mois pour l’accès décrit ci-dessus.`,
            "Le premier mois est offert si ton e-mail est sur la préinscription et que tu crées le compte à l’ouverture des inscriptions le 15 octobre 2026. Après le mois offert, le mois suivant n’est prélevé que si tu n’as pas résilié.",
            "Avant le premier prélèvement tu vois le montant sur la page Stripe. La devise y est confirmée. Si la TVA s’applique, elle apparaît avant le paiement, pas après.",
            `${c.name} facture la somme encaissée selon le droit fiscal roumain, y compris e-Factura si la règle s’applique (particulier ou entreprise). Pour une facture entreprise tu donnes des données de facturation correctes.`,
          ],
        },
        {
          id: "renew",
          heading: "3. Renouvellement et résiliation",
          body: [
            "L’abonnement se renouvelle chaque mois jusqu’à résiliation. La résiliation arrête le prochain prélèvement. L’accès reste jusqu’à la fin de la période déjà payée ou offerte.",
            `Le délai de rétractation de ${days} jours et les remboursements figurent dans la Politique d’annulation et de remboursement.`,
          ],
        },
        {
          id: "fail",
          heading: "4. Si un paiement échoue",
          body: [
            "Si le renouvellement échoue, Stripe peut réessayer. Si rien n’est encaissé, l’accès au studio s’arrête à la fin de la période payée. Les données ne sont pas supprimées seulement à cause d’un paiement échoué. Tu les supprimes dans le compte ou par écrit.",
          ],
        },
      ],
    },
  ];
}
