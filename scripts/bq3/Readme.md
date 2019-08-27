# BetterQuesting Language file generator

This script is written to support i18n feature of BetterQuesting. Though it's focus on GTNH, it can be edited to be used on other modpacks easily. And it supports BQ1 and BQ3.

The script works both in browsers and under nodejs environment. Though I recommend Node, maybe it's a unnecessary to install another program on your computer. So I provided those two ways.

## Browser

1. Copy `index.js` and paste its content in browser console.
2. Follow the following **steps** and **don't** execute all the code at a time!

```js
// you can get en_US.lang printed in your console
// you should copy it and create a file to paste it
db_p = init('master').then(db => {
  console.log(db.genLangFile(false))
})

// then you can get the blank lang file
// follow what you've did above
db_p.then(db => {
  console.log(db.genLangFile())
})

// finally you get the modified DefaultQuests.json
// follow what you've did above
db_p.then(db => {
  console.log(db.genI18nDB().stringify())
})
```

and if you want to upgrade your script, you should:

```js
await diff(
  'THE_OLD_VERSION_SUCH_AS_2.0.7.0',
  'THE_LATEST_VERSION_SUCH_AS_master'
)

// work example
await diff('2.0.7.0', 'master')
```

## Node

1. Get the whole bq3 folder.
2. `yarn` or `npm install`, because node doesn't have fetch.
3. `yarn start`, and you can see the instructions.
4. For example, you want to generate files of `master`, and you should execute this:

```bash
yarn start -g master
```

and folder `dist/master/` should be generated with all three files in it.

5. For example, you want to upgrade from `2.0.7.0` to `master`, then you should execute this:

```bash
yarn start -u 2.0.7.0 master
```

and a report markdown file will be generated in `dist` folder.
