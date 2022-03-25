# Resize image cli node script
Created image previews for big image

## Installation
### Global
```
npm i -g @kolserdav/imgresize
```
### Local
```
npm i --save-dev @kolserdav/imgresize
```
## Run
### Global
```
imgresize --path resources/test.png  --out  tmp/test
```
### Local
- Add to `package.json` the script:
```json
"scripts": {
  "..."
  "imgresize": "imgresize"
  "..."
}
```
- Run command:
```
npm run imgresize --path resources/test.png  --out  tmp/test
```
## Optional config
Add `imgresize` property to `package.json` file:
```json
"imgresize": { 
    "full": null,
    "desktop": 1920,
    "mobile": 760
  },
```
Will be create every image with custom sizes.