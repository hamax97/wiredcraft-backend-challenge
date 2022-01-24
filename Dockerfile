FROM node:16.13.2

USER node

ARG src=/home/node/src
RUN mkdir -p ${src}
WORKDIR ${src}

# Copying package.json before the entire source will cache it.
# If it's not cached like this, everytime you cange the source
# the dependencies will be reinstalled even if you didn't add one.
ADD package.json ${src}
RUN npm i --silent

ADD . ${src}

CMD npm start
