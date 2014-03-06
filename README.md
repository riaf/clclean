clclean [![Gitter chat](https://badges.gitter.im/riaf/clclean.png)](https://gitter.im/riaf/clclean)
=======

* 以下の条件に当てはまる cloudinary の画像を消す
    * type={{ config.type }}
    * created_at が {{ config.moment }} 秒より古いもの


Configure
---------

see `config.json.dist`


How to use
----------

**Dry dun***

```sh
node index.js
```


**Delete**

```sh
NODE_ENV=production node index.js
```


TODO
----

### next_cursor from opt (continue mode)

**Example**

```
node index.js --next_cursor={{ next_cursor }}
```
