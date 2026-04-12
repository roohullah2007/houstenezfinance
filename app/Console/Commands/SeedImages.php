<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SeedImages extends Command
{
    protected $signature = 'app:seed-images';
    protected $description = 'Copy seed images from public/seed-images to storage/app/public';

    public function handle(): void
    {
        $source = public_path('seed-images');
        $dest = storage_path('app/public');

        if (!File::isDirectory($source)) {
            $this->warn('No seed-images directory found. Skipping.');
            return;
        }

        // Copy all directories and files
        foreach (File::allFiles($source) as $file) {
            $relativePath = $file->getRelativePathname();
            $destPath = $dest . '/' . $relativePath;

            if (File::exists($destPath)) {
                continue; // Don't overwrite existing files
            }

            File::ensureDirectoryExists(dirname($destPath));
            File::copy($file->getPathname(), $destPath);
            $this->line("Copied: {$relativePath}");
        }

        $this->info('Seed images copied to storage.');
    }
}
