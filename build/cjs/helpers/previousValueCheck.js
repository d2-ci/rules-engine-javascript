"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOutputEffectsWithPreviousValueCheck = void 0;

var _constants = require("../constants");

const processDataElementValue = _ref => {
  let {
    dataElementId,
    dataElements
  } = _ref;

  if (dataElementId && dataElements && dataElements[dataElementId]) {
    const dataElement = dataElements[dataElementId];
    return {
      valueName: dataElement.name,
      valueType: dataElement.optionSetId ? _constants.typeKeys.TEXT : dataElement.valueType
    };
  }

  return {
    valueName: '',
    valueType: _constants.typeKeys.TEXT
  };
};

const processTEAValue = _ref2 => {
  let {
    trackedEntityAttributeId,
    trackedEntityAttributes
  } = _ref2;

  if (trackedEntityAttributeId && trackedEntityAttributes && trackedEntityAttributes[trackedEntityAttributeId]) {
    const attribute = trackedEntityAttributes[trackedEntityAttributeId];
    return {
      valueName: attribute.displayFormName || attribute.displayName,
      valueType: attribute.optionSetId ? _constants.typeKeys.TEXT : attribute.valueType
    };
  }

  return {
    valueName: '',
    valueType: _constants.typeKeys.TEXT
  };
};

const mapByTargetDataTypes = Object.freeze({
  [_constants.rulesEngineEffectTargetDataTypes.DATA_ELEMENT]: processDataElementValue,
  [_constants.rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE]: processTEAValue
});

const getOutputEffectsWithPreviousValueCheck = _ref3 => {
  let {
    outputEffects,
    formValues,
    dataElementId,
    trackedEntityAttributeId,
    dataElements,
    trackedEntityAttributes,
    onProcessValue
  } = _ref3;
  return outputEffects.reduce((acc, outputEffect) => {
    if (formValues && outputEffect.targetDataType) {
      const rawValue = formValues[outputEffect.id];
      const {
        valueType,
        valueName
      } = mapByTargetDataTypes[outputEffect.targetDataType]({
        dataElementId,
        trackedEntityAttributeId,
        dataElements,
        trackedEntityAttributes
      });
      const value = onProcessValue(rawValue, valueType);

      if (value) {
        return [...acc, { ...outputEffect,
          hadValue: true,
          name: valueName
        }];
      }

      return [...acc, outputEffect];
    }

    return [...acc, outputEffect];
  }, []);
};

exports.getOutputEffectsWithPreviousValueCheck = getOutputEffectsWithPreviousValueCheck;