<?php
/**
 * Search results.
 */
get_header();

$found_posts = isset($GLOBALS['wp_query']) ? (int) $GLOBALS['wp_query']->found_posts : 0;
?>
<header class="search-header">
    <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Cautare', 'Search')); ?></p>
    <h1><?php echo esc_html(sprintf(kepoli_ui_text('Rezultate pentru "%s"', 'Results for "%s"'), get_search_query())); ?></h1>
    <p><?php echo esc_html(kepoli_ui_text('Cauta dupa subiect, obicei, intrebare sau semnal al corpului.', 'Search by topic, habit, question, or body signal.')); ?></p>
    <div class="meta-strip" aria-label="<?php echo esc_attr(kepoli_ui_text('Rezumat cautare', 'Search summary')); ?>">
        <span class="meta-strip__item"><?php echo esc_html(sprintf(kepoli_is_english() ? _n('%d result', '%d results', $found_posts, 'kepoli') : _n('%d rezultat', '%d rezultate', $found_posts, 'kepoli'), $found_posts)); ?></span>
    </div>
    <?php kepoli_render_reader_trust_links(); ?>
    <?php get_search_form(); ?>
</header>
<section class="section section--tight">
    <?php if (have_posts()) : ?>
        <div class="section__header section__header--compact">
            <div>
                <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Rezultate disponibile', 'Available results')); ?></p>
                <h2><?php echo esc_html(kepoli_ui_text('Alege ce vrei sa citesti', 'Choose what to read')); ?></h2>
            </div>
        </div>
    <?php endif; ?>
    <div class="post-grid">
        <?php
        if (have_posts()) :
            while (have_posts()) :
                the_post();
                get_template_part('template-parts-card');
            endwhile;
        else :
            echo '<div class="search-empty"><p>' . esc_html(kepoli_ui_text('Nu am gasit rezultate. Incearca un obicei, un simptom general sau una dintre categoriile populare.', 'No results found. Try a habit, a general symptom, or one of the popular categories.')) . '</p></div>';
        endif;
        ?>
    </div>
    <nav class="pagination" aria-label="<?php echo esc_attr(kepoli_ui_text('Paginare', 'Pagination')); ?>">
        <?php the_posts_pagination(['mid_size' => 1]); ?>
    </nav>
</section>
<?php
get_footer();
