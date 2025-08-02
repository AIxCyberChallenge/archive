source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.

# For GitHub Pages compatibility, we use the github-pages gem
# which includes the correct Jekyll version (3.9.5)
# gem "jekyll", "~> 4.3.0"  # Commented out for GitHub Pages compatibility

# This is the default theme for new Jekyll sites.
gem "minima", "~> 2.5"

# GitHub Pages gem - this includes Jekyll 3.9.5 and all compatible plugins
gem "github-pages", "~> 231", group: :jekyll_plugins

# Ruby 3.4+ compatibility fixes
gem "csv", "~> 3.0"
gem "base64", "~> 0.1"
gem "bigdecimal", "~> 3.0"
gem "webrick", "~> 1.8"

# Optional: Remove Faraday warning
gem "faraday-retry", "~> 2.0"

# If you have any plugins, put them here!
# Note: github-pages gem includes most standard Jekyll plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  # jekyll-seo-tag and jekyll-sitemap are included in github-pages
  # gem "jekyll-seo-tag", "~> 2.8"  # Included in github-pages
  # gem "jekyll-sitemap", "~> 1.4"  # Included in github-pages
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# For local development and testing
gem "html-proofer", "~> 5.0", group: :test
