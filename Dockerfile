FROM ruby:2.6

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -; \
    curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add; \
    echo "deb [arch=amd64]  http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list; \
    curl -sS -o - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add; \
    echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list

RUN apt-get update && \
    apt-get install -y \ 
  build-essential \ 
  nodejs \
  postgresql-client-12 \
  unzip xvfb libxi6 libgconf-2-4 \
  google-chrome-stable \
  git-flow \
  libmagic-dev \
  vim

RUN ln -sf /usr/bin/nodejs /usr/local/bin/node; \
    npm install -g yarn

ENV EDITOR=vim \
    BUNDLE_PATH=/bundle \
    BUNDLE_BIN=/bundle/bin \
    GEM_HOME=/bundle PATH="${BUNDLE_BIN}:${PATH}"

EXPOSE 3000 3035 35729 1234 26162

RUN mkdir -p /usr/src/app && mkdir -p /bundle/bin
WORKDIR /usr/src/app

RUN groupadd -g 1000 app && \
    groupadd -g 999 docker && \
    useradd -m -u 1000 -g 999 -s /bin/bash app && \
    chown -R app:docker /bundle

COPY entrypoint.sh /usr/bin
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]

USER app
COPY . ./

CMD ["bundle", "exec", "rails", "server", "--binding", "0.0.0.0"]
