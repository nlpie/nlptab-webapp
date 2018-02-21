# nlptab-webapp

## Prerequisites

1. Node (https://nodejs.org/en/)
2. Gulp (http://gulpjs.com/)
3. Bower (https://bower.io/)

## Building / Installation

1. In terminal

```
npm install
bower install
gulp
```
2. Edit "dist/config.*.js" to specific nlp-tab URL and add set isSecure=false if you want NLP-TAB to be read-only.
3. Host "dist" directory.

Alternatively, you can use "gulp webserver" to host.

## Elasticsearch configuration

You will need to enable Cross-Origin Resource Sharing in elasticsearch by adding the following to config/elasticsearch.yml.

```yaml
http.cors.enabled: yes
http.cors.allow-origin: "/https?:\\/\\/localhost(:[0-9]+)?/"
```
