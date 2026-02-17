# Use Ruby 3.2 image (compatible with the site requirements)
FROM ruby:3.2-slim

# Install system dependencies (including make)
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    make \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Run the project's own setup
RUN make setup

# Expose port 4000 for Jekyll server
EXPOSE 4000

# Set environment variables for development
ENV JEKYLL_ENV=development

# Use the project's own serve command
CMD ["make", "serve"]