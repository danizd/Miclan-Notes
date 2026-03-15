# Comandos Docker esenciales

## Imágenes
```bash
docker build -t nombre .
docker images
docker rmi imagen_id
```

## Contenedores
```bash
docker run -d -p 8080:80 nombre
docker ps
docker ps -a
docker stop contenedor_id
docker rm contenedor_id
```

## Volumes
```bash
docker volume create nombre
docker volume ls
```

## Compose
```bash
docker compose up -d
docker compose down
docker compose logs -f
```
