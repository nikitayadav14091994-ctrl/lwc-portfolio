import { LightningElement } from 'lwc';

export default class BasicGetterSetter extends LightningElement {

    // ── Private backing properties ───────────────────────────────
    // Convention: prefix with _ to show they are private
    // Never accessed directly from HTML — always through getter/setter
    _soqlCount = 0;
    _dmlCount  = 0;
    //_cpuTime   = 0;

    get soqlBarStyle() {
        return 'width:' + this.soqlPercent + '%';
    }

    get dmlBarStyle() {
        return 'width:' + this.dmlPercent + '%';
    }

    // get cpuBarStyle() {
    //     return 'width:' + this.cpuPercent + '%';
    // }

    // ── SETTER: soqlCount ────────────────────────────────────────
    // Runs when we do: this.soqlCount = someValue
    // Salesforce allows max 100 SOQL queries per transaction
    set soqlCount(value) {
        const num = parseInt(value) || 0;
        // Clamp: never below 0, never above 100
        this._soqlCount = Math.min(Math.max(num, 0), 100);
    }

    // GETTER: soqlCount
    // Runs when HTML reads {soqlCount} or JS reads this.soqlCount
    get soqlCount() {
        return this._soqlCount;
    }

    // ── SETTER: dmlCount ─────────────────────────────────────────
    // Salesforce allows max 150 DML operations per transaction
    set dmlCount(value) {
        const num = parseInt(value) || 0;
        this._dmlCount = Math.min(Math.max(num, 0), 150);
    }

    get dmlCount() {
        return this._dmlCount;
    }

    // ── SETTER: cpuTime ──────────────────────────────────────────
    // Salesforce allows max 10000ms CPU time per transaction
    // set cpuTime(value) {
    //     const num = parseInt(value) || 0;
    //     this._cpuTime = Math.min(Math.max(num, 0), 10000);
    // }

    // get cpuTime() {
    //     return this._cpuTime;
    // }

    // ── COMPUTED GETTERS: Usage percentages ──────────────────────
    // These derive their value from the private properties above
    // No need to store them — recomputed every time they are read

    get soqlPercent() {
        return Math.round((this._soqlCount / 100) * 100);
    }

    get dmlPercent() {
        return Math.round((this._dmlCount / 150) * 100);
    }

    // get cpuPercent() {
    //     return Math.round((this._cpuTime / 10000) * 100);
    // }

    // ── COMPUTED GETTERS: Status labels ──────────────────────────
    // Returns different label based on usage percentage

    get soqlStatus() {
        if (this.soqlPercent >= 90) return '🔴 Critical';
        if (this.soqlPercent >= 70) return '🟡 Warning';
        return '🟢 Safe';
    }

    get dmlStatus() {
        if (this.dmlPercent >= 90) return '🔴 Critical';
        if (this.dmlPercent >= 70) return '🟡 Warning';
        return '🟢 Safe';
    }

    // get cpuStatus() {
    //     if (this.cpuPercent >= 90) return '🔴 Critical';
    //     if (this.cpuPercent >= 70) return '🟡 Warning';
    //     return '🟢 Safe';
    // }

    // ── COMPUTED GETTERS: Progress bar CSS classes ────────────────
    get soqlBarClass() {
        return 'progress-fill ' + this.getBarColour(this.soqlPercent);
    }

    get dmlBarClass() {
        return 'progress-fill ' + this.getBarColour(this.dmlPercent);
    }

    // get cpuBarClass() {
    //     return 'progress-fill ' + this.getBarColour(this.cpuPercent);
    // }

    // Helper method — not a getter, just a reusable function
    getBarColour(percent) {
        if (percent >= 90) return 'bar-danger';
        if (percent >= 70) return 'bar-warning';
        return 'bar-safe';
    }

    // ── COMPUTED GETTER: Overall health score ─────────────────────
    // Computes one number from 3 separate values
    // This is the most powerful getter use case — combining values
    get overallScore() {
        const soqlHealth = 100 - this.soqlPercent;
        const dmlHealth  = 100 - this.dmlPercent;
        const cpuHealth  = 100 - this.cpuPercent;
        return Math.round((soqlHealth + dmlHealth + cpuHealth) / 3);
    }

    // ── COMPUTED GETTER: Grade based on score ─────────────────────
    get overallGrade() {
        const s = this.overallScore;
        if (s >= 90) return 'A';
        if (s >= 80) return 'B';
        if (s >= 60) return 'C';
        if (s >= 40) return 'D';
        return 'F';
    }

    get gradeClass() {
        const s = this.overallScore;
        if (s >= 90) return 'grade-box grade-a';
        if (s >= 80) return 'grade-box grade-b';
        if (s >= 60) return 'grade-box grade-c';
        if (s >= 40) return 'grade-box grade-d';
        return 'grade-box grade-f';
    }

    get scoreMessage() {
        const s = this.overallScore;
        if (s >= 90) return 'Excellent! Your code is well within safe limits.';
        if (s >= 80) return 'Good. Minor optimisations recommended.';
        if (s >= 60) return 'Fair. Review your queries and DML operations.';
        if (s >= 40) return 'Poor. Refactor urgently before deploying to production.';
        return 'Critical! This code will hit governor limits and throw exceptions.';
    }

    // ── COMPUTED GETTER: Suggestions array ───────────────────────
    // Used with for:each in HTML to render a list of tips
    get suggestions() {
        const tips = [];

        if (this.soqlPercent >= 70)
            tips.push('Move SOQL queries outside for loops — use collections instead');
        if (this.soqlPercent >= 90)
            tips.push('Consider using @wire to cache data and reduce SOQL calls');
        if (this.dmlPercent >= 70)
            tips.push('Bulkify DML — collect records in a list then do one DML at end');
        if (this.dmlPercent >= 90)
            tips.push('Use Database.insert with allOrNone=false for safer bulk operations');
        if (this.cpuPercent >= 70)
            tips.push('Avoid complex logic inside loops — pre-compute values before looping');
        if (this.cpuPercent >= 90)
            tips.push('Use Maps instead of nested loops for lookup operations');

        if (tips.length === 0)
            tips.push('All limits are in the safe zone. Great code hygiene!');

        return tips;
    }

    // ── EVENT HANDLERS ────────────────────────────────────────────
    // Sliders fire onchange — we read value and pass to setter
    // Setter validates, then all getters recompute automatically

    handleSoqlChange(event) {
        this.soqlCount = event.target.value; // triggers setter
    }

    handleDmlChange(event) {
        this.dmlCount = event.target.value;
    }

    // handleCpuChange(event) {
    //     this.cpuTime = event.target.value;
    // }

    handleReset() {
        this.soqlCount = 0;
        this.dmlCount  = 0;
        //this.cpuTime   = 0;
    }
}