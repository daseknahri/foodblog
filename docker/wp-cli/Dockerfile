FROM wordpress:cli-php8.3

USER root

COPY wp-content/themes/kepoli/ /opt/kepoli/wp-content/themes/kepoli/
COPY wp-content/mu-plugins/ /opt/kepoli/wp-content/mu-plugins/
COPY wp-content/plugins/ /opt/kepoli/wp-content/plugins/
COPY seed/ /seed/
COPY content/ /content/
COPY docker/wp-cli/entrypoint.sh /usr/local/bin/kepoli-wp-cli-entrypoint

RUN { echo 'memory_limit=512M'; echo 'upload_max_filesize=64M'; echo 'post_max_size=64M'; } > /usr/local/etc/php/conf.d/kepoli-memory.ini \
    && chmod +x /usr/local/bin/kepoli-wp-cli-entrypoint /seed/bin/bootstrap.sh

ENTRYPOINT ["kepoli-wp-cli-entrypoint"]
