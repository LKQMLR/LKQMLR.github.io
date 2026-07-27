/* ── ATEQO · mesure d'audience et conversions publicitaires ───────────────────
   Module autonome, partage par les pages du site. Il fait trois choses :

     1. il n'ecrit RIEN tant que le visiteur n'a pas accepte. Consent Mode
        « basic » : la balise Google n'est meme pas telechargee avant l'accord.
        C'est la lecture la plus sure du RGPD cote CNIL, au prix d'une sous-
        estimation des conversions (cf. note en bas de fichier) ;
     2. il charge GA4 (comportement) et Google Ads (conversions) apres accord ;
     3. il compte chaque clic vers la fiche Google Play comme conversion. C'est
        le signal le plus proche du revenu qu'un site puisse mesurer, et c'est
        lui qui pilotera les encheres de la campagne Search.

   TANT QUE LES IDENTIFIANTS CI-DESSOUS SONT VIDES, LE MODULE EST INERTE :
   aucun cookie, aucune banniere, aucune requete reseau, le site se comporte
   exactement comme avant. Il suffit de les renseigner le jour ou les comptes
   Google Analytics et Google Ads existent.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var CONFIG = {
    // GA4 : Administration > Flux de donnees > flux Web > « ID de mesure ».
    // Format G-XXXXXXXXXX.
    GA4_ID: '',

    // Google Ads : Objectifs > Conversions > action « Clic vers Google Play » >
    // « Installer la balise ». L'extrait affiche send_to: 'AW-000000000/AbC_dEf' :
    // la partie AVANT la barre va dans ADS_ID, celle d'APRES dans ADS_LABEL.
    ADS_ID: '',
    ADS_LABEL: '',

    // Lien « Politique de confidentialite » de la banniere. A mettre a jour en
    // meme temps que le reste du site le jour de la bascule vers ateqo.fr.
    PRIVACY_URL: {
      fr: '/policy/',
      en: '/policy/index.en.html',
    },
  };

  // Rien a mesurer = rien a demander. Pas d'identifiant, pas de banniere.
  if (!CONFIG.GA4_ID && !CONFIG.ADS_ID) return;

  // ── Memorisation du choix ───────────────────────────────────────────────────
  // Cle partagee avec l'i18n de la page (cf. index.html) pour afficher la
  // banniere dans la meme langue que le site.
  var LANG_KEY  = 'ateqo_site_lang';
  var STATE_KEY = 'ateqo_site_consent';     // 'granted' | 'denied'
  var DATE_KEY  = 'ateqo_site_consent_at';  // horodatage du choix

  // Duree de validite du choix (recommandations CNIL) : un accord vaut 13 mois,
  // un refus ne doit pas etre represente avant 6 mois.
  var GRANTED_MS = 395 * 24 * 60 * 60 * 1000;
  var DENIED_MS  = 183 * 24 * 60 * 60 * 1000;

  function readStore(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* navigation privee */ }
  }

  // Retourne 'granted', 'denied', ou null si le choix est absent ou perime.
  function readConsent() {
    var state = readStore(STATE_KEY);
    if (state !== 'granted' && state !== 'denied') return null;
    var at = parseInt(readStore(DATE_KEY), 10);
    if (!at) return state;
    var age = Date.now() - at;
    if (age > (state === 'granted' ? GRANTED_MS : DENIED_MS)) return null;
    return state;
  }

  function writeConsent(state) {
    writeStore(STATE_KEY, state);
    writeStore(DATE_KEY, String(Date.now()));
  }

  function detectLang() {
    var saved = readStore(LANG_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
    var nav = (navigator.language || 'fr').toLowerCase();
    return nav.indexOf('fr') === 0 ? 'fr' : 'en';
  }

  // ── Balise Google ───────────────────────────────────────────────────────────
  var tagLoaded = false;

  function loadGoogleTag() {
    if (tagLoaded) return;
    var primary = CONFIG.GA4_ID || CONFIG.ADS_ID;
    if (!primary) return;
    tagLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };

    // Consent Mode v2. On declare l'etat par defaut AVANT toute configuration,
    // puis on l'accorde : la balise n'arrive ici que si le visiteur a accepte,
    // mais l'ordre reste celui attendu par Google.
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });

    window.gtag('js', new Date());
    if (CONFIG.GA4_ID) window.gtag('config', CONFIG.GA4_ID);
    if (CONFIG.ADS_ID) window.gtag('config', CONFIG.ADS_ID);

    // Les appels ci-dessus sont empiles dans dataLayer et rejoues au chargement.
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(primary);
    document.head.appendChild(s);
  }

  // ── Conversion : clic vers la fiche Google Play ─────────────────────────────
  // Ecoute deleguee : un seul ecouteur couvre les sept liens de la page, y
  // compris ceux ajoutes plus tard. Phase de capture pour ne pas dependre de
  // l'ordre des autres gestionnaires.
  function trackPlayClick(position) {
    if (!tagLoaded || typeof window.gtag !== 'function') return;
    if (CONFIG.GA4_ID) {
      window.gtag('event', 'click_play_store', { link_position: position });
    }
    if (CONFIG.ADS_ID && CONFIG.ADS_LABEL) {
      window.gtag('event', 'conversion', {
        send_to: CONFIG.ADS_ID + '/' + CONFIG.ADS_LABEL,
      });
    }
  }

  document.addEventListener('click', function (ev) {
    var target = ev.target;
    if (!target || typeof target.closest !== 'function') return;
    var link = target.closest('a[href*="play.google.com/store/apps"]');
    if (!link) return;
    // Sert a distinguer, dans GA4, quel emplacement de la page convertit :
    // badge du hero, boutons de la grille tarifaire, badge de bas de page.
    trackPlayClick(link.getAttribute('data-track-position') || link.className || 'lien');
  }, true);

  // ── Banniere de consentement ────────────────────────────────────────────────
  var TEXT = {
    fr: {
      aria:    'Gestion des cookies',
      body:    "Ce site dépose des cookies de mesure d'audience afin d'analyser son trafic et d'évaluer ses campagnes publicitaires. Rien n'est déposé sans votre accord.",
      more:    'Politique de confidentialité',
      deny:    'Refuser',
      accept:  'Accepter',
    },
    en: {
      aria:    'Cookie settings',
      body:    'This site uses analytics cookies to measure its traffic and evaluate its advertising campaigns. Nothing is stored without your consent.',
      more:    'Privacy Policy',
      deny:    'Decline',
      accept:  'Accept',
    },
  };

  var STYLES = [
    '#ateqo-consent{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;',
    'padding:14px 16px calc(14px + env(safe-area-inset-bottom,0px));',
    'background:var(--surface,#fff);border-top:1px solid var(--border,rgba(15,25,35,.09));',
    'box-shadow:0 -6px 26px rgba(15,25,35,.12);',
    "font-family:'Inter',-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;",
    'transform:translateY(100%);transition:transform .28s ease}',
    '#ateqo-consent.in{transform:translateY(0)}',
    '#ateqo-consent .ac-w{max-width:940px;margin:0 auto;display:flex;align-items:center;',
    'gap:16px;flex-wrap:wrap;justify-content:space-between}',
    '#ateqo-consent p{flex:1 1 320px;margin:0;font-size:.82rem;line-height:1.5;color:var(--muted,#5b6b7e)}',
    '#ateqo-consent a{color:var(--accent,#2563eb);text-decoration:underline;font-weight:600;white-space:nowrap}',
    '#ateqo-consent .ac-btns{display:flex;gap:10px;flex:0 0 auto}',
    '#ateqo-consent button{font-family:inherit;font-size:.84rem;font-weight:700;cursor:pointer;',
    'padding:10px 22px;border-radius:10px;border:1px solid var(--border,rgba(15,25,35,.09));',
    'transition:background .15s,color .15s,transform .15s}',
    '#ateqo-consent button:hover{transform:translateY(-1px)}',
    '#ateqo-consent .ac-deny{background:transparent;color:var(--muted,#5b6b7e)}',
    '#ateqo-consent .ac-deny:hover{background:var(--surface2,#f7f9fb);color:var(--ink,#17356B)}',
    '#ateqo-consent .ac-accept{background:var(--ink,#17356B);color:#fff;border-color:var(--ink,#17356B)}',
    '@media(max-width:560px){#ateqo-consent .ac-w{gap:12px}',
    '#ateqo-consent .ac-btns{width:100%}#ateqo-consent button{flex:1}}',
    '@media(prefers-reduced-motion:reduce){#ateqo-consent{transition:none}}',
  ].join('');

  var banner = null;
  var stylesInjected = false;

  function removeBanner(animated) {
    if (!banner) return;
    var node = banner;
    banner = null;
    if (!animated) { if (node.parentNode) node.parentNode.removeChild(node); return; }
    node.classList.remove('in');
    setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 320);
  }

  function hideBanner() { removeBanner(true); }

  function showBanner() {
    if (banner) return;
    var lang = detectLang();
    var txt = TEXT[lang] || TEXT.fr;

    // Une seule injection, meme si la banniere est rouverte depuis le pied de page.
    if (!stylesInjected) {
      stylesInjected = true;
      var style = document.createElement('style');
      style.textContent = STYLES;
      document.head.appendChild(style);
    }

    banner = document.createElement('div');
    banner.id = 'ateqo-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', txt.aria);

    var wrap = document.createElement('div');
    wrap.className = 'ac-w';

    var p = document.createElement('p');
    p.textContent = txt.body + ' ';
    var more = document.createElement('a');
    more.href = CONFIG.PRIVACY_URL[lang] || CONFIG.PRIVACY_URL.fr;
    more.target = '_blank';
    more.rel = 'noopener';
    more.textContent = txt.more;
    p.appendChild(more);

    var btns = document.createElement('div');
    btns.className = 'ac-btns';

    // Refuser et Accepter ont le meme poids visuel et la meme taille : la CNIL
    // exige que refuser soit aussi simple qu'accepter.
    var deny = document.createElement('button');
    deny.type = 'button';
    deny.className = 'ac-deny';
    deny.textContent = txt.deny;
    deny.addEventListener('click', function () { writeConsent('denied'); hideBanner(); });

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'ac-accept';
    accept.textContent = txt.accept;
    accept.addEventListener('click', function () {
      writeConsent('granted');
      hideBanner();
      loadGoogleTag();
    });

    btns.appendChild(deny);
    btns.appendChild(accept);
    wrap.appendChild(p);
    wrap.appendChild(btns);
    banner.appendChild(wrap);
    document.body.appendChild(banner);

    // Deux images successives pour que la transition d'entree soit jouee.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (banner) banner.classList.add('in'); });
    });
  }

  // ── Retrait du consentement ─────────────────────────────────────────────────
  // Le RGPD impose que retirer son accord soit aussi simple que le donner. Tout
  // element portant l'attribut data-consent-open rouvre la banniere (cf. le lien
  // « Cookies » du pied de page).
  document.addEventListener('click', function (ev) {
    var target = ev.target;
    if (!target || typeof target.closest !== 'function') return;
    if (!target.closest('[data-consent-open]')) return;
    ev.preventDefault();
    showBanner();
  });

  // Le selecteur de langue de la page ne notifie personne : on se raccroche au
  // clic sur ses boutons. Le gestionnaire propre au bouton s'execute avant ce
  // gestionnaire delegue, la nouvelle langue est donc deja enregistree ici.
  document.addEventListener('click', function (ev) {
    var target = ev.target;
    if (!banner || !target || typeof target.closest !== 'function') return;
    if (!target.closest('[data-lang-btn]')) return;
    removeBanner(false);
    showBanner();
  });

  // ── Demarrage ───────────────────────────────────────────────────────────────
  function init() {
    // Le lien « Cookies » du pied de page est masque dans le HTML : on ne le
    // revele que si une mesure est effectivement active.
    var openers = document.querySelectorAll('[data-consent-open]');
    for (var i = 0; i < openers.length; i++) openers[i].removeAttribute('hidden');

    var state = readConsent();
    if (state === 'granted') { loadGoogleTag(); return; }
    if (state === 'denied') return;
    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ateqoConsent = { open: showBanner, state: readConsent };
})();

/* ── Note importante sur la lecture des chiffres ───────────────────────────────
   Le mode « basic » retenu ici ne mesure QUE les visiteurs ayant accepte. Selon
   le taux d'acceptation, Google Ads sous-estimera donc les conversions, et le
   cout par conversion affiche dans l'interface sera mecaniquement PLUS ELEVE que
   la realite. Il faut en tenir compte avant de conclure qu'une campagne n'est
   pas rentable : comparer les tendances entre campagnes, pas les valeurs
   absolues, et recouper avec les installations remontees par Google Play.

   L'alternative (mode « advanced ») ameliore la mesure grace a la modelisation
   Google, mais envoie des signaux avant tout consentement, ce que la CNIL voit
   d'un mauvais oeil. Elle exige de plus un volume important pour que la
   modelisation s'active, volume hors de portee au budget actuel. Pour basculer :
   charger la balise des le depart et n'appeler gtag('consent','update', ...) que
   sur acceptation.
   ────────────────────────────────────────────────────────────────────────── */
