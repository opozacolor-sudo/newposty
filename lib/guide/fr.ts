import type { GuideDoc } from "./types";

export const FR: GuideDoc = {
  title: "Guide d’utilisation",
  subtitle:
    "Tout ce que tu peux faire dans posty.now : assistant, connexions, posts, analytics, messages, leads, pubs et voix — pas à pas, avec des exemples.",
  toc: "Sommaire",
  tipLabel: "Conseil",
  tryLabel: "Dis à l’assistant",
  ctaTitle: "Prêt à essayer ?",
  ctaButton: "Ouvrir l’assistant",
  downloadLabel: "Télécharger le PDF",
  pdfHref: "/manual-posty-now-fr.pdf",
  quoteStart: "« ",
  quoteEnd: " »",
  networkLabels: {
    can: "Peut créer",
    boost: "Boost",
    audiences: "Audiences",
    stats: "Analytics",
  },
  sections: [
    {
      id: "start",
      title: "Ce qu’est posty.now",
      body: [
        "posty.now est un studio avec un assistant IA. Tu dis ce que tu veux — à l’écrit ou à la voix — et Posty rédige, programme et publie sur les réseaux connectés. Tu ne sautes plus d’appli en appli pour mettre la même photo sur Instagram, TikTok et Facebook.",
        "À côté des posts organiques : les pubs payantes, la boîte de réception (messages et commentaires) et un agent de leads que tu entraînes sur ton site. Posts et pubs sont deux métiers différents ; le studio les tient tous les deux, sans les mélanger.",
        "En haut : Assistant, Connexions, Posts, Analytics, Messages, Leads, Pubs et Guide. Messages s’ouvre en deux onglets : messages directs et commentaires. En bas : heure locale, langue et compte. En Team, tu choisis aussi le client — connexions, posts et leads appartiennent au client sélectionné. Toutes les programmations suivent cette horloge, pas un autre fuseau.",
      ],
      tips: [
        {
          title: "Commence par les connexions",
          body: "L’assistant peut écrire tout de suite. Pour publier, voir les chiffres ou répondre en inbox, connecte d’abord les réseaux dans Connexions — SOCIAL pour poster, ADS si tu fais de la pub.",
        },
      ],
    },
    {
      id: "accounts-posts",
      title: "Connexions : posts",
      body: [
        "Va dans Connexions. Sous SOCIAL, relie Instagram, Facebook, Threads, TikTok, YouTube, LinkedIn, Pinterest, Google Business, X, Bluesky et Reddit.",
        "Clique sur Connect, autorise, c’est bon. Facebook demande une Page, LinkedIn un profil ou une page entreprise, Pinterest un board, Google Business un lieu.",
        "Bluesky n’a pas de login classique : il faut un App Password, pas le mot de passe du compte. Le lien d’aide sur la carte explique comment en créer un.",
        "Tu peux connecter plusieurs comptes sur le même réseau. Ce qui est branché ici, l’assistant peut le publier — et ça apparaît dans Posts, Analytics et Messages.",
      ],
      tips: [
        {
          title: "Ce n’est pas de la pub",
          body: "Connecter Instagram pour poster n’ouvre pas Meta Ads. Les comptes payants sont plus bas dans Connexions, sous ADS.",
        },
      ],
    },
    {
      id: "accounts-ads",
      title: "Connexions : pubs",
      lead: "Les posts donnent de la portée organique. Les pubs paient pour être vues. Dans posty.now les deux ont leur place — elles se connectent séparément.",
      body: [
        "Toujours dans Connexions, plus bas sous ADS : Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads, Pinterest Ads, X Ads et OpenAI Ads.",
        "Un compte pub ne publie pas dans le fil. Il débloque les campagnes payantes : ce qui tourne, ce que tu dépenses, ce que tu récupères. La liste des campagnes est sous Pubs dans la barre du haut. Les nouvelles campagnes se créent dans l’Assistant.",
        "OpenAI Ads n’a pas de fenêtre de login : tu colles une clé API du ChatGPT Ads Manager. Ces pubs sont des cartes dans ChatGPT (titre, texte, image, lien), images statiques seulement, budget fixe sur toute la campagne (minimum 1 $), et éligibilité business — pour l’instant États-Unis, Canada, Australie et Nouvelle-Zélande.",
      ],
      tips: [
        {
          title: "Organique + payant sur Meta",
          body: "Si tu postes sur Instagram/Facebook et que tu fais aussi de la pub, connecte les deux : SOCIAL (Instagram, Facebook) et ADS (Meta Ads). L’un sans l’autre, c’est la moitié du tableau.",
        },
        {
          title: "Le créatif de campagne n’est pas un fichier de série",
          body: "Une promo ou une pub datée se charge toute seule, avec une heure claire. Mélangée à 29 autres fichiers du quotidien, elle peut tomber le mauvais jour.",
        },
      ],
    },
    {
      id: "ads-networks",
      title: "Ce que chaque réseau pub sait faire",
      body: [
        "Chaque plateforme pub travaille autrement. La carte dans Connexions → ADS montre ce que tu peux créer, si tu peux booster un contenu existant, quelles audiences tu as et à quel point les stats sont complètes.",
        "Boost, c’est mettre de l’argent derrière quelque chose qui existe déjà (un post, un Pin, un tweet). Une campagne autonome est une nouvelle pub. Tous les réseaux ne font pas les deux.",
      ],
      networks: [
        {
          name: "Meta Ads",
          can: "Campagnes complètes : Campaign → Ad set → Ad.",
          boost: "Oui — booster des posts organiques existants.",
          audiences: "Custom et Lookalike.",
          stats: "Dépenses, impressions, portée, CTR, CPC, CPM, ROAS, conversions.",
        },
        {
          name: "Google Ads",
          can: "Search (Responsive Search Ads) et Display (Responsive Display Ads).",
          boost: "Sans objet — Google ne booste pas un post social.",
          audiences: "Pas de ciblage d’audience depuis Posty ; Search et Display.",
          stats: "Rapports agrégés complets.",
        },
        {
          name: "LinkedIn Ads",
          can: "Image, vidéo, carrousel, document, événement, text ad, conversation ads, et plus.",
          boost: "Oui.",
          audiences: "Listes contacts/entreprises et retargeting — lecture seule ; tu ne crées pas de nouvelles audiences dans Posty.",
          stats: "Dépenses, CPC, CPM, plus intitulé de poste, séniorité, secteur, taille d’entreprise.",
        },
        {
          name: "TikTok Ads",
          can: "Campagnes vidéo autonomes.",
          boost: "Spark Ads — promouvoir du contenu TikTok natif.",
          audiences: "Custom et Lookalike.",
          stats: "Dépenses, vues, CTR, CPM, quasi temps réel.",
        },
        {
          name: "Pinterest Ads",
          can: "Nouveaux Promoted Pins.",
          boost: "Oui — promouvoir des Pins organiques existants.",
          audiences: "Basique : démographie et pays.",
          stats: "Dépenses, saves, closeups, clics.",
        },
        {
          name: "X Ads",
          can: "Booster des tweets existants ou campagnes autonomes (texte jusqu’à 280 caractères + carte lien).",
          boost: "Oui.",
          audiences: "Lieu et langue. Les listes e-mail sont avancées (au moins 100 utilisateurs actifs récemment).",
          stats: "Dépenses, CPE, CPM, clics sur le lien.",
        },
        {
          name: "OpenAI Ads",
          can: "Cartes dans ChatGPT Free/Go : titre, texte, image, URL. Pas de vidéo.",
          boost: "Sans objet.",
          audiences: "Lieu seulement (pays/région).",
          stats: "Impressions, clics, dépenses, quotidien.",
          note: "Budget sur toute la durée seulement, minimum 1 $. Éligibilité business et marchés : États-Unis, Canada, Australie, Nouvelle-Zélande.",
        },
      ],
      tips: [
        {
          title: "Où se fait le travail pub",
          body: "La connexion est dans Connexions → ADS. La liste des campagnes et les dépenses sont sous Pubs. Le contenu organique — photos, vidéo, séries, promos datées — se lance depuis l’Assistant. Ne demande pas à l’assistant « combien j’ai dépensé sur Meta » ; ouvre Pubs.",
        },
      ],
    },
    {
      id: "assistant",
      title: "L’assistant",
      body: [
        "L’assistant est le cœur du studio. Tu demandes des idées, des textes, une publication, une programmation, un mois de contenu ou une promo à une date précise.",
        "Écris naturellement, comme à un collègue. Pas de commandes spéciales. Nomme les réseaux, quand ça doit sortir, et si tu veux un texte. Si tu ne nommes pas de réseau (et que ce n’est pas une série pour tous), Posty demande — il ne devine pas.",
        "Joins jusqu’à 50 photos ou vidéos, 100 Mo chacune. L’ordre du sélecteur est l’ordre de la série. Attends la fin des uploads (badge orange), puis envoie.",
        "Nouveau chat vide le fil. Utilise-le quand tu changes de sujet ou que tu veux réinitialiser « ne plus demander ».",
      ],
      examples: [
        "Donne-moi trois textes Instagram pour un café un lundi pluvieux.",
        "Publie ça maintenant sur Instagram et TikTok.",
        "À partir de demain, un par jour, sur chaque réseau, à la meilleure heure.",
      ],
      tips: [
        {
          title: "Un message, une intention claire",
          body: "« Publie ça en reel Instagram et TikTok maintenant, et demain à 9 en story Instagram » marche en un message. Mélanger une promo du vendredi avec 20 photos du mois, non.",
        },
      ],
    },
    {
      id: "voice",
      title: "Dictée vocale",
      featured: "voice",
      lead: "Tu parles. Posty écrit. Le plus rapide pour une longue consigne sans clavier.",
      body: [
        "Le micro à côté des pièces jointes n’est pas un gadget — c’est la façon naturelle de travailler dans posty.now. Tu appuies, tu parles comme à un collègue, les mots apparaissent, tu corriges un mot, tu envoies. Idéal avec 50 fichiers, sur téléphone, pour une campagne datée avec réseaux et ton — ou quand tu n’as pas envie de taper.",
        "Ça marche le mieux dans Chrome ou Edge. La première fois, le navigateur demande le micro : Allow. Si tu as cliqué Block, cadenas dans la barre d’adresse, autorise le micro, recharge.",
        "Tant que le micro est orange, Posty continue d’écouter — tu peux pauser et reprendre. Le placeholder devient « Listening… speak now ». Retape sur le micro pour arrêter, puis Envoyer.",
        "Tu peux dicter en français. Si une phrase sort mal, tu la corriges dans le champ — tu ne recommences pas. Les pièces jointes restent ; la voix complète la consigne.",
      ],
      examples: [
        "À partir de demain, un par jour, sur Instagram, TikTok et Facebook, à la meilleure heure, sans texte.",
        "Programme cette photo vendredi à 10, c’est la promo d’automne, Instagram et Facebook seulement, avec une courte phrase de vente.",
      ],
      tips: [
        {
          title: "Dis tout d’un coup",
          body: "Réseaux, jour, heure ou « meilleure heure », texte ou non, même fichier partout ou un par réseau. Plus la phrase est complète, plus la carte de confirmation est propre.",
        },
        {
          title: "Rien n’apparaît dans le champ ?",
          body: "Presque toujours la permission micro, pas un micro cassé. Chrome → cadenas → Microphone → Allow.",
        },
      ],
    },
    {
      id: "ideas",
      title: "Textes, idées, voix de marque",
      body: [
        "Si tu veux seulement de l’inspiration, dis-le. Posty propose 1–3 options et ne publie rien.",
        "Un texte n’est écrit que si tu le demandes (« fais une description », « caption »). Si tu envoies une photo et dis seulement « publie sur Instagram maintenant », ça part sans texte — pas de recyclage d’un vieux caption du fil.",
        "Quand tu fournis le texte, il est utilisé tel quel. S’il est trop long pour un réseau (280 caractères sur X), il est coupé à la limite et on te le dit.",
        "Tu peux décrire la voix de marque : « on est une boulangerie chaleureuse, pas d’emoji, pas de slang. » Posty la garde dans la conversation pour que les brouillons suivants restent dans le ton.",
      ],
      examples: [
        "Écris une courte description, cinq hashtags, ton chaleureux.",
        "On est un studio photo. Voix : claire, pas de superlatifs. Retiens ça.",
      ],
      tips: [
        {
          title: "Ton texte fait loi",
          body: "Si tu as déjà le texte de campagne, colle-le ou dicte-le. Posty ne le réécrit pas. Demande l’IA seulement pour des variantes.",
        },
      ],
    },
    {
      id: "publish",
      title: "Publier maintenant",
      body: [
        "Joins un média si le réseau l’exige (Instagram, TikTok, YouTube, Pinterest). Nomme les réseaux. Confirme sur la carte.",
        "« Tous les réseaux », « partout », « everywhere » = tous les comptes de publication connectés. Tu peux exclure : « partout sauf LinkedIn ».",
        "Ce n’est pas en ligne tant que tu n’as pas la coche verte sur ce réseau. « Publishing now » sur TikTok veut dire que ça traite encore — ce n’est pas une erreur. Attends la coche.",
      ],
      examples: [
        "Publie cette vidéo maintenant sur Instagram en reel et sur TikTok.",
        "Poste sur tous les réseaux sauf Reddit.",
      ],
    },
    {
      id: "schedule",
      title: "Programmer à une heure précise",
      body: [
        "Donne le jour et l’heure. Posty utilise l’horloge en bas (ton heure locale), pas un fuseau caché. « Demain à 18:00 » c’est 18:00 sur cette horloge.",
        "Tu peux combiner : story maintenant sur Instagram et TikTok, et le reel demain à 12:00 sur Instagram.",
      ],
      examples: [
        "Programme ça demain à 18:00 sur TikTok et Instagram.",
        "Vendredi 15:00 sur LinkedIn, ce texte, sans photo.",
      ],
      tips: [
        {
          title: "Vérifie l’horloge",
          body: "En voyage ou en VPN, regarde Heure locale en bas de la barre du studio. Les programmations suivent cette horloge.",
        },
      ],
    },
    {
      id: "best-time",
      title: "Meilleure heure",
      body: [
        "Dis « à la meilleure heure », « heure optimale », « peak time ». Posty n’invente pas 18:00. Il prend la prochaine fenêtre de pic d’après la recherche sectorielle (Sprout, Hootsuite, Later, Buffer), dans ton fuseau, comme approximation de l’audience locale.",
        "Ce ne sont pas tes analytics perso — le tableau des posts est quotidien, pas horaire. C’est un bon défaut ; si tu sais que ton public est réveillé la nuit, donne l’heure. Une heure explicite gagne toujours.",
        "Chaque réseau a son rythme. Instagram en semaine plutôt ~11:00 (stories ~12:00), réserve le soir ~19:00. TikTok plutôt ~19:00. LinkedIn saute les week-ends. Instagram et TikTok à « la meilleure heure » peuvent sortir à des heures différentes — c’est voulu.",
      ],
      examples: [
        "Demain à la meilleure heure, sur Instagram et TikTok.",
        "Déplace le post de vendredi à la meilleure heure.",
      ],
    },
    {
      id: "series",
      title: "Un mois de contenu : série quotidienne",
      body: [
        "Joins jusqu’à 50 fichiers, dans l’ordre de sortie. Dis « à partir de demain, un par jour, sur chaque réseau, à la meilleure heure » ou « 100 posts carrousel avec 5 photos mixées chacun ». Photos et vidéos peuvent se mélanger.",
        "Par défaut c’est cross, pas du copier-coller. Le même jour, chaque réseau reçoit un fichier différent. Facebook peut prendre le média 1, X le 2, TikTok le 3. Le même fichier ne sort pas sur deux réseaux ce jour-là. Sur le mois, les fichiers tournent pour remplir le calendrier.",
        "Si tu veux le même fichier partout ce jour-là, dis-le : « le même sur tous ». Sinon ça reste cross.",
        "TikTok prend les photos (mode photo / carrousel) et la vidéo. YouTube saute les photos — pas de stills. La carte de confirmation montre, par jour, quel réseau prend quel fichier. Les grandes séries demandent toujours la carte ; elles ne la sautent pas.",
      ],
      examples: [
        "À partir de demain, un par jour, sur chaque réseau, à la meilleure heure.",
        "Ces 10 vidéos, le même fichier sur chaque réseau chaque jour, à 19:00.",
      ],
      tips: [
        {
          title: "L’ordre du sélecteur compte",
          body: "Le fichier 1 est le jour 1. Ne les prends pas au hasard si tu as déjà un ordre. Tu peux retirer une pièce jointe avec X avant d’envoyer.",
        },
      ],
    },
    {
      id: "campaign",
      title: "Promos, lancements, dates précises",
      lead: "Une campagne n’est pas une série. Une date précise n’est pas « un par jour ».",
      body: [
        "Si tu as une promo, un lancement, un Black Friday, un événement — charge cet asset tout seul. Dis clairement quand et sur quels réseaux. Un fichier, une consigne, une confirmation.",
        "Si tu poses le créatif de campagne à côté de 29 autres photos du quotidien, la série le traite comme un jour de plus. Il peut sortir mardi au lieu de vendredi, sur TikTok au lieu de Facebook, ou à côté d’un reel qui n’a rien à voir avec l’offre.",
        "Pareil si l’asset est pensé pour la pub. La série quotidienne, c’est du contenu organique en cascade. Une pub payante, un boost, une promo avec deadline — à part, avec une date.",
      ],
      examples: [
        "Programme cette photo le 15 septembre à 10:00, Instagram et Facebook, c’est la promo d’automne. Ce texte, tel quel.",
        "Publie la vidéo de lancement vendredi à 12:00 sur Instagram en reel et sur TikTok. Ça ne fait pas partie de la série.",
      ],
      tips: [
        {
          title: "Deux jobs, deux messages",
          body: "D’abord le lot de 50 (le mois). Puis un nouveau chat ou un nouveau message, un seul fichier, la promo. Ne les lie pas dans le même envoi.",
        },
      ],
    },
    {
      id: "formats",
      title: "Formats par réseau",
      body: [
        "Le reel existe sur Instagram, pas sur TikTok. La story existe sur Instagram (et Facebook), pas sur TikTok. « Sur Instagram en reel et sur TikTok » = Reel Instagram + vidéo TikTok normale.",
        "« Instagram en story et TikTok » = Story Instagram + vidéo TikTok. « En vidéo sur Instagram et TikTok » = Instagram publie la vidéo en Reel automatiquement, TikTok en vidéo.",
        "TikTok prend aussi les photos (une photo ou un carrousel), pas seulement la vidéo.",
        "Nomme un format seulement sur le réseau qui l’a. Pas de reel sur YouTube, pas de story sur LinkedIn.",
        "Instagram, TikTok, YouTube et Pinterest exigent un média. LinkedIn, X, Threads, Bluesky, Facebook et Reddit peuvent être du texte. X coupe à 280 caractères. Ne mélange pas image et vidéo dans le même tweet.",
      ],
      examples: [
        "Cette vidéo : reel Instagram et TikTok, maintenant. Et demain à 9:00, story Instagram.",
      ],
    },
    {
      id: "confirm",
      title: "La carte de confirmation",
      body: [
        "Avant que quelque chose parte, tu vois une carte : réseaux, heure, aperçu, et pour les séries un créneau par jour. Confirmer ou Annuler / modifier.",
        "Tu peux cocher « Don’t ask again in this chat » pour aller plus vite. Ça ne vaut que pour ce fil ; un nouveau chat le réinitialise. Les grandes séries veulent quand même un œil sur la carte — trop facile de programmer 50 jours de travers.",
        "Si tu annules, envoie une nouvelle consigne. La confirmation expire au bout de quelques heures ; onglet ouvert toute la nuit : renvoie la commande.",
      ],
    },
    {
      id: "manage",
      title: "Annuler, reprogrammer, modifier",
      body: [
        "Pour un post programmé depuis le chat, tu peux demander de l’annuler, le déplacer ou changer le texte. Identifie-le par réseau, heure ou un bout de caption.",
        "Reprogrammer, c’est une nouvelle heure ou « à la meilleure heure ».",
      ],
      examples: [
        "Annule le post TikTok de demain.",
        "Déplace le post Instagram de vendredi à 19:00.",
        "Change le texte de lundi : …",
      ],
    },
    {
      id: "posts-list",
      title: "Posts (historique)",
      body: [
        "Posts dans la barre, c’est ton calendrier : brouillons, programmés et publiés, seulement pour les comptes connectés ici. Filtre par réseau, compte, statut, source et période.",
        "Tu vérifies si une série est sortie, si un créneau attend encore, ou tu ouvres le post sur le réseau. Publier et programmer se fait toujours dans l’Assistant ; cette page est l’historique.",
      ],
    },
    {
      id: "messages",
      title: "Messages et commentaires",
      body: [
        "Messages dans la barre a deux onglets : messages directs et commentaires. Tu vois les fils des comptes connectés et tu peux répondre depuis cette page, sans ouvrir l’appli du réseau.",
        "Filtre par plateforme, compte et statut. Il n’apparaît quelque chose que si un compte de publication est connecté dans Connexions → SOCIAL.",
        "Cette inbox, c’est toi. L’agent de leads, s’il est allumé, répond à part sur les nouveaux messages entrants qui montrent une intention — il ne remplace pas cette inbox.",
      ],
    },
    {
      id: "leads",
      title: "Leads",
      lead: "Chaque client a son agent. Tu mets le lien du site, tu l’entraînes, tu lui dis comment parler, puis tu allumes la génération.",
      body: [
        "Dans Leads, colle l’URL du site et clique sur Train the agent. Il lit les pages publiques et les produits. S’il est déjà entraîné, le bouton dit Déjà entraîné.",
        "Dans le champ en dessous, dis comment tu veux que ça se passe : prix, ce qu’il doit repérer (« ça coûte combien », « je suis libre à telle date »), et ton lien de réservation s’il y en a un. C’est ton brief ; ça ne remplace pas le crawl.",
        "Après l’entraînement, clique sur AI lead generation. À partir de là il ne répond qu’aux nouveaux messages reçus après l’allumage — pas aux vieux fils, pas aux messages que tu as envoyés. L’inbox est scannée une fois par jour.",
        "Il se présente comme l’agent posty.now, demande le consentement (OUI) et envoie les conditions, puis répond à partir de ce qu’il a lu sur le site. Les leads apparaissent dans la liste (message, commentaire ou pub) en nouveau / contacté / refusé. La même commande éteint la génération.",
      ],
      tips: [
        {
          title: "Instagram connecté",
          body: "Pour les DM il faut un Instagram (ou un autre canal avec inbox) dans Connexions. Entraîner le site ne publie rien et n’écrit pas tout seul sur les réseaux.",
        },
        {
          title: "Ce n’est pas un blast",
          body: "La génération n’écrit pas aux vieux fils. Un DM de test doit arriver après l’allumage, et la réponse peut attendre le prochain passage quotidien.",
        },
      ],
    },
    {
      id: "stats-posts",
      title: "Analytics",
      body: [
        "Analytics est le tableau des posts organiques : taux d’engagement, portée, abonnés, nombre de posts sur la période, meilleur post, graphiques par plateforme et dans le temps, heatmap pour une bonne heure.",
        "Filtre par plateforme, compte, source (créé ici ou depuis la plateforme) et les 7 / 30 / 90 derniers jours. Le lien du meilleur post l’ouvre sur le réseau. La miniature est l’image du post ; en vidéo, l’icône du réseau s’affiche s’il n’y a pas d’aperçu.",
        "Bluesky et Reddit donnent des stats limitées (likes, commentaires, partages — pas d’impressions). Les autres réseaux connectés donnent le tableau complet, dans la limite de chaque API.",
        "Ici tu vois si le contenu organique accroche. Les dépenses pub ne sont pas ici — elles sont sous Pubs.",
      ],
    },
    {
      id: "stats-ads",
      title: "Pubs",
      lead: "Ici se voient les campagnes et l’argent. Si aucun compte ads n’est connecté, la page est vide — ce n’est pas un bug.",
      body: [
        "Pubs dans la barre : campagnes actives et terminées, sur les réseaux ads connectés. Filtre par plateforme, compte, statut et période. Les nouvelles campagnes se créent dans l’Assistant.",
        "Sers-t’en pour décider si une campagne vaut la peine de continuer, pas pour la confondre avec un post qui a bien marché en organique. Un reel avec beaucoup de likes et une campagne avec un bon CTR sont deux victoires différentes.",
        "Pas de campagnes ? Vérifie Connexions → ADS : le compte est-il connecté et actif sur la période choisie ?",
      ],
      tips: [
        {
          title: "Une petite routine hebdo",
          body: "Une fois par semaine : Analytics (ce qui a accroché en organique) et Pubs (ce qui a coûté et ce que ça a rapporté). Puis, dans l’assistant, tu ajustes la série — ou tu prépares un nouveau créatif daté s’il s’agit d’une promo. Passe les leads en contacté quand tu as parlé à la personne.",
        },
      ],
    },
    {
      id: "phrases",
      title: "Phrases qui marchent bien",
      body: [
        "Pas besoin d’apprendre des commandes. Ces exemples couvrent presque tout ce que le studio peut faire.",
      ],
      examples: [
        "Donne-moi trois textes Instagram pour une boulangerie un lundi matin.",
        "Publie ça maintenant sur Instagram en reel et sur TikTok.",
        "Programme demain à 18:00 sur LinkedIn, ce texte.",
        "Demain à la meilleure heure, sur Instagram et TikTok.",
        "À partir de demain, un par jour, sur chaque réseau, à la meilleure heure.",
        "La même vidéo sur chaque réseau, un par jour, à 19:00.",
        "Programme cette photo le 15 septembre à 10:00, Instagram et Facebook seulement — c’est la promo, pas la série.",
        "Tous les réseaux sauf LinkedIn.",
        "Annule le post TikTok de demain.",
        "Déplace le post de vendredi à la meilleure heure.",
        "Écris une description, ton chaleureux, pas d’emoji.",
        "Ne redemande plus la confirmation dans ce chat.",
        "Crée une campagne Meta ads, trafic vers le site, 10 € par jour.",
      ],
    },
    {
      id: "troubleshoot",
      title: "Si quelque chose ne marche pas",
      body: [
        "La dictée n’écrit rien : Chrome ou Edge, Allow sur le micro, cadenas dans la barre d’adresse. Recharge. Puis le micro dans le chat — il doit rester orange tant que tu parles.",
        "« Publishing now » sur TikTok : attendre. Le traitement n’est pas une erreur. La coche verte est le signal.",
        "Rien ne publie : Connexions → SOCIAL, le réseau est-il connecté ? Instagram/TikTok/YouTube/Pinterest ont-ils un fichier ?",
        "Fichier refusé : 100 Mo max, 50 fichiers max. YouTube saute les photos. TikTok accepte les photos (carrousel).",
        "Confirmation disparue : expirée. Renvoie la commande.",
        "Analytics vide : connecte un compte de publication dans Connexions. Campagnes ads vides : Connexions → ADS, puis Pubs dans la barre. Un Instagram de posts ne remplit pas le tableau ads.",
        "L’agent de leads ne répond pas : est-il entraîné ? AI lead generation est-il allumé ? Le message doit être nouveau, reçu après l’allumage. L’inbox est scannée une fois par jour.",
        "Mauvaise langue : le sélecteur de langue est en bas de la barre du studio, à côté de l’horloge.",
      ],
    },
  ],
};
