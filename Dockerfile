FROM node:10.13.0
MAINTAINER AgilityJin agility_jin@outlook.com
RUN mkdir -p /sand_carving_mobile \
    && npm config set registry http://r.cnpmjs.org/
WORKDIR /sand_carving_mobile
COPY . /sand_carving_mobile
RUN npm install \
    && npm update
# EXPOSE 8080
ENTRYPOINT ["npm", "run"]
CMD ["build:h5"]