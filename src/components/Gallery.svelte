<script>
  // Importing our components
  import Loader from "./Loader.svelte";
  import GalleryNavButton from "./GalleryNavButton.svelte";
  import GalleryControls from "./GalleryControls.svelte";

  // Definition of the component's properties
  export let images, height, maxWidth;

  // Here we prepare the index for the first image.
  let currentImageIndex = 0; // the displaying itself is controlled by 'imageCount'

  // Calculating the image count via a reactive statement
  $: imageCount =
    !images || !Array.isArray(images) || !images.length > 0
      ? -1
      : images.length;

  // Calculating styles depending on gallery height and current image index
  $: galleryStyles = () => {
    const galleryHeight = height || "400px";
    const galleryMaxWidth = maxWidth ? ` max-width: ${maxWidth};` : "";
    const imgUrl =
      imageCount > -1
        ? ` background-image: url(${images[currentImageIndex]});`
        : "";

    return `height: ${galleryHeight};${galleryMaxWidth} ${imgUrl}`;
  };

  /**
   * Event handler for button 'next'
   *
   * @param {number} direction - can be -1 for back or 1 for next image
   */
  const setNextImage = direction => {
    currentImageIndex += direction;
  };

  /**
   * Event handler for navigation control index buttons
   * Sets the current image index to the given image index
   *
   * @param {number} imageIndex - the image index we will navigate to
   */
  const navigateToIndex = imageIndex => {
    currentImageIndex = imageIndex.detail;
  };
</script>

<style>
  .gallery {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    margin-left: auto;
    margin-right: auto;

    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border-radius: 0.25rem;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>

<div on:clack={setNextImage} class="gallery component" style={galleryStyles()}>

  {#if imageCount < 0}
    <Loader class="loader" />
  {/if}

  <GalleryNavButton
    position="left"
    visible={imageCount > -1 && currentImageIndex > 0}
    on:navigate={() => setNextImage(-1)} />
  <GalleryNavButton
    position="right"
    visible={imageCount > -1 && currentImageIndex < images.length - 1}
    on:navigate={() => setNextImage(1)} />

  <GalleryControls
    numberOfImages={imageCount}
    currentIndex={currentImageIndex}
    on:navigateToIndex={navIndex => navigateToIndex(navIndex)} />
</div>
