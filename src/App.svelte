<script>
  // Importing livecycle  methods
  import { onMount } from "svelte";

  // Importing our components
  import Gallery from "./components/Gallery.svelte";

  // Import the helper classes and fake data
  import { images } from "./Helpers.js";

  // Local vars
  let galleryHeight = "460px";
  let maxWith = "940px";

  let enableAutorun = false;
  let timer = 2000;

  /**
   * Init the first combination on page load
   */
  onMount(() => {
    // Here we preload the images into the browser cache to display them faster in the gallery later on
    for (let imgUrl of images) {
      let image = new Image();
      image.onload = function() {
        // console.log(
        //   `:: image '${imgUrl}' downloaded wih size ${this.naturalWidth} x ${
        //     this.naturalHeight
        //   }`
        // );
      };
      image.src = imgUrl;
    }
  });
</script>

<style>
  .container {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }

  .gallery {
    margin-top: 2rem;
  }
</style>

<div class="container">
  <h1>Svelte Gallery example</h1>
  <div>
    <label>
      <input class="autorun" type="checkbox" bind:checked={enableAutorun} />
      Enable Autorun
    </label>
  </div>

  <div class="gallery">
    <Gallery
      {images}
      height={galleryHeight}
      maxWidth={maxWith}
      autoRun={enableAutorun}
      {timer} />
  </div>
</div>
