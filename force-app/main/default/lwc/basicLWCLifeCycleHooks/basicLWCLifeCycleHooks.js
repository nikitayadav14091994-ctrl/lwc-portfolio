import { LightningElement } from 'lwc';

export default class BasicLifecycleHooks extends LightningElement {

    // Track each hook with a simple true/false
    constructorFired    = false;
    connectedFired      = false;
    renderedFired       = false;
    disconnectedFired   = false;

    isRenderedOnce = false; // guard flag

    // Render counter and log
    renderCount = 0;
    hookLog     = [];

    //Timer for disconnection
    timerTick     = 0;
    timerInterval = null;
    isTimerRunning = false;

    // ─── HOOK 1 ───────────────────────────────
    constructor() {
        super(); // always first — mandatory
        this.constructorFired = true;
        this.addLog('constructor()', 'Component object created');
        console.log('Constructor Called..');
    }

    // ─── HOOK 2 ───────────────────────────────
    connectedCallback() {
        this.connectedFired = true;
        this.addLog('connectedCallback()', 'Added to DOM — @api props ready');
        console.log('connectedCallback Called..');

         // Start a timer — proves component is alive and connected
        this.isTimerRunning = true;
        this.timerInterval = setInterval(() => {
            this.timerTick = this.timerTick + 1;
        }, 1000);
    }

    // ─── HOOK 3 ───────────────────────────────
    // renderedCallback() {
    //     this.renderCount = this.renderCount + 1;
    //     console.log('renderCount = '+ this.renderCount);
    //     this.renderedFired = true;
    //     this.addLog('renderedCallback()', 'UI painted — render #' + this.renderCount);
    //     console.log('renderedCallback Called..');
    // }    

    renderedCallback() {
        if (this.isRenderedOnce) return; // exit immediately if already ran
            this.isRenderedOnce = true;      // mark as ran — won't enter again
    
        this.renderedFired = true;
        this.renderCount = this.renderCount + 1;
        this.addLog('renderedCallback()', 'UI painted — render #' + this.renderCount);

        console.log('renderCount = '+ this.renderCount);
        console.log('renderedCallback Called..');
    }

    // ─── HOOK 4 ───────────────────────────────
    // disconnectedCallback() {
    //     this.disconnectedFired = true;
    //     this.addLog('disconnectedCallback()', 'Removed from DOM — cleanup time');
    //     console.log('disconnectedCallback Called..');
    // }

    disconnectedCallback() {
        this.disconnectedFired = true;

        // Clear the interval — this is exactly what disconnectedCallback is for
        clearInterval(this.timerInterval);
        this.isTimerRunning = false;

        this.addLog('disconnectedCallback()', 'Removed from DOM — timer cleared, cleanup done!');
        console.log('disconnectedCallback Called..');
    }

    simulateDisconnect() {
    clearInterval(this.timerInterval);
    this.isTimerRunning  = false;
    this.disconnectedFired = true;
    this.addLog(
        'disconnectedCallback()',
        'Simulated: timer stopped — in real usage this fires when you navigate away',
        'purple'
    );
}

simulateReconnect() {
    this.timerInterval   = setInterval(() => { this.timerTick = this.timerTick + 1; }, 1000);
    this.isTimerRunning  = true;
    this.disconnectedFired = false;
    this.addLog('connectedCallback()', 'Simulated reconnect — timer restarted', 'green');
}

get timerButtonLabel() {
    return this.isTimerRunning ? 'Simulate Disconnect' : 'Simulate Reconnect';
}

get timerButtonVariant() {
    return this.isTimerRunning ? 'destructive-text' : 'success';
}

get timerButtonIcon() {
    return this.isTimerRunning ? 'utility:stop' : 'utility:play';
}

handleTimerToggle() {
    if (this.isTimerRunning) {
        this.simulateDisconnect();
    } else {
        this.simulateReconnect();
    }
}

    // ─── ADD TO LOG ───────────────────────────
    addLog(hookName, message) {
        console.log('addLog Called..');
        const time      = new Date().toLocaleTimeString();
        const newEntry  = { id: Date.now(), hookName, message, time };

        // spread creates a NEW array — LWC needs new array to detect change
        this.hookLog = [...this.hookLog, newEntry];
    }

    // ─── BUTTON HANDLERS ──────────────────────
    triggerRerender() {
        console.log('triggerRerender Called..');
        this.addLog('-- USER ACTION --', 'Re-render button clicked');
        this.renderCount = this.renderCount + 1;
    }

    resetAll() {
        console.log('resetAll Called..');
        this.hookLog          = [];
        this.renderCount      = 0;
        this.constructorFired   = false;
        this.connectedFired     = false;
        this.renderedFired      = false;
        this.disconnectedFired  = false;
    }

    // ─── GETTER ───────────────────────────────
    get hasLogs() {
        return this.hookLog.length > 0;
    }
}