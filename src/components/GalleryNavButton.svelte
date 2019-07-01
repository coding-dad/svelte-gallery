<script>
  // Loading event dispatcher - allows us to send events to parent components
  import { createEventDispatcher } from "svelte";

  // Definition of the component's properties
  export let position, visible;

  // Instantiating our dispatcher
  const dispatch = createEventDispatcher();

  // Computing some styles via reactive statements
  $: arrowClass = "arrow" + (position === "left" ? " arrow-left" : "");
  $: containerClass = () => {
    const btnDirection =
      position === "left" ? "btnContainer-left" : "btnContainer-right";
    return `btnContainer ${btnDirection}`;
  };

  /**
   * Event method when a gallery navigation button is pressed
   * Sends an event upwards to our parent component
   */
  const onClick = () => {
    dispatch("navigate", {});
  };
</script>

<style>
  .btnContainer {
    position: absolute;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 0.25rem;
    padding: 1.2rem;
    cursor: pointer;
    user-select: none;
  }

  .btnContainer-left {
    left: 0;
  }

  .btnContainer-right {
    right: 0;
  }

  .btnContainer:hover {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 1.2rem;
  }

  .arrow {
    transform: scale(0.5);
    stroke: none;
    fill: white;
  }

  .arrow-left {
    transform: rotate(180deg) scale(0.5);
  }
</style>

{#if visible}
  <div on:click={onClick} class={containerClass()}>
    <svg class={arrowClass} width="64" height="64" viewBox="0 0 64 64">
      <path d="M 10 0 L 30 0 L 60 30 L 30 60 L 10 60 L 40 30 L 10 0" />
    </svg>
  </div>
{/if}
