# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Oefengemak.nl** is a Dutch website for generating and printing practice worksheets (oefenbladen), primarily for arithmetic exercises. The app is a static Jekyll site with client-side JavaScript generation of exercises.

**Current state:** This is a legacy application built with older tech (jQuery, Bootstrap 3, Jekyll). There is active redesign work in progress on the `redesign` branch.

## Exercise Types

The site supports these exercise types:
- **Splitsen**: Breaking apart numbers (e.g., 25 → 20 + 5)
- **Plus**: Addition exercises (with variations: `6 + 5 = ?`, `? + 5 = 30`, `6 + ? = 30`)
- **Min**: Subtraction exercises (similar variations to Plus)
- **Tafels**: Multiplication tables (times tables)
- **Delen**: Division (up to 100)
- **Breuken**: Fractions (up to 100)

Each exercise type has a corresponding HTML page and JavaScript file that uses the core `generator.js` utilities.

## Architecture

**Core components:**
- **Jekyll site**: Generates static HTML from layouts and pages
  - `_layouts/default.html`: Main layout with navbar and analytics
  - `_includes/`: Template partials (e.g., exercise_output.html)
  - Exercise pages (*.html): Configuration UI + inline JS rendering
- **JavaScript**: Client-side exercise generation
  - `js/generator.js`: Core utilities for shuffling, generating mixed exercise sets
  - `js/{exercise-type}.js`: Exercise-specific generation functions (e.g., `generatePlusSommen()`)
  - Inline JS in each exercise page: Config handling, DOM rendering, print functionality
- **Static files**: Bootstrap CSS, jQuery, Google Fonts, images

**Data flow:**
1. User sets options in the config panel (e.g., number range, exercises per block, exercise type)
2. Click "Generate" → calls exercise-specific function (e.g., `generatePlusSommen()`)
3. `generateMixedExercises()` creates shuffled set from multiple number ranges
4. `renderBlocks()` generates two versions: student (with blanks) and teacher (with answers)
5. Click "Print" → browser's native print dialog

## Development

### Setup
```bash
# Install dependencies (Ruby + Jekyll)
bundle install

# Start local dev server with hot reload
bundle exec jekyll serve

# Or run in Docker
docker run --rm \
  --volume="$PWD:/srv/jekyll:Z" \
  --publish 4000:4000 --publish 35729:35729 \
  jekyll/jekyll \
  jekyll serve --draft --livereload
```

Visit `http://localhost:4000` (or `http://localhost:4000/index.html` if using Docker)

### Build for production
```bash
bundle exec jekyll build
# Output goes to _site/
```

## Key Files

- `config.json`: Contains app configuration (may be legacy/unused)
- `_config.yml`: Jekyll configuration with sitemap plugin
- `Gemfile`: Ruby dependencies (Jekyll, jekyll-sitemap)
- `.gitignore`: Excludes Jekyll build artifacts

## Notes for Redesign

When redesigning:
- The current JavaScript is tightly coupled to HTML DOM (jQuery selectors, inline scripts)
- The `generator.js` utilities for shuffling and exercise generation are reusable
- Each exercise type's generation function signature varies slightly
- Google Analytics integration is embedded in the default layout
- Bootstrap 3 CSS is legacy and should likely be replaced

## Design Reference

Check `specs/frontpage-design.png` for the current redesign vision.
