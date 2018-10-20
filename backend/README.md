* how to set up local docker env
- docker-machine create -d virtualbox litspot
- eval "$(docker-machine env litspot)"
- docker-compose build
- docker-compose up