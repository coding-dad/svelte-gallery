
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.shift()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            while (render_callbacks.length) {
                const callback = render_callbacks.pop();
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_render);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_render.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            remaining: 0,
            callbacks: []
        };
    }
    function check_outros() {
        if (!outros.remaining) {
            run_all(outros.callbacks);
        }
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.callbacks.push(() => {
                outroing.delete(block);
                if (callback) {
                    block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_render } = component.$$;
        fragment.m(target, anchor);
        // onMount happens after the initial afterUpdate. Because
        // afterUpdate callbacks happen in reverse order (inner first)
        // we schedule onMount callbacks before afterUpdate callbacks
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_render.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal: not_equal$$1,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_render: [],
            after_render: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_render);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src\components\Loader.svelte generated by Svelte v3.6.1 */

    const file = "src\\components\\Loader.svelte";

    function create_fragment(ctx) {
    	var div9, div0, t0, div1, t1, div2, t2, div3, t3, div4, t4, div5, t5, div6, t6, div7, t7, div8;

    	return {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div8 = element("div");
    			attr(div0, "class", "svelte-a12xw4");
    			add_location(div0, file, 76, 2, 1439);
    			attr(div1, "class", "svelte-a12xw4");
    			add_location(div1, file, 77, 2, 1450);
    			attr(div2, "class", "svelte-a12xw4");
    			add_location(div2, file, 78, 2, 1461);
    			attr(div3, "class", "svelte-a12xw4");
    			add_location(div3, file, 79, 2, 1472);
    			attr(div4, "class", "svelte-a12xw4");
    			add_location(div4, file, 80, 2, 1483);
    			attr(div5, "class", "svelte-a12xw4");
    			add_location(div5, file, 81, 2, 1494);
    			attr(div6, "class", "svelte-a12xw4");
    			add_location(div6, file, 82, 2, 1505);
    			attr(div7, "class", "svelte-a12xw4");
    			add_location(div7, file, 83, 2, 1516);
    			attr(div8, "class", "svelte-a12xw4");
    			add_location(div8, file, 84, 2, 1527);
    			attr(div9, "class", "lds-grid svelte-a12xw4");
    			add_location(div9, file, 75, 0, 1413);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div9, anchor);
    			append(div9, div0);
    			append(div9, t0);
    			append(div9, div1);
    			append(div9, t1);
    			append(div9, div2);
    			append(div9, t2);
    			append(div9, div3);
    			append(div9, t3);
    			append(div9, div4);
    			append(div9, t4);
    			append(div9, div5);
    			append(div9, t5);
    			append(div9, div6);
    			append(div9, t6);
    			append(div9, div7);
    			append(div9, t7);
    			append(div9, div8);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div9);
    			}
    		}
    	};
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment, safe_not_equal, []);
    	}
    }

    /* src\components\GalleryNavButton.svelte generated by Svelte v3.6.1 */

    const file$1 = "src\\components\\GalleryNavButton.svelte";

    // (66:0) {#if visible}
    function create_if_block(ctx) {
    	var div, svg, path, div_class_value, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr(path, "d", "M 10 0 L 30 0 L 60 30 L 30 60 L 10 60 L 40 30 L 10 0");
    			add_location(path, file$1, 68, 6, 1550);
    			attr(svg, "class", "" + ctx.arrowClass + " svelte-1h8zcff");
    			attr(svg, "width", "64");
    			attr(svg, "height", "64");
    			attr(svg, "viewBox", "0 0 64 64");
    			add_location(svg, file$1, 67, 4, 1475);
    			attr(div, "class", div_class_value = "" + ctx.containerClass() + " svelte-1h8zcff");
    			add_location(div, file$1, 66, 2, 1420);
    			dispose = listen(div, "click", ctx.onClick);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, svg);
    			append(svg, path);
    		},

    		p: function update(changed, ctx) {
    			if (changed.arrowClass) {
    				attr(svg, "class", "" + ctx.arrowClass + " svelte-1h8zcff");
    			}

    			if ((changed.containerClass) && div_class_value !== (div_class_value = "" + ctx.containerClass() + " svelte-1h8zcff")) {
    				attr(div, "class", div_class_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	var if_block_anchor;

    	var if_block = (ctx.visible) && create_if_block(ctx);

    	return {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.visible) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	// Definition of the component's properties
      let { position, visible } = $$props;

      // Instantiating our dispatcher
      const dispatch = createEventDispatcher();

      /**
       * Event method when a gallery navigation button is pressed
       * Sends an event upwards to our parent component
       */
      const onClick = () => {
        dispatch("navigate", {});
      };

    	const writable_props = ['position', 'visible'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<GalleryNavButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('position' in $$props) $$invalidate('position', position = $$props.position);
    		if ('visible' in $$props) $$invalidate('visible', visible = $$props.visible);
    	};

    	let arrowClass, containerClass;

    	$$self.$$.update = ($$dirty = { position: 1 }) => {
    		if ($$dirty.position) { $$invalidate('arrowClass', arrowClass = "arrow" + (position === "left" ? " arrow-left" : "")); }
    		if ($$dirty.position) { $$invalidate('containerClass', containerClass = () => {
            const btnDirection =
              position === "left" ? "btnContainer-left" : "btnContainer-right";
            return `btnContainer ${btnDirection}`;
          }); }
    	};

    	return {
    		position,
    		visible,
    		onClick,
    		arrowClass,
    		containerClass
    	};
    }

    class GalleryNavButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment$1, safe_not_equal, ["position", "visible"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.position === undefined && !('position' in props)) {
    			console.warn("<GalleryNavButton> was created without expected prop 'position'");
    		}
    		if (ctx.visible === undefined && !('visible' in props)) {
    			console.warn("<GalleryNavButton> was created without expected prop 'visible'");
    		}
    	}

    	get position() {
    		throw new Error("<GalleryNavButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<GalleryNavButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visible() {
    		throw new Error("<GalleryNavButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<GalleryNavButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\GalleryControls.svelte generated by Svelte v3.6.1 */

    const file$2 = "src\\components\\GalleryControls.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.dummy = list[i];
    	child_ctx.idx = i;
    	return child_ctx;
    }

    // (63:4) {#each iter as dummy, idx}
    function create_each_block(ctx) {
    	var li, svg, circle, svg_class_value, t, dispose;

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	return {
    		c: function create() {
    			li = element("li");
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			t = space();
    			attr(circle, "cx", "60");
    			attr(circle, "cy", "60");
    			attr(circle, "r", "50");
    			add_location(circle, file$2, 70, 10, 1605);
    			attr(svg, "class", svg_class_value = "circle " + (ctx.idx === ctx.currentIndex ? ' circle-selected' : '') + " svelte-9gdxjo");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "viewBox", "0 0 120 120");
    			attr(svg, "version", "1.1");
    			add_location(svg, file$2, 64, 8, 1368);
    			attr(li, "class", "svelte-9gdxjo");
    			add_location(li, file$2, 63, 6, 1354);
    			dispose = listen(svg, "click", click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, svg);
    			append(svg, circle);
    			append(li, t);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.currentIndex) && svg_class_value !== (svg_class_value = "circle " + (ctx.idx === ctx.currentIndex ? ' circle-selected' : '') + " svelte-9gdxjo")) {
    				attr(svg, "class", svg_class_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}

    			dispose();
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	var div, ul;

    	var each_value = ctx.iter;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr(ul, "class", "svelte-9gdxjo");
    			add_location(ul, file$2, 61, 2, 1310);
    			attr(div, "class", "controls svelte-9gdxjo");
    			add_location(div, file$2, 60, 0, 1284);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, ul);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.currentIndex || changed.iter) {
    				each_value = ctx.iter;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	// Definition of the component's properties
      let { numberOfImages, currentIndex } = $$props;

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

    	const writable_props = ['numberOfImages', 'currentIndex'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<GalleryControls> was created with unknown prop '${key}'`);
    	});

    	function click_handler({ idx }) {
    		return onClick(idx);
    	}

    	$$self.$set = $$props => {
    		if ('numberOfImages' in $$props) $$invalidate('numberOfImages', numberOfImages = $$props.numberOfImages);
    		if ('currentIndex' in $$props) $$invalidate('currentIndex', currentIndex = $$props.currentIndex);
    	};

    	return {
    		numberOfImages,
    		currentIndex,
    		iter,
    		onClick,
    		click_handler
    	};
    }

    class GalleryControls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, ["numberOfImages", "currentIndex"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.numberOfImages === undefined && !('numberOfImages' in props)) {
    			console.warn("<GalleryControls> was created without expected prop 'numberOfImages'");
    		}
    		if (ctx.currentIndex === undefined && !('currentIndex' in props)) {
    			console.warn("<GalleryControls> was created without expected prop 'currentIndex'");
    		}
    	}

    	get numberOfImages() {
    		throw new Error("<GalleryControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberOfImages(value) {
    		throw new Error("<GalleryControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentIndex() {
    		throw new Error("<GalleryControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentIndex(value) {
    		throw new Error("<GalleryControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Gallery.svelte generated by Svelte v3.6.1 */

    const file$3 = "src\\components\\Gallery.svelte";

    // (68:2) {#if imageCount < 0}
    function create_if_block$1(ctx) {
    	var current;

    	var loader = new Loader({
    		props: { class: "loader" },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			loader.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	var div, t0, t1, t2, div_style_value, current, dispose;

    	var if_block = (ctx.imageCount < 0) && create_if_block$1();

    	var gallerynavbutton0 = new GalleryNavButton({
    		props: { position: "left", visible: ctx.imageCount > -1 && ctx.currentImageIndex > 0 },
    		$$inline: true
    	});
    	gallerynavbutton0.$on("navigate", ctx.navigate_handler);

    	var gallerynavbutton1 = new GalleryNavButton({
    		props: {
    		position: "right",
    		visible: ctx.imageCount > -1 && ctx.currentImageIndex < ctx.images.length - 1
    	},
    		$$inline: true
    	});
    	gallerynavbutton1.$on("navigate", ctx.navigate_handler_1);

    	var gallerycontrols = new GalleryControls({
    		props: {
    		numberOfImages: ctx.imageCount,
    		currentIndex: ctx.currentImageIndex
    	},
    		$$inline: true
    	});
    	gallerycontrols.$on("navigateToIndex", ctx.navigateToIndex_handler);

    	return {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			gallerynavbutton0.$$.fragment.c();
    			t1 = space();
    			gallerynavbutton1.$$.fragment.c();
    			t2 = space();
    			gallerycontrols.$$.fragment.c();
    			attr(div, "class", "gallery component svelte-1837b3h");
    			attr(div, "style", div_style_value = ctx.galleryStyles());
    			add_location(div, file$3, 65, 0, 1795);
    			dispose = listen(div, "clack", ctx.setNextImage);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append(div, t0);
    			mount_component(gallerynavbutton0, div, null);
    			append(div, t1);
    			mount_component(gallerynavbutton1, div, null);
    			append(div, t2);
    			mount_component(gallerycontrols, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.imageCount < 0) {
    				if (!if_block) {
    					if_block = create_if_block$1();
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t0);
    				} else {
    									transition_in(if_block, 1);
    				}
    			} else if (if_block) {
    				group_outros();
    				transition_out(if_block, 1, () => {
    					if_block = null;
    				});
    				check_outros();
    			}

    			var gallerynavbutton0_changes = {};
    			if (changed.imageCount || changed.currentImageIndex) gallerynavbutton0_changes.visible = ctx.imageCount > -1 && ctx.currentImageIndex > 0;
    			gallerynavbutton0.$set(gallerynavbutton0_changes);

    			var gallerynavbutton1_changes = {};
    			if (changed.imageCount || changed.currentImageIndex || changed.images) gallerynavbutton1_changes.visible = ctx.imageCount > -1 && ctx.currentImageIndex < ctx.images.length - 1;
    			gallerynavbutton1.$set(gallerynavbutton1_changes);

    			var gallerycontrols_changes = {};
    			if (changed.imageCount) gallerycontrols_changes.numberOfImages = ctx.imageCount;
    			if (changed.currentImageIndex) gallerycontrols_changes.currentIndex = ctx.currentImageIndex;
    			gallerycontrols.$set(gallerycontrols_changes);

    			if ((!current || changed.galleryStyles) && div_style_value !== (div_style_value = ctx.galleryStyles())) {
    				attr(div, "style", div_style_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			transition_in(gallerynavbutton0.$$.fragment, local);

    			transition_in(gallerynavbutton1.$$.fragment, local);

    			transition_in(gallerycontrols.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(gallerynavbutton0.$$.fragment, local);
    			transition_out(gallerynavbutton1.$$.fragment, local);
    			transition_out(gallerycontrols.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			if (if_block) if_block.d();

    			destroy_component(gallerynavbutton0, );

    			destroy_component(gallerynavbutton1, );

    			destroy_component(gallerycontrols, );

    			dispose();
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	

      // Definition of the component's properties
      let { images, height } = $$props;

      // Here we prepare the index for the first image.
      let currentImageIndex = 0;

      /**
       * Event handler for button 'next'
       *
       * @param {number} direction - can be -1 for back or 1 for next image
       */
      const setNextImage = direction => {
        $$invalidate('currentImageIndex', currentImageIndex += direction);
      };

      /**
       * Event handler for navigation control index buttons
       * Sets the current image index to the given image index
       *
       * @param {number} imageIndex - the image index we will navigate to
       */
      const navigateToIndex = imageIndex => {
        $$invalidate('currentImageIndex', currentImageIndex = imageIndex.detail);
      };

    	const writable_props = ['images', 'height'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	function navigate_handler() {
    		return setNextImage(-1);
    	}

    	function navigate_handler_1() {
    		return setNextImage(1);
    	}

    	function navigateToIndex_handler(navIndex) {
    		return navigateToIndex(navIndex);
    	}

    	$$self.$set = $$props => {
    		if ('images' in $$props) $$invalidate('images', images = $$props.images);
    		if ('height' in $$props) $$invalidate('height', height = $$props.height);
    	};

    	let imageCount, galleryStyles;

    	$$self.$$.update = ($$dirty = { images: 1, height: 1, imageCount: 1, currentImageIndex: 1 }) => {
    		if ($$dirty.images) { $$invalidate('imageCount', imageCount =
            !images || !Array.isArray(images) || !images.length > 0
              ? -1
              : images.length); }
    		if ($$dirty.height || $$dirty.imageCount || $$dirty.images || $$dirty.currentImageIndex) { $$invalidate('galleryStyles', galleryStyles = () => {
            const galleryHeight = height || "400px";
            const imgUrl =
              imageCount > -1
                ? ` background-image: url(${images[currentImageIndex]});`
                : "";
        
            return `height: ${galleryHeight};${imgUrl}`;
          }); }
    	};

    	return {
    		images,
    		height,
    		currentImageIndex,
    		setNextImage,
    		navigateToIndex,
    		imageCount,
    		galleryStyles,
    		navigate_handler,
    		navigate_handler_1,
    		navigateToIndex_handler
    	};
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$3, safe_not_equal, ["images", "height"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.images === undefined && !('images' in props)) {
    			console.warn("<Gallery> was created without expected prop 'images'");
    		}
    		if (ctx.height === undefined && !('height' in props)) {
    			console.warn("<Gallery> was created without expected prop 'height'");
    		}
    	}

    	get images() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set images(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // A list of static images, thanks to unsplash
    /*
    	The list of images used in the gallery as demo images

    	Thanks to unsplash (https://unsplash.com) and the photographers ...
    		Sepp Rutz on Unsplash
    		Keith Luke on Unsplash
    		Pang Yuhao on Unsplash
    		Håkon Sataøen on Unsplash
    		Erik Mclean on Unsplash
    		Lance Asper on Unsplash
    		John Fowler on Unsplash
    		ZQ Lee on Unsplash
    		Pascal Habermann on Unsplash
    		Krisjanis Mezulis on Unsplash
    		Josh Sorenson on Unsplash
    	

    */
    const images = [
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fzq-lee-VbDjv8-8ibc-unsplash.jpg?v=1561796309182",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fkrisjanis-mezulis-Ndz3w6MCeWc-unsplash.jpg?v=1561796310554",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fsepp-rutz-tskqMngoHSA-unsplash.jpg?v=1561796311981",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Ferik-mclean-WhRsHmFtFXQ-unsplash.jpg?v=1561796313563",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fjosh-sorenson-Z33d85enIBI-unsplash.jpg?v=1561796314943",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fpang-yuhao-wCi28eq8TF4-unsplash.jpg?v=1561796316818",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fhakon-sataoen-XFiY4FZj8ZE-unsplash.jpg?v=1561796317836",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fjohn-fowler-aaIN3y2zcMQ-unsplash.jpg?v=1561796318194",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fsepp-rutz-hZQOby6ZdIE-unsplash.jpg?v=1561796318251",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fpascal-habermann-A6hoSqrce5U-unsplash.jpg?v=1561796318397",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Flance-asper-5Kp5LVjINgI-unsplash.jpg?v=1561796323607",
    	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fkeith-luke-TAm2z1TOges-unsplash.jpg?v=1561796324012"
    ];

    /* src\App.svelte generated by Svelte v3.6.1 */

    const file$4 = "src\\App.svelte";

    function create_fragment$4(ctx) {
    	var div1, h1, t_1, div0, current;

    	var gallery = new Gallery({
    		props: {
    		images: images,
    		height: galleryHeight
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Gallery example";
    			t_1 = space();
    			div0 = element("div");
    			gallery.$$.fragment.c();
    			add_location(h1, file$4, 45, 2, 1014);
    			attr(div0, "class", "gallery svelte-10u45ug");
    			add_location(div0, file$4, 47, 2, 1044);
    			attr(div1, "class", "container svelte-10u45ug");
    			add_location(div1, file$4, 44, 0, 987);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, h1);
    			append(div1, t_1);
    			append(div1, div0);
    			mount_component(gallery, div0, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var gallery_changes = {};
    			if (changed.images) gallery_changes.images = images;
    			if (changed.galleryHeight) gallery_changes.height = galleryHeight;
    			gallery.$set(gallery_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(gallery.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(gallery.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div1);
    			}

    			destroy_component(gallery, );
    		}
    	};
    }

    let galleryHeight = "600px";

    function instance$3($$self) {
    	

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

    	return {};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, []);
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'Welt'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
