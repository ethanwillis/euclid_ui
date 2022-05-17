class Euclid {
    constructor({width, height, dom_target_id, ctx_settings, dev_mode = false}) {
      this.euclid_settings = {
        width: width,
        height: height,
        dom_target_id: dom_target_id,
        ctx_settings: ctx_settings,
        dev_mode: dev_mode
      }; // Yes this is "repetitive", I don't care. It makes it clear what's passed in.

      this.ctx = this.initScene(
        this.euclid_settings.width,
        this.euclid_settings.height,
        this.euclid_settings.dom_target_id
      ); // Initialize a 2d context on a given dom element by id.

      Object.keys(ctx_settings).forEach( (setting_name) => {
        this.ctx[setting_name] = ctx_settings[setting_name]
      }); // Apply all settings to canvas context.

      this.components = []; // Empty list of graphical components managed by Euclid.
    }

    /**
      Creates a 2d canvas context on the given dom element by id.
      Applies the given size and width to the dom element.

      @returns a 2d canvas context that Euclid manages components on.
    */
    initScene(width, height, dom_target_id) {
      let scene = document.getElementById(dom_target_id);
      scene.width = width;
      scene.height = height;
      return scene.getContext('2d')
    }

    /**
      Add a new component to the list of components managed by Euclid.
    */
    add(component) {
      const componentIndex = this.components.push( component(this.ctx) ) - 1;
      const instantiatedComponent = this.components[componentIndex];
    }

    /**
      Render all of the components that Euclid is managing.
    */
    render() {
      this.components.forEach((component, component_index) => {
        if(this.euclid_settings.dev_mode) {
          this.componentSanityCheck(component)
        }
        component.drawFunc(component.params)
      });
    }

    /**
      Do some friendly checks to make sure the components we're drawing respect the canvas.
      Display warnings and maybe some general feedback/solution if possible.
    */
    componentSanityCheck(component) {
      // Check sizing constraints.
      if(component.params.width > this.euclid_settings.width) {
        console.warn(
          `Component width ${component.params.width} is larger than`,
          `scene width of ${this.euclid_settings.width}`,
          `Recommendation: Make sure the component implementation respects`,
          `the Euclid app scene size. Or that it renders itself responsively.`
        )
      } else if (component.params.height > this.euclid_settings.height) {
        console.warn(
          `Component height ${component.params.height} is larger than scene`,
          `height of ${this.euclid_settings.height}`,
          `Recommendation: Make sure the component implementation respects`,
          `the Euclid app scene size. Or that it renders itself responsively.`
        )
      }
    }

    getSceneWidth() {
      return this.euclid_settings.width;
    }

    getSceneHeight() {
      return this.euclid_settings.height;
    }

    getSceneSize() {
      return {
        width: this.getSceneWidth(),
        height: this.getSceneHeight()
      }
    }
}

export default Euclid;
