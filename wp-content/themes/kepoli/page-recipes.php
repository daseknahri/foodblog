<?php
/**
 * Health facts landing page.
 */
get_header();

$fact_categories = get_categories([
    'hide_empty' => true,
    'exclude' => [1],
    'taxonomy' => 'category',
]);
$featured_fact = kepoli_latest_post_by_kind('article');
$page_id = get_queried_object_id();
$page_title = $page_id ? get_the_title($page_id) : '';
$page_content = $page_id ? trim((string) apply_filters('the_content', (string) get_post_field('post_content', $page_id))) : '';
$page_intro = $page_content !== '' ? wp_trim_words(wp_strip_all_tags($page_content), 28, '') : '';
?>
<header class="archive-header">
    <?php kepoli_breadcrumbs(); ?>
    <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Fapte despre sanatate', 'Health facts')); ?></p>
    <h1><?php echo esc_html($page_title !== '' ? $page_title : kepoli_ui_text('Fapte despre sanatate', 'Health facts')); ?></h1>
    <p><?php echo esc_html($page_intro !== '' ? $page_intro : sprintf(kepoli_ui_text('Alege o categorie sau porneste de la cele mai noi articole %s.', 'Choose a category or start with the newest %s health facts.'), kepoli_site_name())); ?></p>
    <?php kepoli_render_reader_trust_links(); ?>
</header>
<?php if ($page_content !== '') : ?>
    <section class="section section--tight">
        <div class="entry-content entry-content--page">
            <?php echo $page_content; ?>
        </div>
    </section>
<?php endif; ?>
<section class="category-band">
    <div class="section">
        <div class="section__header section__header--compact section__header--simple">
            <div>
                <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Navigare rapida', 'Quick browsing')); ?></p>
                <h2><?php echo esc_html(kepoli_ui_text('Alege categoria potrivita', 'Choose the right category')); ?></h2>
            </div>
        </div>
        <div class="category-list category-list--showcase">
            <?php foreach ($fact_categories as $category) : ?>
                <?php
                $category_meta = kepoli_category_card_meta($category);
                $category_image = kepoli_category_card_image_data($category);
                $category_description = trim(wp_strip_all_tags((string) $category->description));
                if ($category_description === '') {
                    $category_description = $category_meta['description'];
                } else {
                    $category_description = wp_trim_words($category_description, 18, '...');
                }
                ?>
                <a class="category-card <?php echo esc_attr(kepoli_tone_class($category->slug) . (!empty($category_image['url']) ? ' category-card--with-image' : '')); ?>" href="<?php echo esc_url(get_category_link($category)); ?>">
                    <?php if (!empty($category_image['url'])) : ?>
                        <span class="category-card__visual" aria-hidden="true">
                            <img src="<?php echo esc_url($category_image['url']); ?>" alt="<?php echo esc_attr(($category_image['alt'] ?? '') !== '' ? $category_image['alt'] : sprintf(kepoli_ui_text('Imagine pentru categoria %s', 'Image for the %s category'), $category->name)); ?>"<?php echo kepoli_dimension_attributes($category_image); ?> loading="lazy" decoding="async">
                        </span>
                    <?php endif; ?>
                    <span class="category-card__top">
                        <span class="category-card__icon" aria-hidden="true"><?php echo esc_html($category_meta['icon']); ?></span>
                        <span class="category-card__count"><?php echo esc_html(sprintf(kepoli_is_english() ? _n('%d fact', '%d facts', $category->count, 'kepoli') : _n('%d fapt', '%d fapte', $category->count, 'kepoli'), $category->count)); ?></span>
                    </span>
                    <strong><?php echo esc_html($category->name); ?></strong>
                    <span class="category-card__description"><?php echo esc_html($category_description); ?></span>
                    <?php if (!empty($category_image['gallery'])) : ?>
                        <span class="category-card__gallery" aria-hidden="true">
                            <?php foreach ($category_image['gallery'] as $gallery_item) : ?>
                                <span class="category-card__thumb">
                                    <img src="<?php echo esc_url($gallery_item['url']); ?>" alt="<?php echo esc_attr(($gallery_item['alt'] ?? '') !== '' ? $gallery_item['alt'] : sprintf(kepoli_ui_text('Imagine pentru categoria %s', 'Image for the %s category'), $category->name)); ?>"<?php echo kepoli_dimension_attributes($gallery_item); ?> loading="lazy" decoding="async">
                                </span>
                            <?php endforeach; ?>
                        </span>
                    <?php endif; ?>
                    <?php if (!empty($category_image['sample'])) : ?>
                        <span class="category-card__sample"><?php echo esc_html(sprintf(kepoli_ui_text('De inceput: %s', 'Start with: %s'), $category_image['sample'])); ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php if ($featured_fact) : ?>
    <section class="section section--tight">
        <div class="section__header section__header--compact">
            <div>
                <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Din prim-plan', 'Featured')); ?></p>
                <h2><?php echo esc_html(kepoli_ui_text('Incepe cu acest articol', 'Start with this health fact')); ?></h2>
            </div>
        </div>
        <article class="lead-story <?php echo esc_attr(kepoli_post_tone_class($featured_fact->ID)); ?>">
            <a class="lead-story__media" href="<?php echo esc_url(get_permalink($featured_fact)); ?>">
                <?php echo kepoli_post_media_markup($featured_fact->ID, 'related'); ?>
            </a>
            <div class="lead-story__body">
                <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Fapt recomandat', 'Featured fact')); ?></p>
                <h3><a href="<?php echo esc_url(get_permalink($featured_fact)); ?>"><?php echo esc_html(get_the_title($featured_fact)); ?></a></h3>
                <p><?php echo esc_html(get_the_excerpt($featured_fact)); ?></p>
                <?php echo kepoli_render_post_card_meta($featured_fact->ID, 'meta-strip meta-strip--inline', 'meta-strip__item'); ?>
            </div>
        </article>
    </section>
<?php endif; ?>
<section class="section">
    <div class="section__header section__header--compact">
        <div>
            <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Toate faptele', 'All health facts')); ?></p>
            <h2><?php echo esc_html(sprintf(kepoli_ui_text('Biblioteca %s', '%s library'), kepoli_site_name())); ?></h2>
        </div>
        <p><?php echo esc_html(kepoli_ui_text('Toate articolele intr-o lista simpla, usor de rasfoit.', 'All health facts in a simple list that is easy to browse.')); ?></p>
    </div>
    <div class="post-grid">
        <?php
        $facts = new WP_Query([
            'post_type' => 'post',
            'posts_per_page' => 24,
            'meta_key' => '_kepoli_post_kind',
            'meta_value' => 'article',
        ]);
        while ($facts->have_posts()) :
            $facts->the_post();
            get_template_part('template-parts-card');
        endwhile;
        wp_reset_postdata();
        ?>
    </div>
</section>
<?php
get_footer();
