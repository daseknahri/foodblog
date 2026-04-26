<?php
/**
 * About kuchniatwist page.
 */
get_header();
$site_name = kepoli_site_name();
?>
<?php while (have_posts()) : the_post(); ?>
    <section class="section section--tight">
        <header class="archive-header archive-header--compact">
            <?php kepoli_breadcrumbs(); ?>
            <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Identitate', 'About the publication')); ?></p>
            <h1><?php the_title(); ?></h1>
            <p><?php echo esc_html(sprintf(kepoli_ui_text('Cine scrie pe %s, cum alegem subiectele si ce pot astepta cititorii de la fiecare reteta sau articol publicat aici.', 'Who writes for %s, how topics are chosen, and what readers can expect from each recipe or article published here.'), $site_name)); ?></p>
        </header>
        <div class="content-layout content-layout--single">
            <div class="entry">
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
                <?php echo kepoli_newsletter_cta('newsletter-cta--compact newsletter-cta--about'); ?>
                <div class="page-grid">
                    <section class="page-panel">
                        <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Ce publicam', 'What we publish')); ?></p>
                        <h2><?php echo esc_html(kepoli_ui_text('Retete si articole pentru bucataria de acasa', 'Recipes and articles for everyday home cooking')); ?></h2>
                        <p><?php echo esc_html(sprintf(kepoli_ui_text('%s combina retete romanesti, idei de sezon si ghiduri utile pentru cititorii care vor sa gateasca mai clar, mai linistit si cu mai putina risipa.', '%s combines practical recipes, seasonal ideas, and useful kitchen guides for readers who want to cook with more clarity and less waste.'), $site_name)); ?></p>
                    </section>
                    <section class="page-panel">
                        <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Cum lucram', 'How we work')); ?></p>
                        <h2><?php echo esc_html(kepoli_ui_text('Claritate, verificare si ajustari practice', 'Clarity, review, and practical adjustments')); ?></h2>
                        <p><?php echo esc_html(kepoli_ui_text('Textele sunt scrise pentru uz casnic, cu pasi explicati, timpi orientativi si note despre gust, textura si pastrare. Cand o informatie trebuie corectata sau clarificata, actualizam continutul.', 'Our content is written for home use, with clear steps, realistic timings, and notes about taste, texture, and storage. When a detail needs correction or clarification, we update the article.')); ?></p>
                    </section>
                    <section class="page-panel">
                        <p class="eyebrow"><?php echo esc_html(kepoli_ui_text('Corecturi', 'Corrections')); ?></p>
                        <h2><?php echo esc_html(kepoli_ui_text('Ne poti scrie direct', 'Write to us directly')); ?></h2>
                        <p><?php echo esc_html(sprintf(kepoli_ui_text('Pentru observatii, corecturi sau intrebari editoriale, foloseste pagina de contact sau scrie direct autoarei. %s trateaza corecturile ca parte normala dintr-o publicatie utila si responsabila.', 'For corrections, questions, or editorial feedback, use the contact page or write directly to the author. %s treats corrections as a normal part of running a useful and responsible publication.'), $site_name)); ?></p>
                    </section>
                </div>
                <div class="page-links">
                    <a href="<?php echo esc_url(kepoli_author_page_url()); ?>"><?php echo esc_html(kepoli_ui_text('Despre autoare', 'About the author')); ?></a>
                    <a href="<?php echo esc_url(kepoli_contact_page_url()); ?>"><?php echo esc_html(kepoli_ui_text('Contact', 'Contact')); ?></a>
                    <a href="<?php echo esc_url(kepoli_advertising_page_url()); ?>"><?php echo esc_html(kepoli_ui_text('Publicitate si consimtamant', 'Advertising and consent')); ?></a>
                    <a href="<?php echo esc_url(kepoli_privacy_policy_url()); ?>"><?php echo esc_html(kepoli_ui_text('Politica de confidentialitate', 'Privacy policy')); ?></a>
                    <a href="<?php echo esc_url(kepoli_cookie_policy_url()); ?>"><?php echo esc_html(kepoli_ui_text('Politica de cookies', 'Cookie policy')); ?></a>
                </div>
            </div>
        </div>
    </section>
<?php endwhile; ?>
<?php
get_footer();
