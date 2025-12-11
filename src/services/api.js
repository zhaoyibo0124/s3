// 跨域代理前缀
// const API_PROXY_PREFIX='/tenderware'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
	// 公共接口
	login: `${BASE_URL}/user/user/login/login`,
	logout: `${BASE_URL}/user/user/login/logout`,
	genPublicKey:`${BASE_URL}/user/user/code/genPublicKey`,
	genImageCode:`${BASE_URL}/user/user/code/genImageStringCode`,
	queryJsonBasicList: `${BASE_URL}/dictionary/dictionary/basic/queryJsonList`,
	
	// 省份管理
	provicneAdd: `${BASE_URL}/dictionary/dictionary/province/add`,
	provinceDelete: `${BASE_URL}/dictionary/dictionary/province/delete`,
	provinceUpdate: `${BASE_URL}/dictionary/dictionary/province/update`,
	provinceQueryList: `${BASE_URL}/dictionary/dictionary/province/queryList`,
	provinceDisable: `${BASE_URL}/dictionary/dictionary/province/disable`,
	provinceRecovery: `${BASE_URL}/dictionary/dictionary/province/recovery`,

	// 市区管理
	cityAdd: `${BASE_URL}/dictionary/dictionary/city/add`,
	cityDelete: `${BASE_URL}/dictionary/dictionary/city/delete`,
	cityUpdate: `${BASE_URL}/dictionary/dictionary/city/update`,
	cityQueryList: `${BASE_URL}/dictionary/dictionary/city/queryList`,
	cityDisable: `${BASE_URL}/dictionary/dictionary/city/disable`,
	cityRecovery: `${BASE_URL}/dictionary/dictionary/city/recovery`,

	// 地区管理
	areaAdd: `${BASE_URL}/dictionary/dictionary/area/add`,
	areaDelete: `${BASE_URL}/dictionary/dictionary/area/delete`,
	areaUpdate: `${BASE_URL}/dictionary/dictionary/area/update`,
	areaQueryList: `${BASE_URL}/dictionary/dictionary/area/queryList`,
	areaDisable: `${BASE_URL}/dictionary/dictionary/area/disable`,
	areaRecovery: `${BASE_URL}/dictionary/dictionary/area/recovery`,

	// 街道管理
	streetAdd: `${BASE_URL}/dictionary/dictionary/street/add`,
	streetDelete: `${BASE_URL}/dictionary/dictionary/street/delete`,
	streetUpdate: `${BASE_URL}/dictionary/dictionary/street/update`,
	streetQueryList: `${BASE_URL}/dictionary/dictionary/street/queryList`,
	streetDisable: `${BASE_URL}/dictionary/dictionary/street/disable`,
	streetRecovery: `${BASE_URL}/dictionary/dictionary/street/recovery`,

	// 基础字典
	basicAdd: `${BASE_URL}/dictionary/dictionary/basic/add`,
	basicDelete: `${BASE_URL}/dictionary/dictionary/basic/delete`,
	basicUpdate: `${BASE_URL}/dictionary/dictionary/basic/update`,
	basicQueryList: `${BASE_URL}/dictionary/dictionary/basic/queryList`,
	basicDisable: `${BASE_URL}/dictionary/dictionary/basic/disable`,
	basicRecovery: `${BASE_URL}/dictionary/dictionary/basic/recovery`,

	// 缓存管理
	redisCreateCache: `${BASE_URL}/dictionary/dictionary/redis/createCache`,
	redisResetCache: `${BASE_URL}/dictionary/dictionary/redis/resetCache`,

	// 系统管理
	systemAdd: `${BASE_URL}/user/user/system/add`,
	systemDelete: `${BASE_URL}/user/user/system/delete`,
	systemUpdate: `${BASE_URL}/user/user/system/update`,
	systemQueryList: `${BASE_URL}/user/user/system/queryList`,
	systemDisable: `${BASE_URL}/user/user/system/disable`,
	systemRecovery: `${BASE_URL}/user/user/system/recovery`,
	systemFindBySystemCode: `${BASE_URL}/user/user/system/findBySystemCode`,

	// 菜单管理
	menuAdd: `${BASE_URL}/user/user/menu/add`,
	menuDelete: `${BASE_URL}/user/user/menu/delete`,
	menuUpdate: `${BASE_URL}/user/user/menu/update`,
	menuQueryList: `${BASE_URL}/user/user/menu/queryList`,
	menuDisable: `${BASE_URL}/user/user/menu/disable`,
	menuRecovery: `${BASE_URL}/user/user/menu/recovery`,
	menuFindPowerMenu: `${BASE_URL}/user/user/menu/findPowerMenu`,

	// 功能操作管理
	operationAdd: `${BASE_URL}/user/user/operation/add`,
	operationDelete: `${BASE_URL}/user/user/operation/delete`,
	operationUpdate: `${BASE_URL}/user/user/operation/update`,
	operationQueryList: `${BASE_URL}/user/user/operation/queryList`,
	operationDisable: `${BASE_URL}/user/user/operation/disable`,
	operationRecovery: `${BASE_URL}/user/user/operation/recovery`,

	// 静态文件管理
	fileAdd: `${BASE_URL}/user/user/file/add`,
	fileDelete: `${BASE_URL}/user/user/file/delete`,
	fileUpdate: `${BASE_URL}/user/user/file/update`,
	fileQueryList: `${BASE_URL}/user/user/file/queryList`,
	fileDisable: `${BASE_URL}/user/user/file/disable`,
	fileRecovery: `${BASE_URL}/user/user/file/recovery`,

	// 页面元素管理
	elementAdd: `${BASE_URL}/user/user/element/add`,
	elementDelete: `${BASE_URL}/user/user/element/delete`,
	elementUpdate: `${BASE_URL}/user/user/element/update`,
	elementQueryList: `${BASE_URL}/user/user/element/queryList`,
	elementDisable: `${BASE_URL}/user/user/element/disable`,
	elementRecovery: `${BASE_URL}/user/user/element/recovery`,

	// 权限管理
	powerAdd: `${BASE_URL}/user/user/power/add`,
	powerDelete: `${BASE_URL}/user/user/power/delete`,
	powerUpdate: `${BASE_URL}/user/user/power/update`,
	powerQueryList: `${BASE_URL}/user/user/power/queryList`,
	powerDisable: `${BASE_URL}/user/user/power/disable`,
	powerRecovery: `${BASE_URL}/user/user/power/recovery`,
	powerFindPowerList: `${BASE_URL}/user/user/power/findPowerList`,
	powerFindPowerOperation: `${BASE_URL}/user/user/power/findPowerOperation`,
	powerQueryPowerList: `${BASE_URL}/user/user/power/queryPowerList`,

	// 角色管理
	roleAdd: `${BASE_URL}/user/user/role/add`,
	roleDelete: `${BASE_URL}/user/user/role/delete`,
	roleUpdate: `${BASE_URL}/user/user/role/update`,
	roleQueryList: `${BASE_URL}/user/user/role/queryList`,
	roleDisable: `${BASE_URL}/user/user/role/disable`,
	roleRecovery: `${BASE_URL}/user/user/role/recovery`,
	roleQueryRoleList: `${BASE_URL}/user/user/role/queryRoleList`,

	// 企业管理
	enterpriseAdd: `${BASE_URL}/user/user/enterprise/add`,
	enterpriseDelete: `${BASE_URL}/user/user/enterprise/delete`,
	enterpriseUpdate: `${BASE_URL}/user/user/enterprise/update`,
	enterpriseQueryList: `${BASE_URL}/user/user/enterprise/queryList`,
	enterpriseDisable: `${BASE_URL}/user/user/enterprise/disable`,
	enterpriseRecovery: `${BASE_URL}/user/user/enterprise/recovery`,

	// 部门管理
	departmentAdd: `${BASE_URL}/user/user/department/add`,
	departmentDelete: `${BASE_URL}/user/user/department/delete`,
	departmentUpdate: `${BASE_URL}/user/user/department/update`,
	departmentQueryList: `${BASE_URL}/user/user/department/queryList`,
	departmentDisable: `${BASE_URL}/user/user/department/disable`,
	departmentRecovery: `${BASE_URL}/user/user/department/recovery`,
	departmentFindDepartmentList: `${BASE_URL}/user/user/department/findDepartmentList`,

	// 职位管理
	positionAdd: `${BASE_URL}/user/user/position/add`,
	positionDelete: `${BASE_URL}/user/user/position/delete`,
	positionUpdate: `${BASE_URL}/user/user/position/update`,
	positionQueryList: `${BASE_URL}/user/user/position/queryList`,
	positionDisable: `${BASE_URL}/user/user/position/disable`,
	positionRecovery: `${BASE_URL}/user/user/position/recovery`,
	positionFindPositionList: `${BASE_URL}/user/user/position/findPositionList`,

	// 用户组管理
	groupAdd: `${BASE_URL}/user/user/group/add`,
	groupDelete: `${BASE_URL}/user/user/group/delete`,
	groupUpdate: `${BASE_URL}/user/user/group/update`,
	groupQueryList: `${BASE_URL}/user/user/group/queryList`,
	groupDisable: `${BASE_URL}/user/user/group/disable`,
	groupRecovery: `${BASE_URL}/user/user/group/recovery`,

	// 用户管理
	userAdd: `${BASE_URL}/user/user/user/add`,
	userDelete: `${BASE_URL}/user/user/user/delete`,
	userUpdate: `${BASE_URL}/user/user/user/update`,
	userQueryList: `${BASE_URL}/user/user/user/queryList`,
	userDisable: `${BASE_URL}/user/user/user/disable`,
	userRecovery: `${BASE_URL}/user/user/user/recovery`,
	userResetPassword: `${BASE_URL}/user/user/user/resetPassword`,

	// 数据字典日志
	logDictionaryQueryList: `${BASE_URL}/log/log/dictionary/queryList`,

	// 组织权限日志
	logUserQueryList: `${BASE_URL}/log/log/user/queryList`,

	// 表单管理日志
	logFormQueryList: `${BASE_URL}/log/log/form/queryList`,

	// 文件管理日志
	logFileQueryList: `${BASE_URL}/log/log/file/queryList`,
	
	// 还原日志
	logRecovery: `${BASE_URL}/log/log/recovery`,
	// 恢复日志
	logReduction: `${BASE_URL}/log/log/reduction`,

	// 自定义表单管理
	customizeFormAdd: `${BASE_URL}/form/form/form/add`,
	customizeFormDelete: `${BASE_URL}/form/form/form/delete`,
	customizeFormUpdate: `${BASE_URL}/form/form/form/update`,
	customizeFormQueryList: `${BASE_URL}/form/form/form/queryList`,
	customizeFormDisable: `${BASE_URL}/form/form/form/disable`,
	customizeFormRecovery: `${BASE_URL}/form/form/form/recovery`,

	// 自定义表单字段管理
	customizeColumnAdd: `${BASE_URL}/form/form/column/add`,
	customizeColumnDelete: `${BASE_URL}/form/form/column/delete`,
	customizeColumnUpdate: `${BASE_URL}/form/form/column/update`,
	customizeColumnQueryList: `${BASE_URL}/form/form/column/queryList`,
	customizeColumnDisable: `${BASE_URL}/form/form/column/disable`,
	customizeColumnRecovery: `${BASE_URL}/form/form/column/recovery`,

	// 自定义表单查询管理
	customizeQueryAdd: `${BASE_URL}/form/form/query/add`,
	customizeQueryDelete: `${BASE_URL}/form/form/query/delete`,
	customizeQueryUpdate: `${BASE_URL}/form/form/query/update`,
	customizeQueryQueryList: `${BASE_URL}/form/form/query/queryList`,
	customizeQueryDisable: `${BASE_URL}/form/form/query/disable`,
	customizeQueryRecovery: `${BASE_URL}/form/form/query/recovery`,

	// 自定义表单返回管理
	customizeReturnAdd: `${BASE_URL}/form/form/return/add`,
	customizeReturnDelete: `${BASE_URL}/form/form/return/delete`,
	customizeReturnUpdate: `${BASE_URL}/form/form/return/update`,
	customizeReturnQueryList: `${BASE_URL}/form/form/return/queryList`,
	customizeReturnDisable: `${BASE_URL}/form/form/return/disable`,
	customizeReturnRecovery: `${BASE_URL}/form/form/return/recovery`,

	// 自定义表单设置
	customizeSetUpAdd: `${BASE_URL}/form/form/setUp/addSetUp`,
	customizeSetUpFind: `${BASE_URL}/form/form/setUp/findSetUp`,
	customizeSetUpDetail: `${BASE_URL}/form/form/setUp/detail`,
	customizeSetUpSql: `${BASE_URL}/form/form/setUp/sql`,

	// 自定义表单操作
	customizeOperationAdd: `${BASE_URL}/form/form/operation/add`,
	customizeOperationDelete: `${BASE_URL}/form/form/operation/delete`,
	customizeOperationUpdate: `${BASE_URL}/form/form/operation/update`,
	customizeOperationQueryList: `${BASE_URL}/form/form/operation/queryList`,
	customizeOperationDisable: `${BASE_URL}/form/form/operation/disable`,
	customizeOperationRecovery: `${BASE_URL}/form/form/operation/recovery`,
	customizeExportData: `${BASE_URL}/form/form/export/exportExcel`,
	customizeExportTemplate: `${BASE_URL}/form/form/export/exportTemplateExcel`,
	customizeImportData: `${BASE_URL}/form/form/import/importExcel`,

	// 统计表单管理
	statisticsFormAdd: `${BASE_URL}/form/form/statistics/add`,
	statisticsFormDelete: `${BASE_URL}/form/form/statistics/delete`,
	statisticsFormUpdate: `${BASE_URL}/form/form/statistics/update`,
	statisticsFormQueryList: `${BASE_URL}/form/form/statistics/queryList`,
	statisticsFormDisable: `${BASE_URL}/form/form/statistics/disable`,
	statisticsFormRecovery: `${BASE_URL}/form/form/statistics/recovery`,
	statisticsFormSql: `${BASE_URL}/form/form/statistics/sql`,
	statisticsFormShow: `${BASE_URL}/form/form/statistics/show`,
	statisticsFormExport: `${BASE_URL}/form/form/statistics/exportExcel`,

	// 表单文件管理
	formFileAdd: `${BASE_URL}/file/office/offFileForm/add`,
	formFileDelete: `${BASE_URL}/file/office/offFileForm/delete`,
	formFileUpdate: `${BASE_URL}/file/office/offFileForm/update`,
	formFileQueryList: `${BASE_URL}/file/office/offFileForm/queryList`,
	formFileDisable: `${BASE_URL}/file/office/offFileForm/disable`,
	formFileRecovery: `${BASE_URL}/file/office/offFileForm/recovery`,

	// 上传文件管理
	uploadFileAdd: `${BASE_URL}/file/office/offFileUpload/add`,
	uploadFileDelete: `${BASE_URL}/file/office/offFileUpload/delete`,
	uploadFileUpdate: `${BASE_URL}/file/office/offFileUpload/update`,
	uploadFileQueryList: `${BASE_URL}/file/office/offFileUpload/queryList`,
	uploadFileDisable: `${BASE_URL}/file/office/offFileUpload/disable`,
	uploadFileRecovery: `${BASE_URL}/file/office/offFileUpload/recovery`,

	// 转换文件管理
	changeFileAdd: `${BASE_URL}/file/office/offFileChange/add`,
	changeFileDelete: `${BASE_URL}/file/office/offFileChange/delete`,
	changeFileUpdate: `${BASE_URL}/file/office/offFileChange/update`,
	changeFileQueryList: `${BASE_URL}/file/office/offFileChange/queryList`,
	changeFileDisable: `${BASE_URL}/file/office/offFileChange/disable`,
	changeFileRecovery: `${BASE_URL}/file/office/offFileChange/recovery`,

	// 删除文件管理
	removeFileAdd: `${BASE_URL}/file/office/offFileRemove/add`,
	removeFileDelete: `${BASE_URL}/file/office/offFileRemove/delete`,
	removeFileUpdate: `${BASE_URL}/file/office/offFileRemove/update`,
	removeFileQueryList: `${BASE_URL}/file/office/offFileRemove/queryList`,
	removeFileDisable: `${BASE_URL}/file/office/offFileRemove/disable`,
	removeFileRecovery: `${BASE_URL}/file/office/offFileRemove/recovery`,

	// 下载文件管理
	downFileAdd: `${BASE_URL}/file/office/offFileDown/add`,
	downFileDelete: `${BASE_URL}/file/office/offFileDown/delete`,
	downFileUpdate: `${BASE_URL}/file/office/offFileDown/update`,
	downFileQueryList: `${BASE_URL}/file/office/offFileDown/queryList`,
	downFileDisable: `${BASE_URL}/file/office/offFileDown/disable`,
	downFileRecovery: `${BASE_URL}/file/office/offFileDown/recovery`,

	// 个人模版
	addTemplate:`${BASE_URL}/file/office/verifyIndividualTemplate/addTemplate`,
	updateTemplate:`${BASE_URL}/file/office/verifyIndividualTemplate/updateTemplate`,
	deleteTemplate:`${BASE_URL}/file/office/verifyIndividualTemplate/delete`,
	queryListTemplate:`${BASE_URL}/file/office/verifyIndividualTemplate/queryList`,
	// 通用模版
	addGeneralTemplate:`${BASE_URL}/file/office/verifyGeneralTemplate/addTemplate`,
	updateGeneralTemplate:`${BASE_URL}/file/office/verifyGeneralTemplate/updateTemplate`,
	deleteGeneralTemplate:`${BASE_URL}/file/office/verifyGeneralTemplate/delete`,
	disableGeneralTemplate:`${BASE_URL}/file/office/verifyGeneralTemplate/disable`,
	recoveryGeneralTemplate:`${BASE_URL}/file/office/verifyGeneralTemplate/recovery`,
	queryListGeneralTemplate:`${BASE_URL}/file/office/verifyGeneralTemplate/queryList`,
	// 我的流程
	queryListProcess:`${BASE_URL}/file/office/typesettingProcess/queryPageList`,
	deleteProcess:`${BASE_URL}/file/office/typesettingProcess/delete`,

	// 获取已经填写的流程
	getTemplateDetail:`${BASE_URL}/file/office/typesettingProcess/findById`,
	// 工作台流程
	// 第一步识别内容
	identify:`${BASE_URL}/file/office/typesetting/identify`,
	// 第一步保存
	setFormatSave:`${BASE_URL}/file/office/typesetting/setFormatSave`,
	// 第一步完成
	setFormatNext:`${BASE_URL}/file/office/typesetting/setFormatNext`,
	// 第二步上传文件
	uploadFile:`${BASE_URL}/file/office/upload/uploadFile`,
	// 第二步导入文件
	importUploadFile:`${BASE_URL}/file/office/typesetting/uploadFile`,
	// 第二步删除上传文件
	deleteUploadFile:`${BASE_URL}/file/office/remove/uploadFile`,
	// 第二步开始检测
	checkFile:`${BASE_URL}/file/office/typesetting/check`,
	// 第三步检测结果类型
	findType:`${BASE_URL}/file/office/typesettingProcess/findType`,
	// 第三步检测结果内容
	findResult:`${BASE_URL}/file/office/typesettingProcess/findResult`,
	// 第三步一键优化
	optimize:`${BASE_URL}/file/office/typesetting/optimize`,

	// 用户信息
	getUserInfo:`${BASE_URL}/user/user/user/findById`,
	// 修改用户信息
	updateUserInfo:`${BASE_URL}/user/user/user/update`,
	// 修改密码
	updateUserPassword:`${BASE_URL}/user/user/user/updatePassword`,
	// 注册
	register:`${BASE_URL}/user/user/login/register`,

	// 识别规则管理列表
	identifyRuleList:`${BASE_URL}/file/office/identifyRule/queryList`,
	identifyRuleDelete:`${BASE_URL}/file/office/identifyRule/delete`,
	identifyRuleDisable:`${BASE_URL}/file/office/identifyRule/disable`,
	identifyRuleRecovery:`${BASE_URL}/file/office/identifyRule/recovery`,
	identifyRuleAdd:`${BASE_URL}/file/office/identifyRule/add`,
	identifyRuleUpdate:`${BASE_URL}/file/office/identifyRule/update`,
	// 短信验证码
	genSmsCode:`${BASE_URL}/user/user/code/genSmsCode`,
	// 查询用户信息
	findByUserId:`${BASE_URL}/file/office/payUser/findByUserId`,
	// 创建会员
	createMember:`${BASE_URL}/file/office/pay/createMember`,
	// 云商发送验证码
	cloudCode:`${BASE_URL}/file/office/pay/code`,
	// 云商用户绑定
	cloudBindUser:`${BASE_URL}/file/office/pay/bind`,
	cloudUserPay:`${BASE_URL}/file/office/pay/pay`,
	// 获取支付状态
	prepaid:`${BASE_URL}/file/office/typesetting/prepaid`,
	

	// 通用正则规则--时间
	timeQueryList:`${BASE_URL}/examine/examine/genTimeRule/queryList`,
	timeDelete:`${BASE_URL}/examine/examine/genTimeRule/delete`,
	timeDisable:`${BASE_URL}/examine/examine/genTimeRule/disable`,
	timeRecovery:`${BASE_URL}/examine/examine/genTimeRule/recovery`,
	timeAdd:`${BASE_URL}/examine/examine/genTimeRule/add`,
	timeUpdate:`${BASE_URL}/examine/examine/genTimeRule/update`,
	// 通用正则规则--日期
	dateQueryList:`${BASE_URL}/examine/examine/genDateRule/queryList`,
	dateDelete:`${BASE_URL}/examine/examine/genDateRule/delete`,
	dateDisable:`${BASE_URL}/examine/examine/genDateRule/disable`,
	dateRecovery:`${BASE_URL}/examine/examine/genDateRule/recovery`,
	dateAdd:`${BASE_URL}/examine/examine/genDateRule/add`,
	dateUpdate:`${BASE_URL}/examine/examine/genDateRule/update`,
	// 通用正则规则--假日
	holidayQueryList:`${BASE_URL}/examine/examine/genHolidayRule/queryList`,
	holidayDelete:`${BASE_URL}/examine/examine/genHolidayRule/delete`,
	holidayDisable:`${BASE_URL}/examine/examine/genHolidayRule/disable`,
	holidayRecovery:`${BASE_URL}/examine/examine/genHolidayRule/recovery`,
	holidayAdd:`${BASE_URL}/examine/examine/genHolidayRule/add`,
	holidayUpdate:`${BASE_URL}/examine/examine/genHolidayRule/update`,
	// 通用正则规则--项目预算
	projectBudgetQueryList:`${BASE_URL}/examine/examine/genProjectBudgetRule/queryList`,
	projectBudgetDelete:`${BASE_URL}/examine/examine/genProjectBudgetRule/delete`,
	projectBudgetDisable:`${BASE_URL}/examine/examine/genProjectBudgetRule/disable`,
	projectBudgetRecovery:`${BASE_URL}/examine/examine/genProjectBudgetRule/recovery`,
	projectBudgetAdd:`${BASE_URL}/examine/examine/genProjectBudgetRule/add`,
	projectBudgetUpdate:`${BASE_URL}/examine/examine/genProjectBudgetRule/update`,
	// 通用正则规则--地区预算
	regionBudgetQueryList:`${BASE_URL}/examine/examine/genRegionBudgetRule/queryList`,
	regionBudgetDelete:`${BASE_URL}/examine/examine/genRegionBudgetRule/delete`,
	regionBudgetDisable:`${BASE_URL}/examine/examine/genRegionBudgetRule/disable`,
	regionBudgetRecovery:`${BASE_URL}/examine/examine/genRegionBudgetRule/recovery`,
	regionBudgetAdd:`${BASE_URL}/examine/examine/genRegionBudgetRule/add`,
	regionBudgetUpdate:`${BASE_URL}/examine/examine/genRegionBudgetRule/update`,
	// 通用正则规则--关键字
	keywordQueryList:`${BASE_URL}/examine/examine/genKeywordRule/queryList`,
	keywordDelete:`${BASE_URL}/examine/examine/genKeywordRule/delete`,
	keywordDisable:`${BASE_URL}/examine/examine/genKeywordRule/disable`,
	keywordRecovery:`${BASE_URL}/examine/examine/genKeywordRule/recovery`,
	keywordAdd:`${BASE_URL}/examine/examine/genKeywordRule/add`,
	keywordUpdate:`${BASE_URL}/examine/examine/genKeywordRule/update`,
	// 通用正则规则--媒介
	mediumQueryList:`${BASE_URL}/examine/examine/genMediumRule/queryList`,
	mediumDelete:`${BASE_URL}/examine/examine/genMediumRule/delete`,
	mediumDisable:`${BASE_URL}/examine/examine/genMediumRule/disable`,
	mediumRecovery:`${BASE_URL}/examine/examine/genMediumRule/recovery`,
	mediumAdd:`${BASE_URL}/examine/examine/genMediumRule/add`,
	mediumUpdate:`${BASE_URL}/examine/examine/genMediumRule/update`,
	// 通用正则规则--监督
	superviseQueryList:`${BASE_URL}/examine/examine/genSuperviseRule/queryList`,
	superviseDelete:`${BASE_URL}/examine/examine/genSuperviseRule/delete`,
	superviseDisable:`${BASE_URL}/examine/examine/genSuperviseRule/disable`,
	superviseRecovery:`${BASE_URL}/examine/examine/genSuperviseRule/recovery`,
	superviseAdd:`${BASE_URL}/examine/examine/genSuperviseRule/add`,
	superviseUpdate:`${BASE_URL}/examine/examine/genSuperviseRule/update`,
	// 通用正则规则--进场
	approachQueryList:`${BASE_URL}/examine/examine/genApproachRule/queryList`,
	approachDelete:`${BASE_URL}/examine/examine/genApproachRule/delete`,
	approachDisable:`${BASE_URL}/examine/examine/genApproachRule/disable`,
	approachRecovery:`${BASE_URL}/examine/examine/genApproachRule/recovery`,
	approachAdd:`${BASE_URL}/examine/examine/genApproachRule/add`,
	approachUpdate:`${BASE_URL}/examine/examine/genApproachRule/update`,
	// 基础校验正则规则--目录及内容规则
	intContentRuleQueryList:`${BASE_URL}/examine/examine/intContentRule/queryList`,
	intContentRuleDelete:`${BASE_URL}/examine/examine/intContentRule/delete`,
	intContentRuleDisable:`${BASE_URL}/examine/examine/intContentRule/disable`,
	intContentRuleRecovery:`${BASE_URL}/examine/examine/intContentRule/recovery`,
	intContentRuleAdd:`${BASE_URL}/examine/examine/intContentRule/add`,
	intContentRuleUpdate:`${BASE_URL}/examine/examine/intContentRule/update`,
	// 基础校验正则规则--目录及内容正则
	contentRegexQueryList:`${BASE_URL}/examine/examine/intContentRegex/queryList`,
	contentRegexDelete:`${BASE_URL}/examine/examine/intContentRegex/delete`,
	contentRegexDisable:`${BASE_URL}/examine/examine/intContentRegex/disable`,
	contentRegexRecovery:`${BASE_URL}/examine/examine/intContentRegex/recovery`,
	contentRegexAdd:`${BASE_URL}/examine/examine/intContentRegex/add`,
	contentRegexUpdate:`${BASE_URL}/examine/examine/intContentRegex/update`,
	// 基础校验正则规则--重要规则
	importantQueryList:`${BASE_URL}/examine/examine/intImportantRule/queryList`,
	importantDelete:`${BASE_URL}/examine/examine/intImportantRule/delete`,
	importantDisable:`${BASE_URL}/examine/examine/intImportantRule/disable`,
	importantRecovery:`${BASE_URL}/examine/examine/intImportantRule/recovery`,
	importantAdd:`${BASE_URL}/examine/examine/intImportantRule/add`,
	importantUpdate:`${BASE_URL}/examine/examine/intImportantRule/update`,
	// 基础校验正则规则--通用规则
	generalQueryList:`${BASE_URL}/examine/examine/intGeneralRule/queryList`,
	generalDelete:`${BASE_URL}/examine/examine/intGeneralRule/delete`,
	generalDisable:`${BASE_URL}/examine/examine/intGeneralRule/disable`,
	generalRecovery:`${BASE_URL}/examine/examine/intGeneralRule/recovery`,
	generalAdd:`${BASE_URL}/examine/examine/intGeneralRule/add`,
	generalUpdate:`${BASE_URL}/examine/examine/intGeneralRule/update`,
	modelList:`${BASE_URL}/examine/examine/exaTemplate/queryList`,
	// 基础校验正则规则--通用过滤规则
	generalFilterQueryList:`${BASE_URL}/examine/examine/intGeneralFilterRule/queryList`,
	generalFilterDelete:`${BASE_URL}/examine/examine/intGeneralFilterRule/delete`,
	generalFilterDisable:`${BASE_URL}/examine/examine/intGeneralFilterRule/disable`,
	generalFilterRecovery:`${BASE_URL}/examine/examine/intGeneralFilterRule/recovery`,
	generalFilterAdd:`${BASE_URL}/examine/examine/intGeneralFilterRule/add`,
	generalFilterUpdate:`${BASE_URL}/examine/examine/intGeneralFilterRule/update`,
	// 基础校验正则规则--固定内容规则
	fixedQueryList:`${BASE_URL}/examine/examine/intFixedRule/queryList`,
	fixedDelete:`${BASE_URL}/examine/examine/intFixedRule/delete`,
	fixedDisable:`${BASE_URL}/examine/examine/intFixedRule/disable`,
	fixedRecovery:`${BASE_URL}/examine/examine/intFixedRule/recovery`,
	fixedAdd:`${BASE_URL}/examine/examine/intFixedRule/add`,
	fixedUpdate:`${BASE_URL}/examine/examine/intFixedRule/update`,
	// 逻辑校验正则规则--打分规则
	scoreQueryList:`${BASE_URL}/examine/examine/rouScoreRule/queryList`,
	scoreDelete:`${BASE_URL}/examine/examine/rouScoreRule/delete`,
	scoreDisable:`${BASE_URL}/examine/examine/rouScoreRule/disable`,
	scoreRecovery:`${BASE_URL}/examine/examine/rouScoreRule/recovery`,
	scoreAdd:`${BASE_URL}/examine/examine/rouScoreRule/add`,
	scoreUpdate:`${BASE_URL}/examine/examine/rouScoreRule/update`,
	// 逻辑校验正则规则--前后是否一致规则
	contradictionQueryList:`${BASE_URL}/examine/examine/rouContradictionRule/queryList`,
	contradictionDelete:`${BASE_URL}/examine/examine/rouContradictionRule/delete`,
	contradictionDisable:`${BASE_URL}/examine/examine/rouContradictionRule/disable`,
	contradictionRecovery:`${BASE_URL}/examine/examine/rouContradictionRule/recovery`,
	contradictionAdd:`${BASE_URL}/examine/examine/rouContradictionRule/add`,
	contradictionUpdate:`${BASE_URL}/examine/examine/rouContradictionRule/update`,
	// 逻辑校验正则规则--文件提交时间规则
	timeRuleQueryList:`${BASE_URL}/examine/examine/subTimeRule/queryList`,
	timeRuleDelete:`${BASE_URL}/examine/examine/subTimeRule/delete`,
	timeRuleDisable:`${BASE_URL}/examine/examine/subTimeRule/disable`,
	timeRuleRecovery:`${BASE_URL}/examine/examine/subTimeRule/recovery`,
	timeRuleAdd:`${BASE_URL}/examine/examine/subTimeRule/add`,
	timeRuleUpdate:`${BASE_URL}/examine/examine/subTimeRule/update`,
	// 逻辑校验正则规则--文件提交时间正则规则
	timeRexQueryList:`${BASE_URL}/examine/examine/subTimeRegex/queryList`,
	timeRexDelete:`${BASE_URL}/examine/examine/subTimeRegex/delete`,
	timeRexDisable:`${BASE_URL}/examine/examine/subTimeRegex/disable`,
	timeRexRecovery:`${BASE_URL}/examine/examine/subTimeRegex/recovery`,
	timeRexAdd:`${BASE_URL}/examine/examine/subTimeRegex/add`,
	timeRexUpdate:`${BASE_URL}/examine/examine/subTimeRegex/update`,
	// 逻辑校验正则规则--线上发售收费规则
	moneyQueryList:`${BASE_URL}/examine/examine/chaMoneyRule/queryList`,
	moneyDelete:`${BASE_URL}/examine/examine/chaMoneyRule/delete`,
	moneyDisable:`${BASE_URL}/examine/examine/chaMoneyRule/disable`,
	moneyRecovery:`${BASE_URL}/examine/examine/chaMoneyRule/recovery`,
	moneyAdd:`${BASE_URL}/examine/examine/chaMoneyRule/add`,
	moneyUpdate:`${BASE_URL}/examine/examine/chaMoneyRule/update`,
	contentList :`${BASE_URL}/examine/exaContent/queryList`,
	// 合规审核正则规则--时间节点合规性规则
	timeCalculateQueryList:`${BASE_URL}/examine/examine/timCalculateRule/queryList`,
	timeCalculateDelete:`${BASE_URL}/examine/examine/timCalculateRule/delete`,
	timeCalculateDisable:`${BASE_URL}/examine/examine/timCalculateRule/disable`,
	timeCalculateRecovery:`${BASE_URL}/examine/examine/timCalculateRule/recovery`,
	timeCalculateAdd:`${BASE_URL}/examine/examine/timCalculateRule/add`,
	timeCalculateUpdate:`${BASE_URL}/examine/examine/timCalculateRule/update`,
	// 合规审核正则规则--预算规则
	budgetCalculateQueryList:`${BASE_URL}/examine/examine/bidBudgetRule/queryList`,
	budgetCalculateDelete:`${BASE_URL}/examine/examine/bidBudgetRule/delete`,
	budgetCalculateDisable:`${BASE_URL}/examine/examine/bidBudgetRule/disable`,
	budgetCalculateRecovery:`${BASE_URL}/examine/examine/bidBudgetRule/recovery`,
	budgetCalculateAdd:`${BASE_URL}/examine/examine/bidBudgetRule/add`,
	budgetCalculateUpdate:`${BASE_URL}/examine/examine/bidBudgetRule/update`,
	// 基础校验智能体--常规审查
	basicErrorQueryList:`${BASE_URL}/examine/examine/revBasicErrorRule/queryList`,
	basicErrorDelete:`${BASE_URL}/examine/examine/revBasicErrorRule/delete`,
	basicErrorDisable:`${BASE_URL}/examine/examine/revBasicErrorRule/disable`,
	basicErrorRecovery:`${BASE_URL}/examine/examine/revBasicErrorRule/recovery`,
	basicErrorAdd:`${BASE_URL}/examine/examine/revBasicErrorRule/add`,
	basicErrorUpdate:`${BASE_URL}/examine/examine/revBasicErrorRule/update`,
	// 基础校验智能体--完整性审查
	completeQueryList:`${BASE_URL}/examine/examine/revBasicIntegrityRule/queryList`,
	completeDelete:`${BASE_URL}/examine/examine/revBasicIntegrityRule/delete`,
	completeDisable:`${BASE_URL}/examine/examine/revBasicIntegrityRule/disable`,
	completeRecovery:`${BASE_URL}/examine/examine/revBasicIntegrityRule/recovery`,
	completeAdd:`${BASE_URL}/examine/examine/revBasicIntegrityRule/add`,
	completeUpdate:`${BASE_URL}/examine/examine/revBasicIntegrityRule/update`,
	// 逻辑校验智能体--常规逻辑
	basicLogicQueryList:`${BASE_URL}/examine/examine/revLogicRoutineRule/queryList`,
	basicLogicDelete:`${BASE_URL}/examine/examine/revLogicRoutineRule/delete`,
	basicLogicDisable:`${BASE_URL}/examine/examine/revLogicRoutineRule/disable`,
	basicLogicRecovery:`${BASE_URL}/examine/examine/revLogicRoutineRule/recovery`,
	basicLogicAdd:`${BASE_URL}/examine/examine/revLogicRoutineRule/add`,
	basicLogicUpdate:`${BASE_URL}/examine/examine/revLogicRoutineRule/update`,
	// 逻辑校验智能体--文件提交时间
	timeLogicQueryList:`${BASE_URL}/examine/examine/revLogicSubmitRule/queryList`,
	timeLogicDelete:`${BASE_URL}/examine/examine/revLogicSubmitRule/delete`,
	timeLogicDisable:`${BASE_URL}/examine/examine/revLogicSubmitRule/disable`,
	timeLogicRecovery:`${BASE_URL}/examine/examine/revLogicSubmitRule/recovery`,
	timeLogicAdd:`${BASE_URL}/examine/examine/revLogicSubmitRule/add`,
	timeLogicUpdate:`${BASE_URL}/examine/examine/revLogicSubmitRule/update`,
	// 逻辑校验智能体--线上发售收费
	moneyLogicQueryList:`${BASE_URL}/examine/examine/revLogicChargeRule/queryList`,
	moneyLogicDelete:`${BASE_URL}/examine/examine/revLogicChargeRule/delete`,
	moneyLogicDisable:`${BASE_URL}/examine/examine/revLogicChargeRule/disable`,
	moneyLogicRecovery:`${BASE_URL}/examine/examine/revLogicChargeRule/recovery`,
	moneyLogicAdd:`${BASE_URL}/examine/examine/revLogicChargeRule/add`,
	moneyLogicUpdate:`${BASE_URL}/examine/examine/revLogicChargeRule/update`,
	// 合规审核智能体--时间节点
	timeComplianceQueryList:`${BASE_URL}/examine/examine/revComplianceTimeRule/queryList`,
	timeComplianceDelete:`${BASE_URL}/examine/examine/revComplianceTimeRule/delete`,
	timeComplianceDisable:`${BASE_URL}/examine/examine/revComplianceTimeRule/disable`,
	timeComplianceRecovery:`${BASE_URL}/examine/examine/revComplianceTimeRule/recovery`,
	timeComplianceAdd:`${BASE_URL}/examine/examine/revComplianceTimeRule/add`,
	timeComplianceUpdate:`${BASE_URL}/examine/examine/revComplianceTimeRule/update`,
	// 合规审核智能体--依法必招
	biddingComplianceQueryList:`${BASE_URL}/examine/examine/revComplianceBiddingRule/queryList`,
	biddingComplianceDelete:`${BASE_URL}/examine/examine/revComplianceBiddingRule/delete`,
	biddingComplianceDisable:`${BASE_URL}/examine/examine/revComplianceBiddingRule/disable`,
	biddingComplianceRecovery:`${BASE_URL}/examine/examine/revComplianceBiddingRule/recovery`,
	biddingComplianceAdd:`${BASE_URL}/examine/examine/revComplianceBiddingRule/add`,
	biddingComplianceUpdate:`${BASE_URL}/examine/examine/revComplianceBiddingRule/update`,
	// 合规审核智能体--保证金
	depositComplianceQueryList:`${BASE_URL}/examine/examine/revComplianceDepositRule/queryList`,
	depositComplianceDelete:`${BASE_URL}/examine/examine/revComplianceDepositRule/delete`,
	depositComplianceDisable:`${BASE_URL}/examine/examine/revComplianceDepositRule/disable`,
	depositComplianceRecovery:`${BASE_URL}/examine/examine/revComplianceDepositRule/recovery`,
	depositComplianceAdd:`${BASE_URL}/examine/examine/revComplianceDepositRule/add`,
	depositComplianceUpdate:`${BASE_URL}/examine/examine/revComplianceDepositRule/update`,
	// 范本管理--文件
	exaFileQueryList:`${BASE_URL}/examine/examine/exaTemplate/queryList`,
	exaFileDelete:`${BASE_URL}/examine/examine/exaTemplate/delete`,
	exaFileDisable:`${BASE_URL}/examine/examine/exaTemplate/disable`,
	exaFileRecovery:`${BASE_URL}/examine/examine/exaTemplate/recovery`,
	exaFileUpdate:`${BASE_URL}/examine/examine/exaTemplate/update`,
	exaFileUpload:`${BASE_URL}/examine/examine/exaTemplate/addTemplateFile`,
	// 范本管理--引用
	exaUseQueryList:`${BASE_URL}/examine/examine/exaTemplatePreparation/queryList`,
	// 文件审核列表
	reviewQueryList:`${BASE_URL}/examine/examine/exaProject/queryList`,
	reviewDetail:`${BASE_URL}/examine/examine/exaProject/findById`,
	exaProjectQueryList:`${BASE_URL}/examine/examine/exaProject/queryList`,
	exaProjectDelete:`${BASE_URL}/examine/examine/exaProject/delete`,
	exaProjectDisable:`${BASE_URL}/examine/examine/exaProject/disable`,
	exaProjectRecovery:`${BASE_URL}/examine/examine/exaProject/recovery`,
	exaProjectUpdate:`${BASE_URL}/examine/examine/exaProject/update`,
	exaProjectAdd:`${BASE_URL}/examine/examine/exaProject/addProjectFile`,


	// 文件审核-审核操作
	reviewAction:`${BASE_URL}/examine/examine/review/review`,
	//引用范本编制信息-上传文档
	documentUpload:`${BASE_URL}/examine/examine/exaTemplatePreparation/addTemplatePreparationUpload`,
	//引用范本编制信息-内容录入
	contentEntry:`${BASE_URL}/examine/examine/exaTemplatePreparation/addTemplatePreparationContent`,
	// 引用范本编制信息-关键信息
	infoEntry:`${BASE_URL}/examine/examine/exaTemplatePreparation/addTemplatePreparationInformation`,
	// 引用范本编制信息-获取详情 
	infoEntryDetail:`${BASE_URL}/examine/examine/exaTemplatePreparation/findById`,
	// 引用范本编制信息-完成 
	updatePreparationStatus:`${BASE_URL}/examine/examine/exaTemplatePreparation/updatePreparationStatus`,
	// 引用范本编制信息-同步
	synchronize:`${BASE_URL}/examine/examine/exaTemplatePreparation/synchronize`,
	// 智能编审智能体
	recognizeQueryList:`${BASE_URL}/examine/examine/wriRecognizeRule/queryList`,
	recognizeDelete:`${BASE_URL}/examine/examine/wriRecognizeRule/delete`,
	recognizeDisable:`${BASE_URL}/examine/examine/wriRecognizeRule/disable`,
	recognizeRecovery:`${BASE_URL}/examine/examine/wriRecognizeRule/recovery`,
	recognizeUpdate:`${BASE_URL}/examine/examine/wriRecognizeRule/update`,
	recognizeAdd:`${BASE_URL}/examine/examine/wriRecognizeRule/add`,
	// 分类查询审核记录
	queryTypeList:`${BASE_URL}/examine/examine/exaProjectExamine/queryTypeList`,
	// 审核通过或拒绝
	examineAction:`${BASE_URL}/examine/examine/exaProject/examine`,


}