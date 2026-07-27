# cargoV1-policy — pages relais (ne pas supprimer)

Ce dossier ne contient **aucun contenu réel**. Les pages légales vivent dans le
dépôt `ateqo-policy`, publié sur `/policy/`.

## Pourquoi ce dossier existe

Le dépôt s'appelait `cargoV1-policy` et était publié sur `/cargoV1-policy/`.
Lors de son renommage en `ateqo-policy`, ce chemin est devenu un 404 : GitHub ne
redirige pas les URL des sites Pages de projet lors d'un renommage.

> « all existing information, with the exception of project site URLs, is
> automatically redirected to the new name »
> — [documentation GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)

Ces six fichiers maintiennent donc l'ancien chemin vivant. Chacun redirige en
JavaScript vers son équivalent dans `/policy/`, en conservant la query
string et le fragment.

## Qui dépend encore de ces URL

| Source | Détail |
|---|---|
| Versions de l'app déjà installées | `EMAIL_CONFIRM_REDIRECT`, liens Confidentialité et CGU codés en dur, jamais mis à jour |
| E-mails de confirmation déjà envoyés | liens émis avant la bascule |
| Liens externes | fiche Play, signets, partages |

Le cas critique est `confirmed.html` : c'est la page d'arrivée après
confirmation d'e-mail à l'inscription. Si elle tombe en 404, tout nouvel
inscrit utilisant une ancienne version de l'app se retrouve bloqué.

## Quand pourra-t-on le supprimer

Quand plus aucune version de l'app antérieure à la bascule ne sera en
circulation, ce qui se vérifie dans Play Console sous la répartition par
version. Pas avant. En pratique, prévoir au minimum un an.

L'ancienne URL doit également rester dans la liste blanche
**Supabase → Authentication → URL Configuration → Redirect URLs**
aussi longtemps que ce dossier existe.
