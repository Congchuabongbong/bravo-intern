(window as any).global = window;
(window as any).process = {
    env: { DEBUG: undefined },
};

/*
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js';  // Included with Angular CLI.