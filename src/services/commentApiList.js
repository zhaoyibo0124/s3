/**
 * enterpriseManagement
 * */
import { requestEncryption, METHOD, request } from "@/utils/request";
import {
  login,
  logout,
  genPublicKey,
  genImageCode,
  queryJsonBasicList,
  provicneAdd,
  provinceDelete,
  provinceUpdate,
  provinceQueryList,
  provinceDisable,
  provinceRecovery,
  cityAdd,
  cityDelete,
  cityUpdate,
  cityQueryList,
  cityDisable,
  cityRecovery,
  areaAdd,
  areaDelete,
  areaUpdate,
  areaQueryList,
  areaDisable,
  areaRecovery,
  streetAdd,
  streetDelete,
  streetUpdate,
  streetQueryList,
  streetDisable,
  streetRecovery,
  basicAdd,
  basicDelete,
  basicUpdate,
  basicQueryList,
  basicDisable,
  basicRecovery,
  redisCreateCache,
  redisResetCache,
  systemAdd,
  systemDelete,
  systemUpdate,
  systemQueryList,
  systemDisable,
  systemRecovery,
  systemFindBySystemCode,
  menuAdd,
  menuDelete,
  menuUpdate,
  menuQueryList,
  menuDisable,
  menuRecovery,
  menuFindPowerMenu,
  operationAdd,
  operationDelete,
  operationUpdate,
  operationQueryList,
  operationDisable,
  operationRecovery,
  fileAdd,
  fileDelete,
  fileUpdate,
  fileQueryList,
  fileDisable,
  fileRecovery,
  elementAdd,
  elementDelete,
  elementUpdate,
  elementQueryList,
  elementDisable,
  elementRecovery,
  powerAdd,
  powerDelete,
  powerUpdate,
  powerQueryList,
  powerDisable,
  powerRecovery,
  powerFindPowerList,
  powerFindPowerOperation,
  powerQueryPowerList,
  roleAdd,
  roleDelete,
  roleUpdate,
  roleQueryList,
  roleDisable,
  roleRecovery,
  roleQueryRoleList,
  enterpriseAdd,
  enterpriseDelete,
  enterpriseUpdate,
  enterpriseQueryList,
  enterpriseDisable,
  enterpriseRecovery,
  departmentAdd,
  departmentDelete,
  departmentUpdate,
  departmentQueryList,
  departmentDisable,
  departmentRecovery,
  departmentFindDepartmentList,
  positionAdd,
  positionDelete,
  positionUpdate,
  positionQueryList,
  positionDisable,
  positionRecovery,
  positionFindPositionList,
  groupAdd,
  groupDelete,
  groupUpdate,
  groupQueryList,
  groupDisable,
  groupRecovery,
  userAdd,
  userDelete,
  userUpdate,
  userQueryList,
  userDisable,
  userRecovery,
  userResetPassword,
  logDictionaryQueryList,
  logUserQueryList,
  logFormQueryList,
  logFileQueryList,
  logRecovery,
  logReduction,
  customizeFormAdd,
  customizeFormDelete,
  customizeFormUpdate,
  customizeFormQueryList,
  customizeFormDisable,
  customizeFormRecovery,
  customizeColumnAdd,
  customizeColumnDelete,
  customizeColumnUpdate,
  customizeColumnQueryList,
  customizeColumnDisable,
  customizeColumnRecovery,
  customizeQueryAdd,
  customizeQueryDelete,
  customizeQueryUpdate,
  customizeQueryQueryList,
  customizeQueryDisable,
  customizeQueryRecovery,
  customizeReturnAdd,
  customizeReturnDelete,
  customizeReturnUpdate,
  customizeReturnQueryList,
  customizeReturnDisable,
  customizeReturnRecovery,
  customizeSetUpAdd,
  customizeSetUpFind,
  customizeSetUpDetail,
  customizeSetUpSql,
  customizeOperationAdd,
  customizeOperationDelete,
  customizeOperationUpdate,
  customizeOperationQueryList,
  customizeOperationDisable,
  customizeOperationRecovery,
  customizeExportData,
  customizeExportTemplate,
  customizeImportData,
  statisticsFormAdd,
  statisticsFormDelete,
  statisticsFormUpdate,
  statisticsFormQueryList,
  statisticsFormDisable,
  statisticsFormRecovery,
  statisticsFormSql,
  statisticsFormShow,
  statisticsFormExport,
  formFileAdd,
  formFileDelete,
  formFileUpdate,
  formFileQueryList,
  formFileDisable,
  formFileRecovery,
  uploadFileAdd,
  uploadFileDelete,
  uploadFileUpdate,
  uploadFileQueryList,
  uploadFileDisable,
  uploadFileRecovery,
  changeFileAdd,
  changeFileDelete,
  changeFileUpdate,
  changeFileQueryList,
  changeFileDisable,
  changeFileRecovery,
  removeFileAdd,
  removeFileDelete,
  removeFileUpdate,
  removeFileQueryList,
  removeFileDisable,
  removeFileRecovery,
  downFileAdd,
  downFileDelete,
  downFileUpdate,
  downFileQueryList,
  downFileDisable,
  downFileRecovery,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  queryListTemplate,
  addGeneralTemplate,
  updateGeneralTemplate,
  deleteGeneralTemplate,
  disableGeneralTemplate,
  recoveryGeneralTemplate,
  queryListGeneralTemplate,
  queryListProcess,
  deleteProcess,
  identify,
  setFormatSave,
  setFormatNext,
  uploadFile,
  importUploadFile,
  deleteUploadFile,
  checkFile,
  findType,
  findResult,
  optimize,
  getTemplateDetail,
  getUserInfo,
  updateUserInfo,
  updateUserPassword,
  register,
  identifyRuleList,
  identifyRuleDelete,
  identifyRuleDisable,
  identifyRuleRecovery,
  identifyRuleAdd,
  identifyRuleUpdate,
  genSmsCode,
  findByUserId,
  createMember,
  cloudCode,
  cloudBindUser,
  cloudUserPay,
  prepaid,
  timeQueryList,
  timeDelete,
  timeDisable,
  timeRecovery,
  timeAdd,
  timeUpdate,
  dateQueryList,
  dateDelete,
  dateDisable,
  dateRecovery,
  dateAdd,
  dateUpdate,
  holidayQueryList,
  holidayDelete,
  holidayDisable,
  holidayRecovery,
  holidayAdd,
  holidayUpdate,
  projectBudgetQueryList,
  projectBudgetDelete,
  projectBudgetDisable,
  projectBudgetRecovery,
  projectBudgetAdd,
  projectBudgetUpdate,
  regionBudgetQueryList,
  regionBudgetDelete,
  regionBudgetDisable,
  regionBudgetRecovery,
  regionBudgetAdd,
  regionBudgetUpdate,
  keywordQueryList,
  keywordDelete,
  keywordDisable,
  keywordRecovery,
  keywordAdd,
  keywordUpdate,
  mediumQueryList,
  mediumDelete,
  mediumDisable,
  mediumRecovery,
  mediumAdd,
  mediumUpdate,
  superviseQueryList,
  superviseDelete,
  superviseDisable,
  superviseRecovery,
  superviseAdd,
  superviseUpdate,
  approachQueryList,
  approachDelete,
  approachDisable,
  approachRecovery,
  approachAdd,
  approachUpdate,
  intContentRuleQueryList,
  intContentRuleDelete,
  intContentRuleDisable,
  intContentRuleRecovery,
  intContentRuleAdd,
  intContentRuleUpdate,
  contentRegexQueryList,
  contentRegexDelete,
  contentRegexDisable,
  contentRegexRecovery,
  contentRegexAdd,
  contentRegexUpdate,
  importantQueryList,
  importantDelete,
  importantDisable,
  importantRecovery,
  importantAdd,
  importantUpdate,
  generalQueryList,
  generalDelete,
  generalDisable,
  generalRecovery,
  generalAdd,
  generalUpdate,
  modelList,
  generalFilterQueryList,
  generalFilterDelete,
  generalFilterDisable,
  generalFilterRecovery,
  generalFilterAdd,
  generalFilterUpdate,
  fixedQueryList,
  fixedDelete,
  fixedDisable,
  fixedRecovery,
  fixedAdd,
  fixedUpdate,
  scoreQueryList,
  scoreDelete,
  scoreDisable,
  scoreRecovery,
  scoreAdd,
  scoreUpdate,
  contradictionQueryList,
  contradictionDelete,
  contradictionDisable,
  contradictionRecovery,
  contradictionAdd,
  contradictionUpdate,
  timeRuleQueryList,
  timeRuleDelete,
  timeRuleDisable,
  timeRuleRecovery,
  timeRuleAdd,
  timeRuleUpdate,
  timeRexQueryList,
  timeRexDelete,
  timeRexDisable,
  timeRexRecovery,
  timeRexAdd,
  timeRexUpdate,
  moneyQueryList,
  moneyDelete,
  moneyDisable,
  moneyRecovery,
  moneyAdd,
  moneyUpdate,
  timeCalculateQueryList,
  timeCalculateDelete,
  timeCalculateDisable,
  timeCalculateRecovery,
  timeCalculateAdd,
  timeCalculateUpdate,
  budgetCalculateQueryList,
  budgetCalculateDelete,
  budgetCalculateDisable,
  budgetCalculateRecovery,
  budgetCalculateAdd,
  budgetCalculateUpdate,
  basicErrorQueryList,
  basicErrorDelete,
  basicErrorDisable,
  basicErrorRecovery,
  basicErrorAdd,
  basicErrorUpdate,
  completeQueryList,
  completeDelete,
  completeDisable,
  completeRecovery,
  completeAdd,
  completeUpdate,
  basicLogicQueryList,
  basicLogicDelete,
  basicLogicDisable,
  basicLogicRecovery,
  basicLogicAdd,
  basicLogicUpdate,
  timeLogicQueryList,
  timeLogicDelete,
  timeLogicDisable,
  timeLogicRecovery,
  timeLogicAdd,
  timeLogicUpdate,
  moneyLogicQueryList,
  moneyLogicDelete,
  moneyLogicDisable,
  moneyLogicRecovery,
  moneyLogicAdd,
  moneyLogicUpdate,
  timeComplianceQueryList,
  timeComplianceDelete,
  timeComplianceDisable,
  timeComplianceRecovery,
  timeComplianceAdd,
  timeComplianceUpdate,
  biddingComplianceQueryList,
  biddingComplianceDelete,
  biddingComplianceDisable,
  biddingComplianceRecovery,
  biddingComplianceAdd,
  biddingComplianceUpdate,
  depositComplianceQueryList,
  depositComplianceDelete,
  depositComplianceDisable,
  depositComplianceRecovery,
  depositComplianceAdd,
  depositComplianceUpdate,
  exaFileQueryList,
  exaFileDelete,
  exaFileDisable,
  exaFileRecovery,
  exaFileUpdate,
  exaFileUpload,
  exaUseQueryList,
  reviewQueryList,
  reviewDetail,
  documentUpload,
  contentEntry,
  infoEntry,
  infoEntryDetail,
  updatePreparationStatus,
  synchronize,
  reviewAction,
  recognizeQueryList,
  recognizeDelete,
  recognizeDisable,
  recognizeRecovery,
  recognizeUpdate,
  recognizeAdd,
  queryTypeList,
  examineAction,
  exaProjectQueryList,
  exaProjectDelete,
  exaProjectDisable,
  exaProjectRecovery,
  exaProjectUpdate,
  exaProjectAdd,
} from "@/services/api";
export async function exaProjectQueryListApi(data) {
  return request(exaProjectQueryList, METHOD.POST, data);
}
export async function exaProjectDeleteApi(data) {
  return request(exaProjectDelete, METHOD.POST, data);
}
export async function exaProjectDisableApi(data) {
  return request(exaProjectDisable, METHOD.POST, data);
}
export async function exaProjectRecoveryApi(data) {
  return request(exaProjectRecovery, METHOD.POST, data);
}
export async function exaProjectUpdateApi(data) {
  return request(exaProjectUpdate, METHOD.POST, data);
}
export async function exaProjectAddApi(data) {
  return request(exaProjectAdd, METHOD.POST, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}



export async function examineActionApi(data) {
  return request(examineAction, METHOD.POST, data);
}
export async function queryTypeListApi(data) {
  return request(queryTypeList, METHOD.POST, data);
}


export async function recognizeQueryListApi(data) {
  return request(recognizeQueryList, METHOD.POST, data);
}
export async function recognizeDeleteApi(data) {
  return request(recognizeDelete, METHOD.POST, data);
}
export async function recognizeDisableApi(data) {
  return request(recognizeDisable, METHOD.POST, data);
}
export async function recognizeRecoveryApi(data) {
  return request(recognizeRecovery, METHOD.POST, data);
}
export async function recognizeUpdateApi(data) {
  return request(recognizeUpdate, METHOD.POST, data);
}
export async function recognizeAddApi(data) {
  return request(recognizeAdd, METHOD.POST, data);
}


export async function reviewActionApi(data) {
  return request(reviewAction, METHOD.POST, data);
}
export async function synchronizeApi(data) {
  return request(synchronize, METHOD.POST, data);
}

export async function updatePreparationStatusApi(data) {
  return request(updatePreparationStatus, METHOD.POST, data);
}
export async function infoEntryDetailApi(data) {
  return request(infoEntryDetail, METHOD.POST, data);
}
export async function infoEntryApi(data) {
  return request(infoEntry, METHOD.POST, data);
}
export async function contentEntryApi(data) {
  return request(contentEntry, METHOD.POST, data);
}

export async function documentUploadApi(data) {
  return request(documentUpload, METHOD.POST, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function reviewDetailApi(data) {
  return request(reviewDetail, METHOD.POST, data);
}
export async function reviewQueryListApi(data) {
  return request(reviewQueryList, METHOD.POST, data);
}

export async function exaUseQueryListApi(data) {
  return request(exaUseQueryList, METHOD.POST, data);
}

export async function exaFileQueryListApi(data) {
  return request(exaFileQueryList, METHOD.POST, data);
}
export async function exaFileDeleteApi(data) {
  return request(exaFileDelete, METHOD.POST, data);
}
export async function exaFileDisableApi(data) {
  return request(exaFileDisable, METHOD.POST, data);
}
export async function exaFileRecoveryApi(data) {
  return request(exaFileRecovery, METHOD.POST, data);
}
export async function exaFileUpdateApi(data) {
  return request(exaFileUpdate, METHOD.POST, data);
}
export async function exaFileUploadApi(data) {
  return request(exaFileUpload, METHOD.POST, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function depositComplianceQueryListApi(data) {
  return request(depositComplianceQueryList, METHOD.POST, data);
}
export async function depositComplianceDeleteApi(data) {
  return request(depositComplianceDelete, METHOD.POST, data);
}
export async function depositComplianceDisableApi(data) {
  return request(depositComplianceDisable, METHOD.POST, data);
}
export async function depositComplianceRecoveryApi(data) {
  return request(depositComplianceRecovery, METHOD.POST, data);
}
export async function depositComplianceAddApi(data) {
  return request(depositComplianceAdd, METHOD.POST, data);
}
export async function depositComplianceUpdateApi(data) {
  return request(depositComplianceUpdate, METHOD.POST, data);
}

export async function biddingComplianceQueryListApi(data) {
  return request(biddingComplianceQueryList, METHOD.POST, data);
}
export async function biddingComplianceDeleteApi(data) {
  return request(biddingComplianceDelete, METHOD.POST, data);
}
export async function biddingComplianceDisableApi(data) {
  return request(biddingComplianceDisable, METHOD.POST, data);
}
export async function biddingComplianceRecoveryApi(data) {
  return request(biddingComplianceRecovery, METHOD.POST, data);
}
export async function biddingComplianceAddApi(data) {
  return request(biddingComplianceAdd, METHOD.POST, data);
}
export async function biddingComplianceUpdateApi(data) {
  return request(biddingComplianceUpdate, METHOD.POST, data);
}

export async function timeComplianceQueryListApi(data) {
  return request(timeComplianceQueryList, METHOD.POST, data);
}
export async function timeComplianceDeleteApi(data) {
  return request(timeComplianceDelete, METHOD.POST, data);
}
export async function timeComplianceDisableApi(data) {
  return request(timeComplianceDisable, METHOD.POST, data);
}
export async function timeComplianceRecoveryApi(data) {
  return request(timeComplianceRecovery, METHOD.POST, data);
}
export async function timeComplianceAddApi(data) {
  return request(timeComplianceAdd, METHOD.POST, data);
}
export async function timeComplianceUpdateApi(data) {
  return request(timeComplianceUpdate, METHOD.POST, data);
}

export async function moneyLogicQueryListApi(data) {
  return request(moneyLogicQueryList, METHOD.POST, data);
}
export async function moneyLogicDeleteApi(data) {
  return request(moneyLogicDelete, METHOD.POST, data);
}
export async function moneyLogicDisableApi(data) {
  return request(moneyLogicDisable, METHOD.POST, data);
}
export async function moneyLogicRecoveryApi(data) {
  return request(moneyLogicRecovery, METHOD.POST, data);
}
export async function moneyLogicAddApi(data) {
  return request(moneyLogicAdd, METHOD.POST, data);
}
export async function moneyLogicUpdateApi(data) {
  return request(moneyLogicUpdate, METHOD.POST, data);
}

export async function timeLogicQueryListApi(data) {
  return request(timeLogicQueryList, METHOD.POST, data);
}
export async function timeLogicDeleteApi(data) {
  return request(timeLogicDelete, METHOD.POST, data);
}
export async function timeLogicDisableApi(data) {
  return request(timeLogicDisable, METHOD.POST, data);
}
export async function timeLogicRecoveryApi(data) {
  return request(timeLogicRecovery, METHOD.POST, data);
}
export async function timeLogicAddApi(data) {
  return request(timeLogicAdd, METHOD.POST, data);
}
export async function timeLogicUpdateApi(data) {
  return request(timeLogicUpdate, METHOD.POST, data);
}

export async function basicLogicQueryListApi(data) {
  return request(basicLogicQueryList, METHOD.POST, data);
}
export async function basicLogicDeleteApi(data) {
  return request(basicLogicDelete, METHOD.POST, data);
}
export async function basicLogicDisableApi(data) {
  return request(basicLogicDisable, METHOD.POST, data);
}
export async function basicLogicRecoveryApi(data) {
  return request(basicLogicRecovery, METHOD.POST, data);
}
export async function basicLogicAddApi(data) {
  return request(basicLogicAdd, METHOD.POST, data);
}
export async function basicLogicUpdateApi(data) {
  return request(basicLogicUpdate, METHOD.POST, data);
}

export async function completeQueryListApi(data) {
  return request(completeQueryList, METHOD.POST, data);
}
export async function completeDeleteApi(data) {
  return request(completeDelete, METHOD.POST, data);
}
export async function completeDisableApi(data) {
  return request(completeDisable, METHOD.POST, data);
}
export async function completeRecoveryApi(data) {
  return request(completeRecovery, METHOD.POST, data);
}
export async function completeAddApi(data) {
  return request(completeAdd, METHOD.POST, data);
}
export async function completeUpdateApi(data) {
  return request(completeUpdate, METHOD.POST, data);
}

export async function basicErrorQueryListApi(data) {
  return request(basicErrorQueryList, METHOD.POST, data);
}
export async function basicErrorDeleteApi(data) {
  return request(basicErrorDelete, METHOD.POST, data);
}
export async function basicErrorDisableApi(data) {
  return request(basicErrorDisable, METHOD.POST, data);
}
export async function basicErrorRecoveryApi(data) {
  return request(basicErrorRecovery, METHOD.POST, data);
}
export async function basicErrorAddApi(data) {
  return request(basicErrorAdd, METHOD.POST, data);
}
export async function basicErrorUpdateApi(data) {
  return request(basicErrorUpdate, METHOD.POST, data);
}

export async function budgetCalculateQueryListApi(data) {
  return request(budgetCalculateQueryList, METHOD.POST, data);
}
export async function budgetCalculateDeleteApi(data) {
  return request(budgetCalculateDelete, METHOD.POST, data);
}
export async function budgetCalculateDisableApi(data) {
  return request(budgetCalculateDisable, METHOD.POST, data);
}
export async function budgetCalculateRecoveryApi(data) {
  return request(budgetCalculateRecovery, METHOD.POST, data);
}
export async function budgetCalculateAddApi(data) {
  return request(budgetCalculateAdd, METHOD.POST, data);
}
export async function budgetCalculateUpdateApi(data) {
  return request(budgetCalculateUpdate, METHOD.POST, data);
}

export async function timeCalculateQueryListApi(data) {
  return request(timeCalculateQueryList, METHOD.POST, data);
}
export async function timeCalculateDeleteApi(data) {
  return request(timeCalculateDelete, METHOD.POST, data);
}
export async function timeCalculateDisableApi(data) {
  return request(timeCalculateDisable, METHOD.POST, data);
}
export async function timeCalculateRecoveryApi(data) {
  return request(timeCalculateRecovery, METHOD.POST, data);
}
export async function timeCalculateAddApi(data) {
  return request(timeCalculateAdd, METHOD.POST, data);
}
export async function timeCalculateUpdateApi(data) {
  return request(timeCalculateUpdate, METHOD.POST, data);
}

export async function moneyQueryListApi(data) {
  return request(moneyQueryList, METHOD.POST, data);
}
export async function moneyDeleteApi(data) {
  return request(moneyDelete, METHOD.POST, data);
}
export async function moneyDisableApi(data) {
  return request(moneyDisable, METHOD.POST, data);
}
export async function moneyRecoveryApi(data) {
  return request(moneyRecovery, METHOD.POST, data);
}
export async function moneyAddApi(data) {
  return request(moneyAdd, METHOD.POST, data);
}
export async function moneyUpdateApi(data) {
  return request(moneyUpdate, METHOD.POST, data);
}

export async function timeRexQueryListApi(data) {
  return request(timeRexQueryList, METHOD.POST, data);
}
export async function timeRexDeleteApi(data) {
  return request(timeRexDelete, METHOD.POST, data);
}
export async function timeRexDisableApi(data) {
  return request(timeRexDisable, METHOD.POST, data);
}
export async function timeRexRecoveryApi(data) {
  return request(timeRexRecovery, METHOD.POST, data);
}
export async function timeRexAddApi(data) {
  return request(timeRexAdd, METHOD.POST, data);
}
export async function timeRexUpdateApi(data) {
  return request(timeRexUpdate, METHOD.POST, data);
}

export async function timeRuleQueryListApi(data) {
  return request(timeRuleQueryList, METHOD.POST, data);
}
export async function timeRuleDeleteApi(data) {
  return request(timeRuleDelete, METHOD.POST, data);
}
export async function timeRuleDisableApi(data) {
  return request(timeRuleDisable, METHOD.POST, data);
}
export async function timeRuleRecoveryApi(data) {
  return request(timeRuleRecovery, METHOD.POST, data);
}
export async function timeRuleAddApi(data) {
  return request(timeRuleAdd, METHOD.POST, data);
}
export async function timeRuleUpdateApi(data) {
  return request(timeRuleUpdate, METHOD.POST, data);
}

export async function contradictionQueryListApi(data) {
  return request(contradictionQueryList, METHOD.POST, data);
}
export async function contradictionDeleteApi(data) {
  return request(contradictionDelete, METHOD.POST, data);
}
export async function contradictionDisableApi(data) {
  return request(contradictionDisable, METHOD.POST, data);
}
export async function contradictionRecoveryApi(data) {
  return request(contradictionRecovery, METHOD.POST, data);
}
export async function contradictionAddApi(data) {
  return request(contradictionAdd, METHOD.POST, data);
}
export async function contradictionUpdateApi(data) {
  return request(contradictionUpdate, METHOD.POST, data);
}

export async function scoreQueryListApi(data) {
  return request(scoreQueryList, METHOD.POST, data);
}
export async function scoreDeleteApi(data) {
  return request(scoreDelete, METHOD.POST, data);
}
export async function scoreDisableApi(data) {
  return request(scoreDisable, METHOD.POST, data);
}
export async function scoreRecoveryApi(data) {
  return request(scoreRecovery, METHOD.POST, data);
}
export async function scoreAddApi(data) {
  return request(scoreAdd, METHOD.POST, data);
}
export async function scoreUpdateApi(data) {
  return request(scoreUpdate, METHOD.POST, data);
}

export async function fixedQueryListApi(data) {
  return request(fixedQueryList, METHOD.POST, data);
}
export async function fixedDeleteApi(data) {
  return request(fixedDelete, METHOD.POST, data);
}
export async function fixedDisableApi(data) {
  return request(fixedDisable, METHOD.POST, data);
}
export async function fixedRecoveryApi(data) {
  return request(fixedRecovery, METHOD.POST, data);
}
export async function fixedAddApi(data) {
  return request(fixedAdd, METHOD.POST, data);
}
export async function fixedUpdateApi(data) {
  return request(fixedUpdate, METHOD.POST, data);
}

export async function generalFilterQueryListApi(data) {
  return request(generalFilterQueryList, METHOD.POST, data);
}
export async function generalFilterDeleteApi(data) {
  return request(generalFilterDelete, METHOD.POST, data);
}
export async function generalFilterDisableApi(data) {
  return request(generalFilterDisable, METHOD.POST, data);
}
export async function generalFilterRecoveryApi(data) {
  return request(generalFilterRecovery, METHOD.POST, data);
}
export async function generalFilterAddApi(data) {
  return request(generalFilterAdd, METHOD.POST, data);
}
export async function generalFilterUpdateApi(data) {
  return request(generalFilterUpdate, METHOD.POST, data);
}

export async function modelListApi(data) {
  return request(modelList, METHOD.POST, data);
}
export async function generalQueryListApi(data) {
  return request(generalQueryList, METHOD.POST, data);
}
export async function generalDeleteApi(data) {
  return request(generalDelete, METHOD.POST, data);
}
export async function generalDisableApi(data) {
  return request(generalDisable, METHOD.POST, data);
}
export async function generalRecoveryApi(data) {
  return request(generalRecovery, METHOD.POST, data);
}
export async function generalAddApi(data) {
  return request(generalAdd, METHOD.POST, data);
}
export async function generalUpdateApi(data) {
  return request(generalUpdate, METHOD.POST, data);
}

export async function importantQueryListApi(data) {
  return request(importantQueryList, METHOD.POST, data);
}
export async function importantDeleteApi(data) {
  return request(importantDelete, METHOD.POST, data);
}
export async function importantDisableApi(data) {
  return request(importantDisable, METHOD.POST, data);
}
export async function importantRecoveryApi(data) {
  return request(importantRecovery, METHOD.POST, data);
}
export async function importantAddApi(data) {
  return request(importantAdd, METHOD.POST, data);
}
export async function importantUpdateApi(data) {
  return request(importantUpdate, METHOD.POST, data);
}

export async function contentRegexQueryListApi(data) {
  return request(contentRegexQueryList, METHOD.POST, data);
}
export async function contentRegexDeleteApi(data) {
  return request(contentRegexDelete, METHOD.POST, data);
}
export async function contentRegexDisableApi(data) {
  return request(contentRegexDisable, METHOD.POST, data);
}
export async function contentRegexRecoveryApi(data) {
  return request(contentRegexRecovery, METHOD.POST, data);
}
export async function contentRegexAddApi(data) {
  return request(contentRegexAdd, METHOD.POST, data);
}
export async function contentRegexUpdateApi(data) {
  return request(contentRegexUpdate, METHOD.POST, data);
}

export async function intContentRuleQueryListApi(data) {
  return request(intContentRuleQueryList, METHOD.POST, data);
}
export async function intContentRuleDeleteApi(data) {
  return request(intContentRuleDelete, METHOD.POST, data);
}
export async function intContentRuleDisableApi(data) {
  return request(intContentRuleDisable, METHOD.POST, data);
}
export async function intContentRuleRecoveryApi(data) {
  return request(intContentRuleRecovery, METHOD.POST, data);
}
export async function intContentRuleAddApi(data) {
  return request(intContentRuleAdd, METHOD.POST, data);
}
export async function intContentRuleUpdateApi(data) {
  return request(intContentRuleUpdate, METHOD.POST, data);
}

export async function approachQueryListApi(data) {
  return request(approachQueryList, METHOD.POST, data);
}
export async function approachDeleteApi(data) {
  return request(approachDelete, METHOD.POST, data);
}
export async function approachDisableApi(data) {
  return request(approachDisable, METHOD.POST, data);
}
export async function approachRecoveryApi(data) {
  return request(approachRecovery, METHOD.POST, data);
}
export async function approachAddApi(data) {
  return request(approachAdd, METHOD.POST, data);
}
export async function approachUpdateApi(data) {
  return request(approachUpdate, METHOD.POST, data);
}

export async function superviseQueryListApi(data) {
  return request(superviseQueryList, METHOD.POST, data);
}
export async function superviseDeleteApi(data) {
  return request(superviseDelete, METHOD.POST, data);
}
export async function superviseDisableApi(data) {
  return request(superviseDisable, METHOD.POST, data);
}
export async function superviseRecoveryApi(data) {
  return request(superviseRecovery, METHOD.POST, data);
}
export async function superviseAddApi(data) {
  return request(superviseAdd, METHOD.POST, data);
}
export async function superviseUpdateApi(data) {
  return request(superviseUpdate, METHOD.POST, data);
}

export async function mediumQueryListApi(data) {
  return request(mediumQueryList, METHOD.POST, data);
}
export async function mediumDeleteApi(data) {
  return request(mediumDelete, METHOD.POST, data);
}
export async function mediumDisableApi(data) {
  return request(mediumDisable, METHOD.POST, data);
}
export async function mediumRecoveryApi(data) {
  return request(mediumRecovery, METHOD.POST, data);
}
export async function mediumAddApi(data) {
  return request(mediumAdd, METHOD.POST, data);
}
export async function mediumUpdateApi(data) {
  return request(mediumUpdate, METHOD.POST, data);
}

export async function keywordQueryListApi(data) {
  return request(keywordQueryList, METHOD.POST, data);
}
export async function keywordDeleteApi(data) {
  return request(keywordDelete, METHOD.POST, data);
}
export async function keywordDisableApi(data) {
  return request(keywordDisable, METHOD.POST, data);
}
export async function keywordRecoveryApi(data) {
  return request(keywordRecovery, METHOD.POST, data);
}
export async function keywordAddApi(data) {
  return request(keywordAdd, METHOD.POST, data);
}
export async function keywordUpdateApi(data) {
  return request(keywordUpdate, METHOD.POST, data);
}

export async function regionBudgetQueryListApi(data) {
  return request(regionBudgetQueryList, METHOD.POST, data);
}
export async function regionBudgetDeleteApi(data) {
  return request(regionBudgetDelete, METHOD.POST, data);
}
export async function regionBudgetDisableApi(data) {
  return request(regionBudgetDisable, METHOD.POST, data);
}
export async function regionBudgetRecoveryApi(data) {
  return request(regionBudgetRecovery, METHOD.POST, data);
}
export async function regionBudgetAddApi(data) {
  return request(regionBudgetAdd, METHOD.POST, data);
}
export async function regionBudgetUpdateApi(data) {
  return request(regionBudgetUpdate, METHOD.POST, data);
}

export async function projectBudgetQueryListApi(data) {
  return request(projectBudgetQueryList, METHOD.POST, data);
}
export async function projectBudgetDeleteApi(data) {
  return request(projectBudgetDelete, METHOD.POST, data);
}
export async function projectBudgetDisableApi(data) {
  return request(projectBudgetDisable, METHOD.POST, data);
}
export async function projectBudgetRecoveryApi(data) {
  return request(projectBudgetRecovery, METHOD.POST, data);
}
export async function projectBudgetAddApi(data) {
  return request(projectBudgetAdd, METHOD.POST, data);
}
export async function projectBudgetUpdateApi(data) {
  return request(projectBudgetUpdate, METHOD.POST, data);
}

export async function holidayQueryListApi(data) {
  return request(holidayQueryList, METHOD.POST, data);
}
export async function holidayDeleteApi(data) {
  return request(holidayDelete, METHOD.POST, data);
}
export async function holidayDisableApi(data) {
  return request(holidayDisable, METHOD.POST, data);
}
export async function holidayRecoveryApi(data) {
  return request(holidayRecovery, METHOD.POST, data);
}
export async function holidayAddApi(data) {
  return request(holidayAdd, METHOD.POST, data);
}
export async function holidayUpdateApi(data) {
  return request(holidayUpdate, METHOD.POST, data);
}

export async function dateQueryListApi(data) {
  return request(dateQueryList, METHOD.POST, data);
}
export async function dateDeleteApi(data) {
  return request(dateDelete, METHOD.POST, data);
}
export async function dateDisableApi(data) {
  return request(dateDisable, METHOD.POST, data);
}
export async function dateRecoveryApi(data) {
  return request(dateRecovery, METHOD.POST, data);
}
export async function dateAddApi(data) {
  return request(dateAdd, METHOD.POST, data);
}
export async function dateUpdateApi(data) {
  return request(dateUpdate, METHOD.POST, data);
}

export async function timeQueryListApi(data) {
  return request(timeQueryList, METHOD.POST, data);
}
export async function timeDeleteApi(data) {
  return request(timeDelete, METHOD.POST, data);
}
export async function timeDisableApi(data) {
  return request(timeDisable, METHOD.POST, data);
}
export async function timeRecoveryApi(data) {
  return request(timeRecovery, METHOD.POST, data);
}
export async function timeAddApi(data) {
  return request(timeAdd, METHOD.POST, data);
}
export async function timeUpdateApi(data) {
  return request(timeUpdate, METHOD.POST, data);
}

export async function Prepaid(data) {
  return request(prepaid, METHOD.POST, data);
}
export async function CloudUserPay(data) {
  return request(cloudUserPay, METHOD.POST, data);
}
export async function CloudBindUser(data) {
  return request(cloudBindUser, METHOD.POST, data);
}
export async function CloudCode(data) {
  return request(cloudCode, METHOD.POST, data);
}
export async function CreateMember(data) {
  return request(createMember, METHOD.POST, data);
}
export async function FindByUserId(data) {
  return request(findByUserId, METHOD.POST, data);
}
export async function GenSmsCode(data) {
  return requestEncryption(genSmsCode, METHOD.POST, data);
}
export async function IdentifyRuleUpdate(data) {
  return requestEncryption(identifyRuleUpdate, METHOD.POST, data);
}
export async function IdentifyRuleAdd(data) {
  return requestEncryption(identifyRuleAdd, METHOD.POST, data);
}
export async function IdentifyRuleRecovery(data) {
  return requestEncryption(identifyRuleRecovery, METHOD.POST, data);
}
export async function IdentifyRuleDisable(data) {
  return requestEncryption(identifyRuleDisable, METHOD.POST, data);
}
export async function IdentifyRuleDelete(data) {
  return requestEncryption(identifyRuleDelete, METHOD.POST, data);
}
export async function IdentifyRuleList(data) {
  return requestEncryption(identifyRuleList, METHOD.POST, data);
}
export async function Register(data) {
  return requestEncryption(register, METHOD.POST, data);
}
export async function UpdateUserPassword(data) {
  return requestEncryption(updateUserPassword, METHOD.POST, data);
}
export async function UpdateUserInfo(data) {
  return requestEncryption(updateUserInfo, METHOD.POST, data);
}
export async function GetUserInfo(data) {
  return requestEncryption(getUserInfo, METHOD.POST, data);
}
export async function GetTemplateDetail(data) {
  return request(getTemplateDetail, METHOD.POST, data);
}
export async function Optimize(data) {
  return request(optimize, METHOD.POST, data);
}
export async function FindResult(data) {
  return request(findResult, METHOD.POST, data);
}
export async function FindType(data) {
  return request(findType, METHOD.POST, data);
}
export async function DeleteProcess(data) {
  return request(deleteProcess, METHOD.POST, data);
}
export async function CheckFile(data) {
  return request(checkFile, METHOD.POST, data);
}
export async function DeleteUploadFile(data) {
  return request(deleteUploadFile, METHOD.POST, data);
}
export async function ImportUploadFile(data) {
  return request(importUploadFile, METHOD.POST, data);
}
export async function UploadFile(data) {
  return request(uploadFile, METHOD.POST, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export async function SetFormatNext(data) {
  return request(setFormatNext, METHOD.POST, data);
}
export async function SetFormatSave(data) {
  return request(setFormatSave, METHOD.POST, data);
}
export async function Identify(data) {
  return request(identify, METHOD.POST, data);
}
export async function QueryListProcess(data) {
  return request(queryListProcess, METHOD.POST, data);
}
export async function DisableGeneralTemplate(data) {
  return request(disableGeneralTemplate, METHOD.POST, data);
}
export async function RecoveryGeneralTemplate(data) {
  return request(recoveryGeneralTemplate, METHOD.POST, data);
}
export async function QueryListGeneralTemplate(data) {
  return request(queryListGeneralTemplate, METHOD.POST, data);
}
export async function DeleteGeneralTemplate(data) {
  return request(deleteGeneralTemplate, METHOD.POST, data);
}
export async function UpdateGeneralTemplate(data) {
  return request(updateGeneralTemplate, METHOD.POST, data);
}
export async function AddGeneralTemplate(data) {
  return request(addGeneralTemplate, METHOD.POST, data);
}

export async function QueryListTemplate(data) {
  return request(queryListTemplate, METHOD.POST, data);
}
export async function DeleteTemplate(data) {
  return request(deleteTemplate, METHOD.POST, data);
}
export async function UpdateTemplate(data) {
  return request(updateTemplate, METHOD.POST, data);
}
export async function AddTemplate(data) {
  return request(addTemplate, METHOD.POST, data);
}

export async function Login(data, config) {
  return requestEncryption(login, METHOD.POST, data, config);
}
export async function Logout() {
  return requestEncryption(logout, METHOD.POST);
}
export async function GenPublicKey() {
  return requestEncryption(genPublicKey, METHOD.GET);
}
export async function GenImageCode(data, config) {
  return requestEncryption(genImageCode, METHOD.POST, data, config);
}
export async function QueryJsonBasicList() {
  return requestEncryption(queryJsonBasicList, METHOD.GET);
}
export async function ProvinceQueryList(data) {
  return requestEncryption(provinceQueryList, METHOD.POST, data);
}
export async function ProvinceAdd(data) {
  return requestEncryption(provicneAdd, METHOD.POST, data);
}
export async function ProvinceDelete(data) {
  return requestEncryption(provinceDelete, METHOD.POST, data);
}
export async function ProvinceDisable(data) {
  return requestEncryption(provinceDisable, METHOD.POST, data);
}
export async function ProvinceRecovery(data) {
  return requestEncryption(provinceRecovery, METHOD.POST, data);
}
export async function ProvinceUpdate(data) {
  return requestEncryption(provinceUpdate, METHOD.POST, data);
}
export async function CityQueryList(data) {
  return requestEncryption(cityQueryList, METHOD.POST, data);
}
export async function CityAdd(data) {
  return requestEncryption(cityAdd, METHOD.POST, data);
}
export async function CityDelete(data) {
  return requestEncryption(cityDelete, METHOD.POST, data);
}
export async function CityDisable(data) {
  return requestEncryption(cityDisable, METHOD.POST, data);
}
export async function CityRecovery(data) {
  return requestEncryption(cityRecovery, METHOD.POST, data);
}
export async function CityUpdate(data) {
  return requestEncryption(cityUpdate, METHOD.POST, data);
}
export async function AreaQueryList(data) {
  return requestEncryption(areaQueryList, METHOD.POST, data);
}
export async function AreaAdd(data) {
  return requestEncryption(areaAdd, METHOD.POST, data);
}
export async function AreaDelete(data) {
  return requestEncryption(areaDelete, METHOD.POST, data);
}
export async function AreaDisable(data) {
  return requestEncryption(areaDisable, METHOD.POST, data);
}
export async function AreaRecovery(data) {
  return requestEncryption(areaRecovery, METHOD.POST, data);
}
export async function AreaUpdate(data) {
  return requestEncryption(areaUpdate, METHOD.POST, data);
}
export async function StreetQueryList(data) {
  return requestEncryption(streetQueryList, METHOD.POST, data);
}
export async function StreetAdd(data) {
  return requestEncryption(streetAdd, METHOD.POST, data);
}
export async function StreetDelete(data) {
  return requestEncryption(streetDelete, METHOD.POST, data);
}
export async function StreetDisable(data) {
  return requestEncryption(streetDisable, METHOD.POST, data);
}
export async function StreetRecovery(data) {
  return requestEncryption(streetRecovery, METHOD.POST, data);
}
export async function StreetUpdate(data) {
  return requestEncryption(streetUpdate, METHOD.POST, data);
}
export async function BasicQueryList(data) {
  return requestEncryption(basicQueryList, METHOD.POST, data);
}
export async function BasicAdd(data) {
  return requestEncryption(basicAdd, METHOD.POST, data);
}
export async function BasicDelete(data) {
  return requestEncryption(basicDelete, METHOD.POST, data);
}
export async function BasicDisable(data) {
  return requestEncryption(basicDisable, METHOD.POST, data);
}
export async function BasicRecovery(data) {
  return requestEncryption(basicRecovery, METHOD.POST, data);
}
export async function BasicUpdate(data) {
  return requestEncryption(basicUpdate, METHOD.POST, data);
}
export async function RedisCreateCache() {
  return requestEncryption(redisCreateCache, METHOD.GET);
}
export async function RedisResetCache() {
  return requestEncryption(redisResetCache, METHOD.GET);
}
export async function SystemQueryList(data) {
  return requestEncryption(systemQueryList, METHOD.POST, data);
}
export async function SystemAdd(data) {
  return requestEncryption(systemAdd, METHOD.POST, data);
}
export async function SystemDelete(data) {
  return requestEncryption(systemDelete, METHOD.POST, data);
}
export async function SystemDisable(data) {
  return requestEncryption(systemDisable, METHOD.POST, data);
}
export async function SystemRecovery(data) {
  return requestEncryption(systemRecovery, METHOD.POST, data);
}
export async function SystemUpdate(data) {
  return requestEncryption(systemUpdate, METHOD.POST, data);
}
export async function SystemFindBySystemCode(data, config) {
  return requestEncryption(systemFindBySystemCode, METHOD.POST, data, config);
}
export async function MenuQueryList(data) {
  return requestEncryption(menuQueryList, METHOD.POST, data);
}
export async function MenuAdd(data) {
  return requestEncryption(menuAdd, METHOD.POST, data);
}
export async function MenuDelete(data) {
  return requestEncryption(menuDelete, METHOD.POST, data);
}
export async function MenuDisable(data) {
  return requestEncryption(menuDisable, METHOD.POST, data);
}
export async function MenuRecovery(data) {
  return requestEncryption(menuRecovery, METHOD.POST, data);
}
export async function MenuUpdate(data) {
  return requestEncryption(menuUpdate, METHOD.POST, data);
}
export async function MenuFindPowerMenu(data) {
  return requestEncryption(menuFindPowerMenu, METHOD.POST, data);
}
export async function OperationQueryList(data) {
  return requestEncryption(operationQueryList, METHOD.POST, data);
}
export async function OperationAdd(data) {
  return requestEncryption(operationAdd, METHOD.POST, data);
}
export async function OperationDelete(data) {
  return requestEncryption(operationDelete, METHOD.POST, data);
}
export async function OperationDisable(data) {
  return requestEncryption(operationDisable, METHOD.POST, data);
}
export async function OperationRecovery(data) {
  return requestEncryption(operationRecovery, METHOD.POST, data);
}
export async function OperationUpdate(data) {
  return requestEncryption(operationUpdate, METHOD.POST, data);
}
export async function FileQueryList(data) {
  return requestEncryption(fileQueryList, METHOD.POST, data);
}
export async function FileAdd(data) {
  return requestEncryption(fileAdd, METHOD.POST, data);
}
export async function FileDelete(data) {
  return requestEncryption(fileDelete, METHOD.POST, data);
}
export async function FileDisable(data) {
  return requestEncryption(fileDisable, METHOD.POST, data);
}
export async function FileRecovery(data) {
  return requestEncryption(fileRecovery, METHOD.POST, data);
}
export async function FileUpdate(data) {
  return requestEncryption(fileUpdate, METHOD.POST, data);
}
export async function ElementQueryList(data) {
  return requestEncryption(elementQueryList, METHOD.POST, data);
}
export async function ElementAdd(data) {
  return requestEncryption(elementAdd, METHOD.POST, data);
}
export async function ElementDelete(data) {
  return requestEncryption(elementDelete, METHOD.POST, data);
}
export async function ElementDisable(data) {
  return requestEncryption(elementDisable, METHOD.POST, data);
}
export async function ElementRecovery(data) {
  return requestEncryption(elementRecovery, METHOD.POST, data);
}
export async function ElementUpdate(data) {
  return requestEncryption(elementUpdate, METHOD.POST, data);
}
export async function PowerQueryList(data) {
  return requestEncryption(powerQueryList, METHOD.POST, data);
}
export async function PowerAdd(data) {
  return requestEncryption(powerAdd, METHOD.POST, data);
}
export async function PowerDelete(data) {
  return requestEncryption(powerDelete, METHOD.POST, data);
}
export async function PowerDisable(data) {
  return requestEncryption(powerDisable, METHOD.POST, data);
}
export async function PowerRecovery(data) {
  return requestEncryption(powerRecovery, METHOD.POST, data);
}
export async function PowerUpdate(data) {
  return requestEncryption(powerUpdate, METHOD.POST, data);
}
export async function PowerFindPowerList(data) {
  return requestEncryption(powerFindPowerList, METHOD.POST, data);
}
export async function PowerFindPowerOperation(data) {
  return requestEncryption(powerFindPowerOperation, METHOD.POST, data);
}
export async function PowerQueryPowerList(data) {
  return requestEncryption(powerQueryPowerList, METHOD.POST, data);
}
export async function RoleQueryList(data) {
  return requestEncryption(roleQueryList, METHOD.POST, data);
}
export async function RoleAdd(data) {
  return requestEncryption(roleAdd, METHOD.POST, data);
}
export async function RoleDelete(data) {
  return requestEncryption(roleDelete, METHOD.POST, data);
}
export async function RoleDisable(data) {
  return requestEncryption(roleDisable, METHOD.POST, data);
}
export async function RoleRecovery(data) {
  return requestEncryption(roleRecovery, METHOD.POST, data);
}
export async function RoleUpdate(data) {
  return requestEncryption(roleUpdate, METHOD.POST, data);
}
export async function RoleQueryRoleList(data) {
  return requestEncryption(roleQueryRoleList, METHOD.POST, data);
}
export async function EnterpriseQueryList(data) {
  return requestEncryption(enterpriseQueryList, METHOD.POST, data);
}
export async function EnterpriseAdd(data) {
  return requestEncryption(enterpriseAdd, METHOD.POST, data);
}
export async function EnterpriseDelete(data) {
  return requestEncryption(enterpriseDelete, METHOD.POST, data);
}
export async function EnterpriseDisable(data) {
  return requestEncryption(enterpriseDisable, METHOD.POST, data);
}
export async function EnterpriseRecovery(data) {
  return requestEncryption(enterpriseRecovery, METHOD.POST, data);
}
export async function EnterpriseUpdate(data) {
  return requestEncryption(enterpriseUpdate, METHOD.POST, data);
}
export async function DepartmentQueryList(data) {
  return requestEncryption(departmentQueryList, METHOD.POST, data);
}
export async function DepartmentAdd(data) {
  return requestEncryption(departmentAdd, METHOD.POST, data);
}
export async function DepartmentDelete(data) {
  return requestEncryption(departmentDelete, METHOD.POST, data);
}
export async function DepartmentDisable(data) {
  return requestEncryption(departmentDisable, METHOD.POST, data);
}
export async function DepartmentRecovery(data) {
  return requestEncryption(departmentRecovery, METHOD.POST, data);
}
export async function DepartmentUpdate(data) {
  return requestEncryption(departmentUpdate, METHOD.POST, data);
}
export async function DepartmentFindDepartmentList(data) {
  return requestEncryption(departmentFindDepartmentList, METHOD.POST, data);
}
export async function PositionQueryList(data) {
  return requestEncryption(positionQueryList, METHOD.POST, data);
}
export async function PositionAdd(data) {
  return requestEncryption(positionAdd, METHOD.POST, data);
}
export async function PositionDelete(data) {
  return requestEncryption(positionDelete, METHOD.POST, data);
}
export async function PositionDisable(data) {
  return requestEncryption(positionDisable, METHOD.POST, data);
}
export async function PositionRecovery(data) {
  return requestEncryption(positionRecovery, METHOD.POST, data);
}
export async function PositionUpdate(data) {
  return requestEncryption(positionUpdate, METHOD.POST, data);
}
export async function PositionFindPositionList(data) {
  return requestEncryption(positionFindPositionList, METHOD.POST, data);
}
export async function GroupQueryList(data) {
  return requestEncryption(groupQueryList, METHOD.POST, data);
}
export async function GroupAdd(data) {
  return requestEncryption(groupAdd, METHOD.POST, data);
}
export async function GroupDelete(data) {
  return requestEncryption(groupDelete, METHOD.POST, data);
}
export async function GroupDisable(data) {
  return requestEncryption(groupDisable, METHOD.POST, data);
}
export async function GroupRecovery(data) {
  return requestEncryption(groupRecovery, METHOD.POST, data);
}
export async function GroupUpdate(data) {
  return requestEncryption(groupUpdate, METHOD.POST, data);
}
export async function UserQueryList(data) {
  return requestEncryption(userQueryList, METHOD.POST, data);
}
export async function UserAdd(data) {
  return requestEncryption(userAdd, METHOD.POST, data);
}
export async function UserDelete(data) {
  return requestEncryption(userDelete, METHOD.POST, data);
}
export async function UserDisable(data) {
  return requestEncryption(userDisable, METHOD.POST, data);
}
export async function UserRecovery(data) {
  return requestEncryption(userRecovery, METHOD.POST, data);
}
export async function UserUpdate(data) {
  return requestEncryption(userUpdate, METHOD.POST, data);
}
export async function UserResetPassword(data) {
  return requestEncryption(userResetPassword, METHOD.POST, data);
}
export async function LogDictionaryQueryList(data) {
  return requestEncryption(logDictionaryQueryList, METHOD.POST, data);
}
export async function LogUserQueryList(data) {
  return requestEncryption(logUserQueryList, METHOD.POST, data);
}
export async function LogFormQueryList(data) {
  return requestEncryption(logFormQueryList, METHOD.POST, data);
}
export async function LogFileQueryList(data) {
  return requestEncryption(logFileQueryList, METHOD.POST, data);
}
export async function LogRecovery(data) {
  return requestEncryption(logRecovery, METHOD.POST, data);
}
export async function LogReduction(data) {
  return requestEncryption(logReduction, METHOD.POST, data);
}
export async function CustomizeFormQueryList(data) {
  return requestEncryption(customizeFormQueryList, METHOD.POST, data);
}
export async function CustomizeFormAdd(data) {
  return requestEncryption(customizeFormAdd, METHOD.POST, data);
}
export async function CustomizeFormDelete(data) {
  return requestEncryption(customizeFormDelete, METHOD.POST, data);
}
export async function CustomizeFormDisable(data) {
  return requestEncryption(customizeFormDisable, METHOD.POST, data);
}
export async function CustomizeFormRecovery(data) {
  return requestEncryption(customizeFormRecovery, METHOD.POST, data);
}
export async function CustomizeFormUpdate(data) {
  return requestEncryption(customizeFormUpdate, METHOD.POST, data);
}
export async function CustomizeColumnQueryList(data) {
  return requestEncryption(customizeColumnQueryList, METHOD.POST, data);
}
export async function CustomizeColumnAdd(data) {
  return requestEncryption(customizeColumnAdd, METHOD.POST, data);
}
export async function CustomizeColumnDelete(data) {
  return requestEncryption(customizeColumnDelete, METHOD.POST, data);
}
export async function CustomizeColumnDisable(data) {
  return requestEncryption(customizeColumnDisable, METHOD.POST, data);
}
export async function CustomizeColumnRecovery(data) {
  return requestEncryption(customizeColumnRecovery, METHOD.POST, data);
}
export async function CustomizeColumnUpdate(data) {
  return requestEncryption(customizeColumnUpdate, METHOD.POST, data);
}
export async function CustomizeQueryQueryList(data) {
  return requestEncryption(customizeQueryQueryList, METHOD.POST, data);
}
export async function CustomizeQueryAdd(data) {
  return requestEncryption(customizeQueryAdd, METHOD.POST, data);
}
export async function CustomizeQueryDelete(data) {
  return requestEncryption(customizeQueryDelete, METHOD.POST, data);
}
export async function CustomizeQueryDisable(data) {
  return requestEncryption(customizeQueryDisable, METHOD.POST, data);
}
export async function CustomizeQueryRecovery(data) {
  return requestEncryption(customizeQueryRecovery, METHOD.POST, data);
}
export async function CustomizeQueryUpdate(data) {
  return requestEncryption(customizeQueryUpdate, METHOD.POST, data);
}
export async function CustomizeReturnQueryList(data) {
  return requestEncryption(customizeReturnQueryList, METHOD.POST, data);
}
export async function CustomizeReturnAdd(data) {
  return requestEncryption(customizeReturnAdd, METHOD.POST, data);
}
export async function CustomizeReturnDelete(data) {
  return requestEncryption(customizeReturnDelete, METHOD.POST, data);
}
export async function CustomizeReturnDisable(data) {
  return requestEncryption(customizeReturnDisable, METHOD.POST, data);
}
export async function CustomizeReturnRecovery(data) {
  return requestEncryption(customizeReturnRecovery, METHOD.POST, data);
}
export async function CustomizeReturnUpdate(data) {
  return requestEncryption(customizeReturnUpdate, METHOD.POST, data);
}
export async function CustomizeSetUpAdd(data) {
  return requestEncryption(customizeSetUpAdd, METHOD.POST, data);
}
export async function CustomizeSetUpFind(data) {
  return requestEncryption(customizeSetUpFind, METHOD.POST, data);
}
export async function CustomizeSetUpDetail(data) {
  return requestEncryption(customizeSetUpDetail, METHOD.POST, data);
}
export async function CustomizeSetUpSql(data) {
  return requestEncryption(customizeSetUpSql, METHOD.POST, data);
}
export async function CustomizeOperationAdd(data) {
  return requestEncryption(customizeOperationAdd, METHOD.POST, data);
}
export async function CustomizeOperationDelete(data) {
  return requestEncryption(customizeOperationDelete, METHOD.POST, data);
}
export async function CustomizeOperationUpdate(data) {
  return requestEncryption(customizeOperationUpdate, METHOD.POST, data);
}
export async function CustomizeOperationQueryList(data) {
  return requestEncryption(customizeOperationQueryList, METHOD.POST, data);
}
export async function CustomizeOperationDisable(data) {
  return requestEncryption(customizeOperationDisable, METHOD.POST, data);
}
export async function CustomizeOperationRecovery(data) {
  return requestEncryption(customizeOperationRecovery, METHOD.POST, data);
}
export async function CustomizeExportData(data) {
  return requestEncryption(customizeExportData, METHOD.POST, data);
}
export async function CustomizeExportTemplate(data) {
  return requestEncryption(customizeExportTemplate, METHOD.POST, data);
}
export async function CustomizeImportData(data) {
  return requestEncryption(customizeImportData, METHOD.POST, data);
}
export async function StatisticsFormQueryList(data) {
  return requestEncryption(statisticsFormQueryList, METHOD.POST, data);
}
export async function StatisticsFormAdd(data) {
  return requestEncryption(statisticsFormAdd, METHOD.POST, data);
}
export async function StatisticsFormDelete(data) {
  return requestEncryption(statisticsFormDelete, METHOD.POST, data);
}
export async function StatisticsFormDisable(data) {
  return requestEncryption(statisticsFormDisable, METHOD.POST, data);
}
export async function StatisticsFormRecovery(data) {
  return requestEncryption(statisticsFormRecovery, METHOD.POST, data);
}
export async function StatisticsFormUpdate(data) {
  return requestEncryption(statisticsFormUpdate, METHOD.POST, data);
}
export async function StatisticsFormSql(data) {
  return requestEncryption(statisticsFormSql, METHOD.POST, data);
}
export async function StatisticsFormShow(data) {
  return requestEncryption(statisticsFormShow, METHOD.POST, data);
}
export async function StatisticsFormExport(data) {
  return requestEncryption(statisticsFormExport, METHOD.POST, data);
}
export async function FormFileQueryList(data) {
  return requestEncryption(formFileQueryList, METHOD.POST, data);
}
export async function FormFileAdd(data) {
  return requestEncryption(formFileAdd, METHOD.POST, data);
}
export async function FormFileDelete(data) {
  return requestEncryption(formFileDelete, METHOD.POST, data);
}
export async function FormFileDisable(data) {
  return requestEncryption(formFileDisable, METHOD.POST, data);
}
export async function FormFileRecovery(data) {
  return requestEncryption(formFileRecovery, METHOD.POST, data);
}
export async function FormFileUpdate(data) {
  return requestEncryption(formFileUpdate, METHOD.POST, data);
}
export async function UploadFileQueryList(data) {
  return requestEncryption(uploadFileQueryList, METHOD.POST, data);
}
export async function UploadFileAdd(data) {
  return requestEncryption(uploadFileAdd, METHOD.POST, data);
}
export async function UploadFileDelete(data) {
  return requestEncryption(uploadFileDelete, METHOD.POST, data);
}
export async function UploadFileDisable(data) {
  return requestEncryption(uploadFileDisable, METHOD.POST, data);
}
export async function UploadFileRecovery(data) {
  return requestEncryption(uploadFileRecovery, METHOD.POST, data);
}
export async function UploadFileUpdate(data) {
  return requestEncryption(uploadFileUpdate, METHOD.POST, data);
}
export async function ChangeFileQueryList(data) {
  return requestEncryption(changeFileQueryList, METHOD.POST, data);
}
export async function ChangeFileAdd(data) {
  return requestEncryption(changeFileAdd, METHOD.POST, data);
}
export async function ChangeFileDelete(data) {
  return requestEncryption(changeFileDelete, METHOD.POST, data);
}
export async function ChangeFileDisable(data) {
  return requestEncryption(changeFileDisable, METHOD.POST, data);
}
export async function ChangeFileRecovery(data) {
  return requestEncryption(changeFileRecovery, METHOD.POST, data);
}
export async function ChangeFileUpdate(data) {
  return requestEncryption(changeFileUpdate, METHOD.POST, data);
}
export async function RemoveFileQueryList(data) {
  return requestEncryption(removeFileQueryList, METHOD.POST, data);
}
export async function RemoveFileAdd(data) {
  return requestEncryption(removeFileAdd, METHOD.POST, data);
}
export async function RemoveFileDelete(data) {
  return requestEncryption(removeFileDelete, METHOD.POST, data);
}
export async function RemoveFileDisable(data) {
  return requestEncryption(removeFileDisable, METHOD.POST, data);
}
export async function RemoveFileRecovery(data) {
  return requestEncryption(removeFileRecovery, METHOD.POST, data);
}
export async function RemoveFileUpdate(data) {
  return requestEncryption(removeFileUpdate, METHOD.POST, data);
}
export async function DownFileQueryList(data) {
  return requestEncryption(downFileQueryList, METHOD.POST, data);
}
export async function DownFileAdd(data) {
  return requestEncryption(downFileAdd, METHOD.POST, data);
}
export async function DownFileDelete(data) {
  return requestEncryption(downFileDelete, METHOD.POST, data);
}
export async function DownFileDisable(data) {
  return requestEncryption(downFileDisable, METHOD.POST, data);
}
export async function DownFileRecovery(data) {
  return requestEncryption(downFileRecovery, METHOD.POST, data);
}
export async function DownFileUpdate(data) {
  return requestEncryption(downFileUpdate, METHOD.POST, data);
}
