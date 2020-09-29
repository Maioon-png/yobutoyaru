FROM ruby:2.5.1
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    mariadb-client \
    yarn
WORKDIR /yobutoyaru
COPY Gemfile Gemfile.lock /yobutoyaru/
RUN bundle install

ADD . /yobutoyaru