# Svelte Gallery Component Example

First alpha of a svelte-based image gallery component.

There is still a lot to do, but currently the following features are implemented:

-   navigation between images
-   navigation controller to jump to a specific index position
-   autorun with timer

Click [here](https://coding-dad.github.io/svelte-gallery/) for an example

## Usage

```
<Gallery
      images={imageUrlArray}
      height={galleryHeight}
      maxWidth={maxWith}
      autoRun={enableAutorun}
      timer={autorunTimer} />
```
