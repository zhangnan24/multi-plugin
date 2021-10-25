# `multi-region`

> 适配多国家的神器插件，能够使你在项目中使用形如`.[xxx].vue`、`.[xxx].jsx`、`.[xxx].tsx`、`.[xxx].js`这样的文件后缀，实现编译时区分不同国家，而非运行时

## 这个插件能干什么

以 vue 为例，你可以书写如下结构：

```
./src/views/Home
├── index.us.vue
└── index.vue
```

其中，`.us`表示美国专属的主页面 Home，它跟默认页面不同，存在差异化。

当客户端变量为`us`时，其在编译时将优先打包`index.us.vue`文件，如未找到`[xxx].us.vue`文件，将继续寻找默认的`[xxx].vue`文件。

## 工作原理

核心机制是利用 webpack 中，resolve --> extensions 的有序性，有序性的含义是，当同一个文件夹下存在多个文件时，高优先级的文件会被优先加载，一旦寻找到了高优先级的文件，就不会继续寻找。

这个插件做的事情是这样的，举例来说，webpack - resolve - extensions的改造如下（以region为us为例）：

```diff
- [.jsx, .js, .vue, .tsx]
+ [.us.jsx, .jsx, .us.js, .js, .us.vue, .vue, .us.tsx, .tsx]
```

## 使用

### region名称注入

在插件中会根据传入的region名字，去process.env中寻找，比如：传入`{ regionVariable: "APP_REGION" }`，那么这意味着两点：

- 在开发环境中，你需要通过一些手段定义`process.env.APP_REGION`，你可以通过`cross-env`或者其他插件做到；（下面会给出vue和react脚手架中的配置）
- 在生产环境中，你同样需要通过一些手段定义`process.env.APP_REGION`，并且将`region`的值注入进来（比如通过Dockerfile等，因团队而异）。

### 基于@vue/cli 创建的项目进行配置

在根目录的 vue.config.js 中，进行如下配置

```js
const MultiRegionPlugin = require("multi-region");

module.exports = {
  configureWebpack: {
    // 在传入的参数中，定义regionVariable，注意需要与process.env里面的对应键名保持一致
    plugins: [new MultiRegionPlugin({ regionVariable: "APP_REGION" })],
  },
};
```

在`package.json`文件中，增加如下命令：

```diff
"scripts": {
    "serve": "vue-cli-service serve",
+   "serve:us": "APP_REGION=us vue-cli-service serve",
},
```

在文件引用的时候，**只需要引用到目录层级即可，无需引用到具体某个文件**。

如在 router 配置中：

```diff
- import Home from "../views/Home.vue"
+ import Home from "../views/Home";
```

终端运行`npm run serve:us`，即可支持`.us.vue`、`.us.js`、`.us.ts`等一系列文件类型

### 基于 create-react-app 创建的项目进行配置

cra 定制 webpack 配置的方式有很多种，我们以 craco 为例 在根目录的 craco.config.js 中，进行如下配置

```js
const MultiRegionPlugin = require("multi-region");

module.exports = {
  webpack: {
    plugins: {
      add: [new MultiRegionPlugin({ regionVariable: "APP_REGION" })],
    },
  },
};
```

在`package.json`文件中，增加如下命令：

```diff
"scripts": {
-    "start": "react-scripts start",
+    "start": "craco start",
+    "start:us": "APP_REGION=us craco start",
},
```

终端运行`yarn start:us`，即可支持`.us.tsx`、`.us.js`、`.us.ts`等一系列文件类型。
