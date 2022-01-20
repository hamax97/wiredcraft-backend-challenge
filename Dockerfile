FROM node:16.13.2

# OS setup.

ARG username=
ARG uid=
ARG gid=
ARG home=
ARG src=

ENV USER ${username}
ENV UID ${uid}
ENV GID ${gid}
ENV HOME ${home}
RUN adduser --disabled-password \
  --gecos "Non-root user" \
  --uid ${UID} \
  --gid ${GID} \
  --home ${HOME} \
  ${USER}

USER ${USER}

# App setup.

RUN mkdir -p ${src}
WORKDIR ${src}

# Copying package.json before the entire source will cache it.
# If it's not cached like this, everytime you cange the source
# the dependencies will be reinstalled even if you didn't add one.
ADD --chown=${UID}:${GID} package.json ${src}
RUN npm i --silent

ADD --chown=${UID}:${GID} . ${src}

CMD npm start
