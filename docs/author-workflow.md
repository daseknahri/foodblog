# Author Workflow

This repo includes a small `kepoli-author-tools` plugin for writing posts. The plugin keeps its internal name, but the admin workflow is English and designed for beginner publishers running cloned food blogs.

## What Changes In WordPress Admin

- Posts use the classic WordPress editor, so `Add New Post` shows a clear title field and one main content editor.
- Pages keep the normal WordPress editor.
- The post editor toolbar includes `Break`, `2 parts`, and `3 parts` buttons for WordPress post pagination.
- The split buttons try to break long posts at clean section boundaries, especially around `H2` and `H3` headings.
- The setup box includes `Auto split`, so a writer can choose 2 or 3 parts and let the tool apply the split on save. If manual `nextpage` breaks already exist, the plugin leaves them alone.
- The `kuchniatwist post setup` box lets the writer choose `Recipe` or `Article`, then review excerpt, SEO, related links, image metadata, and recipe structured data.
- The main action is `Auto fill`. Extra helper actions stay under `More tools` so the editor remains simple.
- Manual SEO title, meta description, and related-link slugs stay inside `SEO and links`.
- Image and recipe fields are tucked into expandable blocks. Recipe details open automatically for recipe posts.
- The editorial checklist is tucked into a compact expandable block so the writer sees a short status first.
- The plugin can fill empty setup fields after the writer adds a title, pastes enough content, chooses a post type, or inserts a built-in template.
- The Posts list includes kuchniatwist type/readiness columns for quick editorial checks.

## Automation Included

- Excerpt, meta description, SEO title, category, tags, related links, and featured-image metadata can be generated from the current post.
- Recipe schema can be extracted from recipe content when ingredients, steps, timing, and servings are present.
- Internal links can be added automatically when the body has no natural links yet.
- Internal-link suggestions prefer related categories and avoid overusing the same few posts.
- Article auto-links try to balance practical recipes and supporting guide articles.
- The plugin checks language coherence across title, content, meta description, and slug.
- If WordPress still uses a raw title slug, the plugin can shorten and clean it on save.
- Messy GPT heading levels are normalized into a simpler `H2/H3` structure on save.
- Recipe posts can receive a small FAQ block from recipe data that already exists, such as servings, time, and storage notes.
- Seeded launch posts read prefixed image metadata from `content/image-plan.json`.

## How To Use It

1. Go to `Posts` > `Add New`.
2. Add the title in the top field.
3. Write or paste the article or recipe in the main content field.
4. In `kuchniatwist post setup`, choose `Recipe` or `Article`.
5. Click `Auto fill` when you want the main setup pass: SEO title, excerpt, meta description, internal links, image metadata, suggested category, suggested tags, and recipe schema when possible.
6. Open `More tools` only when you want a specific helper, like category suggestions, tag suggestions, recipe schema extraction, or image meta generation.
7. Open `SEO and links` only when you want to override the SEO title, review the meta description, or manually edit related slugs.
8. Open `Image details` only when you want to review or refine featured-image text.
9. For a long article, either click `2 parts` or `3 parts` in the toolbar, or choose `Auto split` in the setup box if you want the plugin to split it on save.
10. Open `Editorial checklist` only when you want the full list of missing items.
11. Near Publish, use `Prepare for publishing` for one last automatic pass.
12. Review generated fields and inserted page breaks before publishing.

## Image Workflow For Seeded Posts

1. Open `content/image-plan.json` and find the post slug.
2. Use the stored `prompt` in your image tool if you want to regenerate or replace the image.
3. Export the final image in a web-friendly format, ideally `webp`, and save it into `content/images/` using the exact `filename` from the plan.
4. Redeploy.
5. The seed flow imports the image, sets it as the featured image, and applies the stored alt text, title, caption, and description automatically.

The split uses WordPress' native `<!--nextpage-->` marker. On the public post page, the theme shows a simple article-parts navigation block under the content.

## Notes

- Use splitting only for genuinely long posts. Short recipes usually read better on one page.
- After splitting, keep each page useful on its own: intro/context first, method/details next, conclusion/resources last.
- For Ezoic or AdSense readiness, do not split posts only to increase ad views. Split only when it improves readability.
- Related slugs should be post URL slugs, for example `creamy-tomato-spinach-pasta` or `how-to-plan-weeknight-dinners`.
- The automatic related-link paragraph is a fallback. When there is time, replace it with natural links inside real paragraphs.
- The excerpt is used in post cards, archives, and the single-post intro. Even when the plugin generates it, the writer should make it sound natural and clear.
- In the Posts list, `Needs work` means the post is missing one or more useful editorial items such as meta description, excerpt, featured image, image alt text, internal links, or recipe schema.
