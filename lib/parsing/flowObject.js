/**
 * AUTHOR: mrassinger
 * COPYRIGHT: E2E Technologies Ltd.
 */

// Name according to http://de.wikipedia.org/wiki/Business_Process_Model_and_Notation#Notation
exports.BPMNFlowObject = BPMNFlowObject;

/**
 * Subsumes all kind process elements that have incoming and outgoing flows.
 * @param {String} bpmnId
 * @param {String} name
 * @param {String} type
 * @constructor
 */
function BPMNFlowObject(bpmnId, name, type) {
    this.bpmnId = bpmnId;
    this.name = name;
    this.type = type;
    this.isFlowObject = true;
}

/**
 * Semantics: emit tokens along all outgoing flows. This is the default behavior
 * @param {BPMNProcess} process
 * @param {Object} data
 */
BPMNFlowObject.prototype.emitTokens = function(process, data) {
    var currentFlowObject = this;
    var outgoingSequenceFlows = process.processDefinition.getOutgoingSequenceFlows(currentFlowObject);
    outgoingSequenceFlows.forEach(function(outgoingSequenceFlow) {
        process.emitTokenAlong(outgoingSequenceFlow, data);
    });
};

/**
 * @param {ErrorQueue} errorQueue
 */
BPMNFlowObject.prototype.assertName = function(errorQueue) {
    var name = this.name.trim();
    if (name === "") {
        errorQueue.addError("FO1", "Found a " + this.type + " flow object having no name. BPMN id='" + this.bpmnId + "'.");
    }
};

/**
 * @param {BPMNProcessDefinition} processDefinition
 * @param {ErrorQueue} errorQueue
 */
BPMNFlowObject.prototype.assertOutgoingSequenceFlows = function(processDefinition, errorQueue) {
    if (!processDefinition.hasOutgoingSequenceFlows(this)) {
        errorQueue.addError("FO2", "The " + this.type + " '" + this.name + "' must have at least one outgoing sequence flow.");
    }
};

/**
 * @param {BPMNProcessDefinition} processDefinition
 * @param {ErrorQueue} errorQueue
 */
BPMNFlowObject.prototype.assertOneOutgoingSequenceFlow = function(processDefinition, errorQueue) {
    var outgoingFlows = processDefinition.getOutgoingSequenceFlows(this);
    if (outgoingFlows.length !== 1) {
        errorQueue.addError("FO3", "The " + this.type + " '" + this.name + "' must have exactly one outgoing sequence flow.");
    }
};

/**
 * @param {BPMNProcessDefinition} processDefinition
 * @param {ErrorQueue} errorQueue
 */
BPMNFlowObject.prototype.assertNoOutgoingSequenceFlows = function(processDefinition, errorQueue) {
    if (processDefinition.hasOutgoingSequenceFlows(this)) {
        errorQueue.addError("FO4", "The " + this.type + " '" + this.name + "' must not have outgoing sequence flows.");
    }
};

/**
 * @param {BPMNProcessDefinition} processDefinition
 * @param {ErrorQueue} errorQueue
 */
BPMNFlowObject.prototype.assertIncomingSequenceFlows = function(processDefinition, errorQueue) {
    if (!processDefinition.hasIncomingSequenceFlows(this)) {
        errorQueue.addError("FO5", "The " + this.type + " '" + this.name + "' must have at least one incoming sequence flow.");
    }
};

/**
 * @param {BPMNProcessDefinition} processDefinition
 * @param {ErrorQueue} errorQueue
 */
BPMNFlowObject.prototype.assertNoIncomingSequenceFlows = function(processDefinition, errorQueue) {
    if (processDefinition.hasIncomingSequenceFlows(this)) {
        errorQueue.addError("FO5", "The " + this.type + " '" + this.name + "' must not have incoming sequence flows.");
    }
};
