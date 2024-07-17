# The XW (Typescript) framework

### Introduction

XW (Typescript) framework is a simple Typescript framework with some nice utilties put together. Notable features are:

- Highly extensible internationalization (i18n) support.
- Manageable resources with `XwReleasable` pattern (RAII like).
- Asynchronous operation as first class citizen.
- Logging facades.
- Random facades.
- Definitions of commonly used errors.
- Syntax sugars.


### Installation

XW (Typescript) framework is available from NPM:

```shell
npm install @xirelogy/xwts --save
```


### Using the framework

The main `xw` object can be included for use in your source files:

```typescript
import { xw } from '@xirelogy/xwts';
```
