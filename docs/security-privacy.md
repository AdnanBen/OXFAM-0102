The platform implements various security & privacy measures.

!> Survivors will often only have access to a shared device, which may belong to an abuser. Therefore, one of the major concerns is to reduce the likelihood of an abuser seeing what pages a survivor looks at. Unfortunately, we cannot force nor accurately detect private browsing/'incognito' mode to help prevent this.

## Panic button

Survivors may not have a private space in which to use the platform, therefore an always-visible button at the top of the page can be clicked to immediate leave the website to another innocuous website in an emergency.

This is implemented using a static page at `l.html` (innocuously-named) then performs a `window.location.replace()` call to replace the history URL, thereby ensuring that calls to the browser's back button will still cause a redirect.

## Reduction of history entries

The main source of risk is for an abuser to see entries in their browser's history.

To reduce this risk, the platform uses the Next.JS [`<Link>`](https://nextjs.org/docs/api-reference/next/link) `replace` prop for all internal links, which replaces the current history state instead of adding a new entry.

Whilst this does reduce the number of history entries, it does not remove traces completely. Additionally, some browsers treat replacement differently (see e.g., https://bugzilla.mozilla.org/show_bug.cgi?id=753264), therefore this technique cannot be fully relied on.

## No registration required

Survivors may not have access to a personal email address and the burden of remembering a password, or risk of it being found if written down, is too great. Therefore, survivors do not need to register or sign in to use any of the site's functionalities.

## No use of Cookies

Cookies inherently leave a trace of visiting a site, which increases the risk of an abuser finding that a survivor has used the site. Consequently, no survivor-facing features use Cookies.

## No direct access to URLs

In case an abuser does find a link to a URL of a page on the site (e.g., a forum post found via their browser's history), the platform does not allow direct access to any URL that is not the homepage.

Attempts to access e.g., oxfamsurvivorscommunity.com/forum/4 will redirect to a safe site (e.g., Google) immediately before rendering, reducing the risk of content being found by an abuser.

This is implemented through `getServerSideProps` on all non-homepage pages to ensure that the request is a [Next.js client-transition](https://nextjs.org/learn/basics/navigate-between-pages/client-side). If it is not, then the user is redirected to the `l.html` static page described earlier.

!> This means that a refresh of a page will cause a redirect to the safe site, which may be unwanted, but this was deemed an appropriate balance between usability and privacy.

## Moderator approval

Moderators must be approved by a designated Oxfam contact before they can use the platform. Prior to approval, moderators will be trained and vetted. This is implemented in the [auth microservice](./microservice-auth.md).
