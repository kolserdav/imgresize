# Resize image cli node script
Created image previews for big image

## Installation
```
npm i -g @kolserdav/imgresize
```

# Run
```
imgresize --path resources/test.png  --out  tmp/test
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