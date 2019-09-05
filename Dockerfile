FROM node:10.13.0
MAINTAINER AgilityJin agility_jin@outlook.com
RUN mkdir -p /sand_carving_mobile \
    && npm config set registry http://r.cnpmjs.org/
WORKDIR /sand_carving_mobile
COPY . /sand_carving_mobile
RUN npm install
EXPOSE 8080
# 该容器不需要持续运行,build完对应资源挂载卷即可
ENTRYPOINT ["npm", "run"]
CMD ["start"]