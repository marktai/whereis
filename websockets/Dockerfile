FROM golang:1.9.2-alpine3.6
RUN apk add  --no-cache git

RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 
ENV GOPATH /app

RUN cd src/main && go get
RUN go build -o main src/main/main.go
CMD ["/app/main"]