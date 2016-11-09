# CHANGELOG

## v.2.0.0 - November 2016

### Change 1.

Breaking changes — instead of giving the first class or id as string, now we're outputting the array of them:

Previously:
```js
extract('div.class-one.class-two a[target=_blank]', '#')
// => '.class-one'
extract('div#id.class a[target=_blank]', '#')
// => '#id'
```

Now:

```js
extract('div#id.class a[target=_blank]', '#')
// => ['#id', '.class']
```

Once the space is encountered, there won't be any more additions to the array.

### Change 2.

There is no second argument any more, to choose between id's or classes. Since array can contain a mix of classes and id's, it's unpractical to impose any other restrictions upon user any more.

This library will detect the first clump of class(es)/array(s), will put each into an array, discarding everything else around.
