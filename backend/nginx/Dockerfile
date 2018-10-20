FROM nginx:1.14
RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/
COPY litspot.conf /etc/nginx/conf.d/
