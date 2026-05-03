<?php

if (!function_exists('kepoli_seed_target_version')) {
    function kepoli_seed_hash_directory($hash_context, string $directory): void
    {
        if (!is_dir($directory)) {
            hash_update($hash_context, $directory . '|missing-directory');
            return;
        }

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS)
        );

        $files = [];
        foreach ($iterator as $file) {
            if (!$file instanceof SplFileInfo || !$file->isFile()) {
                continue;
            }
            $files[] = $file->getPathname();
        }

        sort($files, SORT_STRING);
        foreach ($files as $file) {
            hash_update($hash_context, $file);
            hash_update_file($hash_context, $file);
        }
    }

    function kepoli_seed_target_version(): string
    {
        static $version = null;

        if ($version !== null) {
            return $version;
        }

        $files = [
            '/seed/bootstrap.php',
            '/content/site-profile.json',
            '/content/categories.json',
            '/content/pages.json',
            '/content/posts.json',
            '/content/image-plan.json',
        ];

        $hash_context = hash_init('sha256');

        foreach ($files as $file) {
            if (!is_readable($file)) {
                hash_update($hash_context, $file . '|missing');
                continue;
            }

            hash_update($hash_context, $file);
            hash_update_file($hash_context, $file);
        }

        kepoli_seed_hash_directory($hash_context, '/content/images');

        $version = 'seed-' . substr(hash_final($hash_context), 0, 16);

        return $version;
    }
}
