# Changelog

## 2.8.6 (2021-01-27)

- Fix: image url in imageFunction ([#159](https://github.com/netlify/next-on-netlify/pull/159))

## 2.8.5 (2021-01-26)

- Put back next/image support ([#158](https://github.com/netlify/next-on-netlify/pull/158))
- Fix: strip file extension when checking if route is dynamic ([#155](https://github.com/netlify/next-on-netlify/pull/155))
- Fix: prevent copy of .public to .public ([#146](https://github.com/netlify/next-on-netlify/pull/146))
- Fix: add check if pages-manifest exists before reading ([#147](https://github.com/netlify/next-on-netlify/pull/147))
- Fix: throw error if .next/static cannot be found ([#148](https://github.com/netlify/next-on-netlify/pull/148))
- Fix: remove unnecessary * from headers rule ([#152](https://github.com/netlify/next-on-netlify/pull/152))

## 2.8.4 (2021-01-18)

- Fix: check existence of dirs before reading them in file tracking logic ([#150](https://github.com/netlify/next-on-netlify/pull/150))

## 2.8.3 (2021-01-18)

- Revert next/image support until jimp module issue is resolved ([#149](https://github.com/netlify/next-on-netlify/pull/149))
- Revert route/redirect sorting logic to static then dynamic ([#145](https://github.com/netlify/next-on-netlify/pull/145))
- Fix: incorrect headers syntax & broken local cypress ([#144](https://github.com/netlify/next-on-netlify/pull/144))

## 2.8.2 (2021-01-16)

- Fix: failing windows test for file tracking ([#142](https://github.com/netlify/next-on-netlify/pull/142))

## 2.8.1 (2021-01-14)

- Fix: file tracking bug where publishDir was being used for functons cleaning too ([#ba41f](https://github.com/netlify/next-on-netlify/commit/ba4f141808b40c0a6c5eecdd48562e35403951f7))

## 2.8.0 (2021-01-14)

- Fix: fallback blocking would cause builds to crash ([#139](https://github.com/netlify/next-on-netlify/pull/139))
- next/image initial support ([#138](https://github.com/netlify/next-on-netlify/pull/138))
- generate headers file to override static chunks cache control ([#141](https://github.com/netlify/next-on-netlify/pull/141))
- track NoN files for configured dirs to clean before each run ([#134](https://github.com/netlify/next-on-netlify/pull/134))

## 2.7.2 (2021-01-06)

- Hotfix: index gsp pages caused builds to fail in i18n ([#75](https://github.com/netlify/next-on-netlify/pull/131))

## 2.7.1 (2021-01-06)

- Hotfix: update logic for allowing colliding route redirects ([#130](https://github.com/netlify/next-on-netlify/pull/130))

## 2.7.0 (2021-01-03)

- Support for i18n in Next 10 ([#75](https://github.com/netlify/next-on-netlify/pull/75))
- dependabot: node-notifier from 8.0.0 to 8.0.1 ([#125](https://github.com/netlify/next-on-netlify/pull/125))
- Expose Netlify function params as netlifyFunctionParams ([#119](https://github.com/netlify/next-on-netlify/pull/119))
- Fix: local cypress cache control ([#118](https://github.com/netlify/next-on-netlify/pull/118))
- Fix: add res.finished to createResponseObject ([#117](https://github.com/netlify/next-on-netlify/pull/117))
- Fix: Windows support ([#101](https://github.com/netlify/next-on-netlify/pull/101))
- Improve logs for specified functions/publish dirs ([#100](https://github.com/netlify/next-on-netlify/pull/100))

## 2.6.3 (2020-11-18)

- Fix: don't empty publish/function paths unless they're default ([#94](https://github.com/netlify/next-on-netlify/pull/94))
- Fix: add support for res.redirect in API routes ([#93](https://github.com/netlify/next-on-netlify/pull/93))
- Remove next-aws-lambda dependency (now inlined) ([#92](https://github.com/netlify/next-on-netlify/pull/92))
- Fix: Node.js version in CI ([#91](https://github.com/netlify/next-on-netlify/pull/91))

## 2.6.2 (2020-11-17)

- Upgrade version range of `next` ([#90](https://github.com/netlify/next-on-netlify/pull/90))
- Configurable functionsDir and publishDir (via exported func only) ([#89](https://github.com/netlify/next-on-netlify/pull/89))
- Support for Node 10.17.0 ([#84](https://github.com/netlify/next-on-netlify/pull/84))
- CI tests ([#83](https://github.com/netlify/next-on-netlify/pull/83))

## 2.6.1 (2020-11-15)

- Hotfix: no-cache Cache-Control for preview mode ([Commit](https://github.com/netlify/next-on-netlify/commit/990b4a8c31bbd0b89ef2620d9c30493a1fed08f4))
- README updates
- Update isRootCatchAllRedirect condition ([#77](https://github.com/netlify/next-on-netlify/pull/77))

## 2.6.0 (2020-10-26)

- Support for SSG Preview Mode ([#50](https://github.com/netlify/next-on-netlify/pull/50))
- Expose core setup logic to be required as a package ([#64](https://github.com/netlify/next-on-netlify/pull/64))
- Miscellaneous README cleanup

## 2.5.2 (2020-10-23)

- README rebrand
- Fix: update logs to correct path constants in prepareFolders ([#58](https://github.com/netlify/next-on-netlify/pull/58))
- Fix: show experimental-serverless-trace target option in README ([#59](https://github.com/netlify/next-on-netlify/pull/59))
- Fix: x-forwarded-host is undefined on Netlify ([#54](https://github.com/netlify/next-on-netlify/pull/54))
- Fix: No-op redirect for root catch-all page chunks ([#52](https://github.com/netlify/next-on-netlify/pull/52))
- prettier pre-commit hook

## 2.5.1 (2020-10-02)

- Fix: broken redirects for optional catch-alls ([#47](https://github.com/netlify/next-on-netlify/pull/47))

## 2.5.0 (2020-10-01)

- Copy host property from headers to multiValueHeaders [#44](https://github.com/netlify/next-on-netlify/pull/44)
- More support for ISR (getStaticProps with revalidate) [Discussion](https://github.com/netlify/next-on-netlify/issues/35) / [Commit](https://github.com/netlify/next-on-netlify/commit/ef45cc5aa0ea6755544901ea364533b40f78cdcb)
- Fixed redirect for index with getServerSideProps [#39](https://github.com/netlify/next-on-netlify/pull/39)

## 2.4.0 (2020-09-05)

- Add support for base64 encoding in responses returned from SSR pages and API
  endpoints
- Reduce the number of rewrites generated by skipping SSG & HTML pages with
  static routing. These pages are routed automatically by Netlify ([#26](https://github.com/netlify/next-on-netlify/issues/26))
- Limit the default number of lines of build output to 50. More or fewer lines can be shown by running `next-on-netlify` with the option `--max-log-lines XX`. See `next-on-netlify --help` and [this comment](https://github.com/netlify/next-on-netlify/issues/26#issuecomment-660684261).
- Remove workaround for making `404.html` work with `netlify dev`. The
  workaround is no longer required because [`netlify dev` has been patched](https://github.com/netlify/cli/pull/1159).

## 2.3.2 (2020-08-04)

- Fix: Bump elliptic to v6.5.3 to fix [CVE-2020-13822](https://github.com/advisories/GHSA-vh7m-p724-62c2)

## 2.3.1 (2020-07-19)

- Fix: Correctly get distDir from `next.config.js` when config is a function ([#25](https://github.com/netlify/next-on-netlify/issues/25))

## 2.3.0 (2020-06-26)

- Add support for [NextJS Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode) ([#10](https://github.com/netlify/next-on-netlify/issues/10))

  Note: NextJS Preview Mode does not work on pages that are pre-rendered (pages with `getStaticProps`). Netlify currently does not support cookie-based redirects, which are needed for supporting preview mode on pre-rendered pages. Preview mode works correctly on any server-side-rendered pages (pages with `getInitialProps` or `getServerSideProps`).

- Use `multiValueHeaders` in Netlify Functions for incoming requests and for outgoing responses. This offers many benefits over plain `headers`, such as setting multiple cookies within one response.

## 2.2.0 (2020-06-22)

- Add support for defining custom redirects in a `_redirects` file at the project root directory. Unlike redirects specified in your `netlify.toml` file, the redirects from the `_redirects` file take precedence over those generated by `next-on-netlify` ([#21](https://github.com/netlify/next-on-netlify/pull/21))

## 2.1.0 (2020-06-14)

- Add support for [NextJS optional catch-all routes](https://nextjs.org/docs/api-routes/dynamic-api-routes#optional-catch-all-api-routes) ([#15](https://github.com/netlify/next-on-netlify/pull/15))
- Fix: An `index.js` page with `getStaticProps` no longer causes `next-on-netlify` to fail ([#18](https://github.com/netlify/next-on-netlify/pull/18))
- Fix: Catch-all routes now correctly require that at least one URL parameter is present (unlike optional catch-all routes) ([479b7e7](https://github.com/netlify/next-on-netlify/commit/479b7e73f1a11778eb5ef66ded02aa1c17e38697))
- Fix: Data routes now correctly work for pages with catch-all routing ([0412b45](https://github.com/netlify/next-on-netlify/commit/0412b45fe3917a082be563c1720e85cf3affd4e1))

## 2.0.0 (2020-06-02)

- **Breaking: You must change your `netlify.toml` configuration for next-on-netlify v2.0.0.** Please [look at the README](https://github.com/netlify/next-on-netlify#3-configure-netlify) for the latest configuration.  
  `next-on-netlify` now builds pre-rendered pages and static assets in `out_publish`. Netlify Functions for SSR pages are built to `out_functions`.
- Add support for `getStaticProps` ([#7](https://github.com/netlify/next-on-netlify/issues/7))
- Add support for `getStaticPaths` with and without fallback ([#7](https://github.com/netlify/next-on-netlify/issues/7))
- Add support for `getServerSideProps` ([#7](https://github.com/netlify/next-on-netlify/issues/7))
- Query string parameters are now correctly passed to Next Pages and API endpoints ([#9](https://github.com/netlify/next-on-netlify/issues/9))
- Response headers are now correctly set ([#9](https://github.com/netlify/next-on-netlify/issues/9#issuecomment-633288179))
- When a user encounters a 404, `next-on-netlify` now display the NextJS 404 page rather than Netlify's default 404 page. You can [customize the NextJS 404 page](https://nextjs.org/docs/advanced-features/custom-error-page#customizing-the-404-page).
  ([#2](https://github.com/netlify/next-on-netlify/issues/2))
- Every page with server-side rendering is now converted to a stand-alone Netlify Function. Previously, all SSR pages were bundled in a single Netlify Function.
- `next-on-netlify` now prints out which pages are being converted to Netlify Functions for SSR, which pages are served as pre-rendered HTML, and the redirects that are being generated.
- Adding custom redirects via a `_redirects` file in the project root is no longer supported. Let me know if you want this back. Or define your redirects in `netlify.toml`.

## 1.2.0 (2020-04-26)

- Add support for custom NextJS build directory: If `distDir` is specified in
  `next.config.js`, next-on-netlify will use that directory. If no `distDir` is
  specified, it will look for the default directory (`.next`).

## 1.1.0 (2020-04-19)

- Add support for catch-all routes ([#1](https://github.com/netlify/next-on-netlify/pull/1), [#5](https://github.com/netlify/next-on-netlify/pull/5))
- README: Fix instructions for local preview

## 1.0.1 (2020-01-27)

- Add README
- Add CHANGELOG

## 1.0.0 (2020-01-26)

Initial release of next-on-netlify
