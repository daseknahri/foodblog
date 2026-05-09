<?php
/**
 * 404 template.
 */
get_header();
?>
<section class="not-found">
    <p class="eyebrow"><?php esc_html_e('404', 'kepoli'); ?></p>
    <h1><?php echo esc_html(kepoli_ui_text('Pagina nu a fost gasita', 'Page not found')); ?></h1>
    <p><?php echo esc_html(kepoli_ui_text('Pagina cautata nu este aici, dar poti cauta dupa subiect, obicei sau categorie.', 'That page is not here, but you can search by topic, habit, or category.')); ?></p>
    <?php get_search_form(); ?>
    <?php kepoli_render_browse_links(); ?>
</section>
<?php
get_footer();
