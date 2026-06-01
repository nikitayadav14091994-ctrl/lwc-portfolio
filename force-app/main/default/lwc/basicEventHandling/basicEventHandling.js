import { LightningElement } from 'lwc';

export default class BasicEventHandling extends LightningElement {

    // Field values
    fieldLabel       = '';
    fieldApiName     = '';
    fieldDescription = '';

    // Validation error messages
    labelError       = '';
    apiNameError     = '';
    descriptionError = '';

    // UI state
    isSaved     = false;
    savedField  = null;
    activeHint  = '';

    // Event log
    eventLog = [];

    // Character limits
    LABEL_MAX    = 40;
    API_NAME_MAX = 40;
    DESC_MAX     = 255;

    // ─── oninput ─────────────────────────────────────────────────
    // Fires on every single keystroke
    // event.target.value = current value of the input

    handleLabelInput(event) {
        this.fieldLabel = event.target.value;
        this.isSaved    = false;

        // Auto-generate API name from label
        this.fieldApiName = this.fieldLabel
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '')
            .replace(/^(\d)/, '_$1');

        this.validateLabel();
        this.validateApiName();
        this.logEvent('oninput', 'Field Label', '"' + this.fieldLabel + '"');
    }

    handleApiNameInput(event) {
        this.fieldApiName = event.target.value;
        this.isSaved      = false;
        this.validateApiName();
        this.logEvent('oninput', 'API Name', '"' + this.fieldApiName + '"');
    }

    handleDescriptionInput(event) {
        this.fieldDescription = event.target.value;
        this.isSaved          = false;
        this.validateDescription();
        this.logEvent('oninput', 'Description', this.fieldDescription.length + ' chars');
    }

    // ─── onfocus ─────────────────────────────────────────────────
    // Fires when user clicks INTO a field
    // event.target.dataset.hint = hint text set in HTML

    handleFocus(event) {
        this.activeHint = event.target.dataset.hint;
        this.logEvent('onfocus', event.target.dataset.field, 'Field focused');
    }

    // ─── onblur ──────────────────────────────────────────────────
    // Fires when user clicks OUT of a field

    handleBlur(event) {
        this.activeHint = '';
        this.logEvent('onblur', event.target.dataset.field, 'Field blurred');
    }

    // ─── onkeydown ───────────────────────────────────────────────
    // Fires on every key press
    // event.key = name of key pressed ('Enter', 'Escape' etc)

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.logEvent('onkeydown', 'Enter key', 'Triggered save');
            this.handleSave();
        }
        if (event.key === 'Escape') {
            this.logEvent('onkeydown', 'Escape key', 'Triggered clear');
            this.handleClear();
        }
    }

    // ─── onclick ─────────────────────────────────────────────────

    handleSave() {
        this.validateLabel();
        this.validateApiName();
        this.validateDescription();

        if (this.isFormValid) {
            this.isSaved   = true;
            this.savedField = {
                label      : this.fieldLabel,
                apiName    : this.fieldApiName + '__c',
                description: this.fieldDescription || 'No description provided'
            };
            this.logEvent('onclick', 'Save Button', 'Field saved successfully');
        } else {
            this.logEvent('onclick', 'Save Button', 'Validation failed');
        }
    }

   handleClear() {
    // Reset JS properties
    this.fieldLabel       = '';
    this.fieldApiName     = '';
    this.fieldDescription = '';
    this.labelError       = '';
    this.apiNameError     = '';
    this.descriptionError = '';
    this.isSaved          = false;
    this.savedField       = null;
    this.activeHint       = '';
    this.eventLog         = [];

    // Directly clear the base component values on screen
    // this.template gives access to component's DOM
    // querySelectorAll finds ALL matching elements
    this.template.querySelectorAll('lightning-input').forEach(input => {
        input.value = '';
    });

    this.template.querySelectorAll('lightning-textarea').forEach(textarea => {
        textarea.value = '';
    });

    this.logEvent('onclick', 'Clear Button', 'All fields reset');
}

    // ─── VALIDATION ──────────────────────────────────────────────

    validateLabel() {
        if (!this.fieldLabel) {
            this.labelError = 'Label is required';
        } else if (this.fieldLabel.length > this.LABEL_MAX) {
            this.labelError = 'Max ' + this.LABEL_MAX + ' characters allowed';
        } else {
            this.labelError = '';
        }
    }

    validateApiName() {
        const apiNameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        if (!this.fieldApiName) {
            this.apiNameError = 'API Name is required';
        } else if (!apiNameRegex.test(this.fieldApiName)) {
            this.apiNameError = 'Must start with a letter. Only letters, numbers and underscores allowed';
        } else if (this.fieldApiName.length > this.API_NAME_MAX) {
            this.apiNameError = 'Max ' + this.API_NAME_MAX + ' characters allowed';
        } else {
            this.apiNameError = '';
        }
    }

    validateDescription() {
        if (this.fieldDescription.length > this.DESC_MAX) {
            this.descriptionError = 'Max ' + this.DESC_MAX + ' characters. Currently: ' + this.fieldDescription.length;
        } else {
            this.descriptionError = '';
        }
    }

    // ─── HELPERS ─────────────────────────────────────────────────

    logEvent(eventType, target, detail) {
        const entry = {
            id       : Date.now() + Math.random(),
            eventType: eventType,
            target   : target,
            detail   : detail,
            time     : new Date().toLocaleTimeString()
        };
        const updated = [...this.eventLog, entry];
        this.eventLog = updated.slice(-8); // keep last 8 only
    }

    // ─── GETTERS ─────────────────────────────────────────────────

    get labelCount()       { return this.fieldLabel.length + ' / ' + this.LABEL_MAX; }
    get apiNameCount()     { return this.fieldApiName.length + ' / ' + this.API_NAME_MAX; }
    get descriptionCount() { return this.fieldDescription.length + ' / ' + this.DESC_MAX; }
    get hasEventLog()      { return this.eventLog.length > 0; }
    get saveButtonVariant(){ return this.isFormValid ? 'brand' : 'neutral'; }

    get isFormValid() {
        return !this.labelError &&
               !this.apiNameError &&
               !this.descriptionError &&
               this.fieldLabel.length > 0 &&
               this.fieldApiName.length > 0;
    }
}