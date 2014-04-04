clclean [![Code Climate](https://codeclimate.com/github/riaf/clclean.png)](https://codeclimate.com/github/riaf/clclean) [![Gitter chat](https://badges.gitter.im/riaf/clclean.png)](https://gitter.im/riaf/clclean)
=======

clclean deletes the old images from cloudinary.


Installation
------------

```sh
npm -g install clclean
```


How to use
----------

```sh
clclean --cloudname=YOUR_CLOUD_NAME --apikey=YOUR_API_KEY --secret=YOUR_API_SECRET
```


**Dry dun**

```sh
clclean --cloudname=YOUR_CLOUD_NAME --apikey=YOUR_API_KEY --secret=YOUR_API_SECRET --dry-run
```


**next_cursor from opt (continue mode)**

```
clclean --cloudname=YOUR_CLOUD_NAME --apikey=YOUR_API_KEY --secret=YOUR_API_SECRET --moment=7776000 --cursor=NEXT_CURSOR
```


Options
-------

**default**

```json
{
    "cursor": null,
    "cloudname": null,
    "apikey": null,
    "secret": null,
    "dry-run": false,
    "type": "fetch",
    "moment": 86400,
    "verbose": false,
    "economize": 50
}
```

