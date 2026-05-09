<?php
/**
 * Main index fallback.
 */
get_header();
?>
<header class="archive-header">
    <p class="eyebrow"><?php echo esc_html(kepoli_site_name()); ?></p>
    <h1><?php echo esc_html(kepoli_ui_text('Articole si ghiduri', 'Health facts and guides')); ?></h1>
    <p><?php echo esc_html(sprintf(kepoli_ui_text('Toate materialele %s, de la semnale ale corpului la obiceiuri si explicatii practice.', 'All %s posts, from body signals to habits and practical explainers.'), kepoli_site_name())); ?></p>
</header>
<section class="section section--tight">
    <div class="post-grid">
        <?php
        if (have_posts()) :
            while (have_posts()) :
                the_post();
                get_template_part('template-parts-card');
            endwhile;
        else :
            echo '<p>' . esc_html(kepoli_ui_text('Nu am gasit articole.', 'No posts were found.')) . '</p>';
        endif;
        ?>
    </div>
    <nav class="pagination" aria-label="<?php echo esc_attr(kepoli_ui_text('Paginare', 'Pagination')); ?>">
        <?php the_posts_pagination(['mid_size' => 1]); ?>
    </nav>
</section>
<?php
get_footer();
