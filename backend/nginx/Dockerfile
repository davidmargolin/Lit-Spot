FROM nginx:1.14
COPY nginx.crt /etc/nginx/ssl/
COPY nginx.key /etc/nginx/ssl/
RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/
COPY youcmt.conf /etc/nginx/conf.d/