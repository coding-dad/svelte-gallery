<script>
  // Loading event dispatcher - allows us to send events to parent components
  import { createEventDispatcher } from "svelte";

  // Definition of the component's properties
  export let numberOfImages, currentIndex;

  // Instantiating our dispatcher
  const dispatch = createEventDispatcher();

  // Create a dummy array to iterate in the <ul>  TODO: There must be a better way...
  let iter = new Array(numberOfImages);

  /**
   * Event method when a gallery navigation control is pressed
   * Sends an event upwards to our parent component
   */
  const onClick = toIndex => {
    dispatch("navigateToIndex", toIndex);
  };
</script>

<style>
  .controls {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;

    background-color: rgba(0, 0, 0, 0.4);
    color: white;

    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  ul {
    display: flex;
    line-height: 40px;
    list-style: none;
    margin: 0;
    justify-content: center;
  }

  li {
    padding-left: 0.4rem;
    padding-right: 0.4rem;
    line-height: 50px;
  }

  .circle {
    fill: rgba(255, 255, 255, 0.5);
    height: 20px;
  }

  .circle:hover,
  .circle-selected {
    fill: rgba(255, 255, 255, 1);
  }
</style>

<div class="controls">
  <ul>
    {#each iter as dummy, idx}
      <li>
        <svg
          on:click={() => onClick(idx)}
          class="circle {idx === currentIndex ? ' circle-selected' : ''}"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          version="1.1">
          <circle cx="60" cy="60" r="50" />
        </svg>
      </li>
    {/each}
  </ul>
</div>
