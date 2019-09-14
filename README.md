# BrowserSync with lerna monorepo

Live reload changes with browserSync in a monorepo setup.

## Options
Open the gulp file and modify the following options:
* BrowserSync server
* `directories_to_ignore`
* `directories_to_watch`
* `files_to_watch`
* `css_preprocessors`

## Directory structure ex:
```
/
/packages
    /package1
        /src
        /dist
    /package2
        /src
        /dist
```

BrowserSync will watch changes on the `dist` directory on every single package. If it's a CSS related change, it will only inject CSS (Even if other file types get compiled like when using Webpack).
