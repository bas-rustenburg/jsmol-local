Clazz.declarePackage ("JM");
Clazz.load (["JU.BS", "$.SB"], "JM.Model", ["java.util.Hashtable", "JU.AU", "JU.BSUtil"], function () {
c$ = Clazz.decorateAsClass (function () {
this.ms = null;
this.modelIndex = 0;
this.fileIndex = 0;
this.hydrogenCount = 0;
this.isBioModel = false;
this.isPdbWithMultipleBonds = false;
this.hasRasmolHBonds = false;
this.loadState = "";
this.loadScript = null;
this.isModelKit = false;
this.dataFrames = null;
this.dataSourceFrame = -1;
this.jmolData = null;
this.jmolFrameType = null;
this.firstAtomIndex = 0;
this.ac = 0;
this.bsAtoms = null;
this.bsAtomsDeleted = null;
this.trajectoryBaseIndex = 0;
this.isTrajectory = false;
this.selectedTrajectory = -1;
this.bondCount = -1;
this.firstMoleculeIndex = 0;
this.moleculeCount = 0;
this.nAltLocs = 0;
this.nInsertions = 0;
this.groupCount = -1;
this.chainCount = 0;
this.chains = null;
this.biosymmetryCount = 0;
this.auxiliaryInfo = null;
this.properties = null;
this.defaultRotationRadius = 0;
this.defaultStructure = null;
this.biosymmetry = null;
this.orientation = null;
this.structureTainted = false;
this.isJmolDataFrame = false;
this.frameDelay = 0;
this.simpleCage = null;
this.dssrCache = null;
Clazz.instantialize (this, arguments);
}, JM, "Model");
Clazz.prepareFields (c$, function () {
this.loadScript =  new JU.SB ();
this.bsAtoms =  new JU.BS ();
this.bsAtomsDeleted =  new JU.BS ();
this.chains =  new Array (8);
});
Clazz.defineMethod (c$, "getModelSet", 
function () {
return this.ms;
});
Clazz.defineMethod (c$, "isModelkit", 
function () {
return this.isModelKit;
});
Clazz.defineMethod (c$, "getTrueAtomCount", 
function () {
return this.bsAtoms.cardinality () - this.bsAtomsDeleted.cardinality ();
});
Clazz.defineMethod (c$, "resetBoundCount", 
function () {
this.bondCount = -1;
});
Clazz.defineMethod (c$, "getBondCount", 
function () {
if (this.bondCount >= 0) return this.bondCount;
var bonds = this.ms.bo;
this.bondCount = 0;
for (var i = this.ms.bondCount; --i >= 0; ) if (bonds[i].atom1.mi == this.modelIndex) this.bondCount++;

return this.bondCount;
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "set", 
function (modelSet, modelIndex, trajectoryBaseIndex, jmolData, properties, auxiliaryInfo) {
this.ms = modelSet;
this.dataSourceFrame = this.modelIndex = modelIndex;
this.isTrajectory = (trajectoryBaseIndex >= 0);
this.trajectoryBaseIndex = (this.isTrajectory ? trajectoryBaseIndex : modelIndex);
if (auxiliaryInfo == null) {
auxiliaryInfo =  new java.util.Hashtable ();
}this.auxiliaryInfo = auxiliaryInfo;
if (auxiliaryInfo.containsKey ("biosymmetryCount")) {
this.biosymmetryCount = (auxiliaryInfo.get ("biosymmetryCount")).intValue ();
this.biosymmetry = auxiliaryInfo.get ("biosymmetry");
}this.properties = properties;
if (jmolData == null) {
this.jmolFrameType = "modelSet";
} else {
this.jmolData = jmolData;
this.isJmolDataFrame = true;
auxiliaryInfo.put ("jmolData", jmolData);
auxiliaryInfo.put ("title", jmolData);
this.jmolFrameType = (jmolData.indexOf ("ramachandran") >= 0 ? "ramachandran" : jmolData.indexOf ("quaternion") >= 0 ? "quaternion" : "data");
}return this;
}, "JM.ModelSet,~N,~N,~S,java.util.Properties,java.util.Map");
Clazz.defineMethod (c$, "getChainCount", 
function (countWater) {
if (this.chainCount > 1 && !countWater) for (var i = 0; i < this.chainCount; i++) if (this.chains[i].chainID == 0) return this.chainCount - 1;

return this.chainCount;
}, "~B");
Clazz.defineMethod (c$, "getGroupCountHetero", 
function (isHetero) {
var n = 0;
for (var i = this.chainCount; --i >= 0; ) for (var j = this.chains[i].groupCount; --j >= 0; ) if (this.chains[i].groups[j].isHetero () == isHetero) n++;


return n;
}, "~B");
Clazz.defineMethod (c$, "calcSelectedGroupsCount", 
function (bsSelected) {
for (var i = this.chainCount; --i >= 0; ) this.chains[i].calcSelectedGroupsCount (bsSelected);

}, "JU.BS");
Clazz.defineMethod (c$, "getGroupCount", 
function () {
if (this.groupCount < 0) {
this.groupCount = 0;
for (var i = this.chainCount; --i >= 0; ) this.groupCount += this.chains[i].groupCount;

}return this.groupCount;
});
Clazz.defineMethod (c$, "getChainAt", 
function (i) {
return (i < this.chainCount ? this.chains[i] : null);
}, "~N");
Clazz.defineMethod (c$, "getChain", 
function (chainID) {
for (var i = this.chainCount; --i >= 0; ) {
var chain = this.chains[i];
if (chain.chainID == chainID) return chain;
}
return null;
}, "~N");
Clazz.defineMethod (c$, "fixIndices", 
function (modelIndex, nAtomsDeleted, bsDeleted) {
this.fixIndicesM (modelIndex, nAtomsDeleted, bsDeleted);
}, "~N,~N,JU.BS");
Clazz.defineMethod (c$, "fixIndicesM", 
function (modelIndex, nAtomsDeleted, bsDeleted) {
if (this.dataSourceFrame > modelIndex) this.dataSourceFrame--;
if (this.trajectoryBaseIndex > modelIndex) this.trajectoryBaseIndex--;
this.firstAtomIndex -= nAtomsDeleted;
for (var i = 0; i < this.chainCount; i++) this.chains[i].fixIndices (nAtomsDeleted, bsDeleted);

JU.BSUtil.deleteBits (this.bsAtoms, bsDeleted);
JU.BSUtil.deleteBits (this.bsAtomsDeleted, bsDeleted);
}, "~N,~N,JU.BS");
Clazz.defineMethod (c$, "freeze", 
function () {
this.freezeM ();
});
Clazz.defineMethod (c$, "freezeM", 
function () {
this.chains = JU.AU.arrayCopyObject (this.chains, this.chainCount);
this.groupCount = -1;
this.getGroupCount ();
for (var i = 0; i < this.chainCount; ++i) this.chains[i].groups = JU.AU.arrayCopyObject (this.chains[i].groups, this.chains[i].groupCount);

});
Clazz.defineMethod (c$, "getPdbData", 
function (vwr, type, ctype, isDraw, bsSelected, out, tokens, pdbCONECT, bsWritten) {
}, "JV.Viewer,~S,~S,~B,JU.BS,JU.OC,~A,JU.SB,JU.BS");
Clazz.defineMethod (c$, "getBioBranches", 
function (bioBranches) {
return bioBranches;
}, "JU.Lst");
Clazz.defineMethod (c$, "clearBioPolymers", 
function () {
});
Clazz.defineMethod (c$, "getAllPolymerInfo", 
function (bs, finalInfo, modelVector) {
}, "JU.BS,java.util.Map,JU.Lst");
Clazz.defineMethod (c$, "getBioPolymerCount", 
function () {
return 0;
});
Clazz.defineMethod (c$, "calculateStructures", 
function (asDSSP, doReport, dsspIgnoreHydrogen, setStructure, includeAlpha) {
return "";
}, "~B,~B,~B,~B,~B");
Clazz.defineMethod (c$, "setStructureList", 
function (structureList) {
}, "java.util.Map");
Clazz.defineMethod (c$, "getChimeInfo", 
function (sb, nHetero) {
this.getChimeInfoM (sb, nHetero);
}, "JU.SB,~N");
Clazz.defineMethod (c$, "getChimeInfoM", 
function (sb, nHetero) {
sb.append ("\nNumber of Atoms ..... " + (this.ms.ac - nHetero));
if (nHetero > 0) sb.append (" (" + nHetero + ")");
sb.append ("\nNumber of Bonds ..... " + this.ms.bondCount);
sb.append ("\nNumber of Models ...... " + this.ms.mc);
}, "JU.SB,~N");
Clazz.defineMethod (c$, "setConformation", 
function (bsConformation) {
}, "JU.BS");
Clazz.defineMethod (c$, "getPdbConformation", 
function (bsConformation, conformationIndex) {
return false;
}, "JU.BS,~N");
Clazz.defineMethod (c$, "getFullPDBHeader", 
function () {
return null;
});
Clazz.defineMethod (c$, "getSequenceBits", 
function (ms, specInfo, bs) {
return null;
}, "JM.ModelSet,~S,JU.BS");
Clazz.defineMethod (c$, "getBasePairBits", 
function (ms, specInfo) {
return null;
}, "JM.ModelSet,~S");
Clazz.defineMethod (c$, "resetRasmolBonds", 
function (model, bs) {
}, "JM.Model,JU.BS");
Clazz.defineMethod (c$, "calcRasmolHydrogenBonds", 
function (ms, bsA, bsB, vHBonds, nucleicOnly, nMax, dsspIgnoreHydrogens, bsHBonds) {
}, "JM.ModelSet,JU.BS,JU.BS,JU.Lst,~B,~N,~B,JU.BS");
Clazz.defineMethod (c$, "getFullProteinStructureState", 
function (modelSet, bsAtoms2, taintedOnly, needPhiPsi, mode) {
return null;
}, "JM.ModelSet,JU.BS,~B,~B,~N");
Clazz.defineMethod (c$, "calculateAllPolymers", 
function (ms, groups, groupCount2, baseGroupIndex, modelsExcluded) {
}, "JM.ModelSet,~A,~N,~N,JU.BS");
Clazz.defineMethod (c$, "getGroupsWithinAll", 
function (ms, nResidues, bs) {
return null;
}, "JM.ModelSet,~N,JU.BS");
Clazz.defineMethod (c$, "getSelectCodeRange", 
function (ms, specInfo) {
return null;
}, "JM.ModelSet,~A");
Clazz.defineMethod (c$, "calculateStruts", 
function (ms, bs1, bs2) {
return 0;
}, "JM.ModelSet,JU.BS,JU.BS");
Clazz.defineMethod (c$, "getPolymerPointsAndVectors", 
function (bs, vList, isTraceAlpha, sheetSmoothing) {
}, "JU.BS,JU.Lst,~B,~N");
Clazz.defineMethod (c$, "recalculatePoints", 
function (ms, modelIndex) {
}, "JM.ModelSet,~N");
Clazz.defineMethod (c$, "getDefaultLargePDBRendering", 
function (sb, maxAtoms) {
}, "JU.SB,~N");
Clazz.defineMethod (c$, "calcSelectedMonomersCount", 
function (bsSelected) {
}, "JU.BS");
Clazz.defineMethod (c$, "getBioPolymerCountInModel", 
function (ms, modelIndex) {
return 0;
}, "JM.ModelSet,~N");
Clazz.defineMethod (c$, "calculateStraightnessAll", 
function (ms) {
}, "JM.ModelSet");
});
