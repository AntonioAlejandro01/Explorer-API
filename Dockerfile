FROM node:latest as builder

WORKDIR /opt/server

COPY . .

RUN npm install
RUN npm run build

FROM node:latest

WORKDIR /opt/server

COPY --from=builder /opt/server/dist /opt/server/
COPY --from=builder /opt/server/package.json /opt/server/
COPY --from=builder /opt/server/package-lock.json /opt/server/
COPY --from=builder /opt/server/.env /opt/server/
COPY --from=builder /opt/server/run.sh /opt/server/
COPY --from=builder /opt/server/src/public /opt/server/public
RUN npm install --production=only

RUN mkdir -p ./storage/qr

CMD ["bash","./run.sh"]

