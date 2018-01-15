FROM keymetrics/pm2-docker-alpine:7

COPY . /opt/clinic-flow-editor-server

RUN npm install -g babel-cli

RUN cd /opt/clinic-flow-editor-server && npm install

CMD ["pm2-docker", "start", "/opt/clinic-flow-editor-server/pm2.json" ]
