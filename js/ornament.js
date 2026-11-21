// Кыргыз оюму (кочкор мүйүз) — SVG. Түсү currentColor аркылуу.
window.ORNAMENT = {
  // Бир мүйүз жуп (горизонталдык бөлгүч)
  divider:
    '<svg class="orn-divider" viewBox="0 0 240 40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
      '<path d="M120 30 C120 16 108 8 98 12 C88 16 90 30 100 28 C106 27 106 20 101 20"/>' +
      '<path d="M120 30 C120 16 132 8 142 12 C152 16 150 30 140 28 C134 27 134 20 139 20"/>' +
      '<path d="M86 22 H20 M154 22 H220"/>' +
      '<circle cx="14" cy="22" r="2.4" fill="currentColor"/><circle cx="226" cy="22" r="2.4" fill="currentColor"/>' +
      '<path d="M120 34 l-4 4 4 -1 4 1z" fill="currentColor"/>' +
    '</svg>',

  // Бурч оюму (бурчтар үчүн)
  corner:
    '<svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
      '<path d="M4 96 V30 C4 14 14 4 30 4 H96"/>' +
      '<path d="M14 86 V36 C14 22 22 14 36 14 H86"/>' +
      '<path d="M30 30 C30 46 46 52 54 44 C62 36 54 24 44 28 C38 30 40 38 45 37"/>' +
      '<circle cx="14" cy="96" r="2" fill="currentColor"/><circle cx="96" cy="14" r="2" fill="currentColor"/>' +
    '</svg>',

  // Ромб тасма (фон үчүн)
  band:
    '<svg class="orn-band" viewBox="0 0 120 16" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2">' +
      '<path d="M0 8 L10 2 L20 8 L10 14 Z M20 8 L30 2 L40 8 L30 14 Z M40 8 L50 2 L60 8 L50 14 Z M60 8 L70 2 L80 8 L70 14 Z M80 8 L90 2 L100 8 L90 14 Z M100 8 L110 2 L120 8 L110 14 Z"/>' +
    '</svg>'
};
