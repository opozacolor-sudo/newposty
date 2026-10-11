export function foldChatText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLowerCase();
}

export function isAdConfirmReply(text: string) {
  return /^(confirm|confirma|ok|da|yes|oui|si|ja|porneste|porneste reclama|start( the ad)?|lancer( la pub)?|lanzar( el anuncio)?|avvia( l.ads)?|anzeige starten)$/i.test(
    foldChatText(text),
  );
}

export function geoKey(hit: { id: string; name: string }) {
  return { key: hit.id, name: hit.name };
}
