/**
 * Created by zy on 2019/2/1.
 */
/*方法函数*/

/********************************************
 *****打开文件，支持本地路径和http服务器路径****
 *******************************************/
function ExLoadFile(FilePath) {
	LoadFile(FilePath, "test1", "", "打开文档失败");
}
/********************************************
 *****打开文件，原格式（word等）****
 *******************************************/
function ExLoadFiledoc(FilePath, type) {
	dispidLoadOriginalFile(FilePath, type, "", "", "打开文档失败");
}

function test(data) {
	GetShowRevisions('test1', '', '')
}

function test1(data) {

	console.log(data);
}
/********************************************
 *****本地文件保存****
 *******************************************/
function ExSaveTo(FilePath, FileType) {
	SaveTo(FilePath, FileType, 0, "rebSaveWord", "", "");
}

function rebSaveWord(data) {
	if (data.retcode == 1) {
		alert("保存文件成功");
	}
}
/********************************************
 *****文件提交服务器保存****
 *******************************************/
function ExHttpPost(FileName, FileType, HttpUrl) {
	var str = FileName + "`" + FileType + "`" + HttpUrl;
	HttpInit("rebHttpInit", str, "");
}

function rebHttpInit(data) {
	var str = data.calldata;
	var strs = str.split("`");
	HttpAddPostString("FileName", strs[0], "rebHttpAddPostString1", str, "");
}

function rebHttpAddPostString1(data) {
	var str = data.calldata;
	var strs = str.split("`");
	HttpAddPostString("FileType", strs[1], "rebHttpAddPostString2", str, "");
}

function rebHttpAddPostString2(data) {
	var str = data.calldata;
	HttpAddPostCurrFile("FileContent1", "rebHttpAddPostCurrFile", str, "");
}

function rebHttpAddPostCurrFile(data) {
	var str = data.calldata;
	var strs = str.split("`");
	HttpPost(strs[2], "rebHttpPostresult", "", "");
}

function rebHttpPostresult(data) {
	var i = data.retstr;
	alert(i);
	if (i == "kkkkk") {
		alert("上传成功");
	} else {
		alert("上传失败");
	}
}
/********************************************
 *****打开FTP服务器文件****
 *******************************************/
function ExOpenFtp(FtpIp, lPort, strUse, strPwd, strFtpFile) {
	FtpConnect(FtpIp, lPort, strUse, strPwd, "retExOpenFtp", strFtpFile, "");
}

function retExOpenFtp(data) {
	var str = data.calldata;
	GetTempFileName("", "retgetTemp", str, "");
}

function retgetTemp(data) {
	var temp = data.retstr;
	var str = data.calldata;
	FtpGetFile(str, temp, "retGetFile", temp, "");
}

function retGetFile(data) {
	var str = data.calldata;
	LoadFile(str, HWCallBack, "", "打开文档失败");
	FtpDisConnect("", "", "");
}
/********************************************
 *****文件提交FTP服务器****
 *******************************************/
function ExSaveFtp(FtpIp, lPort, strUse, strPwd, strFtpFile) {
	FtpConnect(FtpIp, lPort, strUse, strPwd, "retExSaveFtp", strFtpFile, "");
}

function retExSaveFtp(data) {
	var str = data.calldata;
	GetTempFileName("", "retputTemp", str, "");
}

function retputTemp(data) {
	var temp = data.retstr;
	var str = data.calldata;
	var strs = temp + "`" + str;
	SaveTo(temp, 'pdf', 0, "retSaveto", strs, "");
}

function retSaveto(data) {
	var str = data.calldata;
	var strs = str.split("`");
	FtpPutFile(strs[0], strs[1], "retGetFile", temp, "");
}

function retGetFile(data) {
	var str = data.calldata;
	LoadFile(str, HWCallBack, "", "打开文档失败");
	FtpDisConnect("", "", "");
}

function ExCallBack(data) {
	if (data.retcode != 0) {
		alert(data.ErrMsg);
	}
}
/********************************************
 ***************判断服务器状态回调*********
 *******************************************/
function rebAIPping(id) {
	alert("服务状态：" + id);
}
/********************************************
 ***************打印文档*********
 *******************************************/
function ExPrint(flag, isShow) {
	PrintDoc(flag, isShow, "", "", "");
}
/********************************************
 ***************关闭文档*********
 *******************************************/
function ExClose(data) {
	CloseDoc(data, "", "", "");
}
/********************************************
 ***********	手动盖章	*****
 *******************************************/
function ExAddSeal() {
	ShowAipWnd(DSP_MODE_PRIMARY_MAX, 50, 50, 'rebCurSealAction', '', ''); //满屏显示最前面
}

function rebCurSealAction() {
	CurrAction("2568", "", "", "");
}
/********************************************
 ***********	自动盖章（坐标）	*****
 *******************************************/
function ExAddSealXY() {
	AddQifengSeal(0, '0,35000,0,16000,50,0', '', 'AUTO_ADD_SEAL_FROM_PATH', '', '', ''); //满屏显示最前面
}

function rebCurSealAction() {
	CurrAction("2568", "rebunfull", "", "");
}

function rebunfull(data) {
	alert("回调函数：" + data.type);
}
/********************************************
 ***********	自动盖章（文字）	*****
 *******************************************/
function ExAddSealFont() {
	AddQifengSeal(0, 'AUTO_ADD:0,-1,1000,1000,1,征求意见)|(0,', '', 'AUTO_ADD_SEAL_FROM_PATH', '', '', '');
}

function rebCurSealAction() {
	CurrAction("2568", "", "", "");
}
/********************************************
 ***********	骑缝章	*****
 *******************************************/
function ExAddSealQF() {
	AddQifengSeal(0, '0,25000,1,3,50,1,2,', '', 'AUTO_ADD_SEAL_FROM_PATH', '', '', '');
}
/********************************************
 ***********	全屏手写	*****
 *******************************************/
function ExFull() {
	ShowAipWnd(DSP_MODE_PRIMARY_MAX, 50, 50, 'rebExFull', '', '');; //满屏显示最前面
}

function rebExFull() {
	CurrAction("264", "", "", ""); //手写模式
}
/********************************************
 ***********	弹出框手写	*****
 *******************************************/
function loginUser() { //登录
	Login("", 1, 65535, "", "", "", "", ""); //ukey登录
	//Login("HWSEALDEMO**", 4, 65535, "DEMO", "", "", "", "");//测试登录
}

function insertHandWrite() { //插入手写区域
	InsertNote('Area', 0, 2, 40000, 40000, 7000, 3000, '', '', '');
}

function ExwriteHand() {
	loginUser();
	insertHandWrite();
	SetShowFullScreen(1, 'showAip', '1', ''); //全屏模式显示，弹出框外屏
}

function showAip() {
	ShowAipWnd(DSP_MODE_PRIMARY_MAX, 50, 50, 'writeSetValue', '', ''); //满屏显示最前面
}
//回调设置白板手写模式
function writeSetValue() {
	SetValue("Area", ":PROP::CLICKPOP:1", "rebSetValue", "", ""); //手写区域活动状态
}
//回调进入阻塞式弹出手写模式
function rebSetValue() {
	SetValue("Area", ":PROP:ACTIVATE:2", "", "", "");
}
/********************************************
 ***********	设置笔宽颜色	*****
 *******************************************/
function ExPenWidth(data) {
	SetCurrPenWidth(data, '', '', ''); //设置笔宽
}
/********************************************
 ***********	隐藏/显示菜单栏	*****
 *******************************************/
function ExHideMenuItem(data) {
	SetShowDefMenu(data, '', '', '');
}
/********************************************
 ***********	隐藏/显示工具栏	*****
 *******************************************/
function ExHideToolBar(data) {
	SetShowToolBar(data, '', '', '');
}
/********************************************
 ***********	页面显示	*****
 *******************************************/
function ExSetPageMode(type, percent) {
	SetPageMode(type, percent, '', '', '');
}
/********************************************
 ***********	word修订	*****
 *******************************************/
function ExShowRevisions(data) { //设置状态
	SetShowRevisions(data, 'test', '', '');
}

function ExgetShowRevisions(data) { //获取状态
	alert(GetShowRevisions('', '', ''));
}
/********************************************
 ***********	word保护	*****
 *******************************************/
function ExProtectDoc(type, pwd, protect) {
	ProtectDoc(type, pwd, protect, '', '', '');
}
/********************************************
 ***********	DEMO	*****
 *******************************************/
function ShowEdit() {
	loginUser();
	ExLoadFiledoc('', 'doc');
	//ShowAipWnd(9,50,50,'','','');
	ExHideToolBar(2);
}
/********************************************
 ***********	国投接口	*****
 *******************************************/
function OpenFileGT() {
	ExHideToolBar(1); //显示工具栏
	HideBarItems(0, 0, 0, 46, 0, 0, '', '', ''); //隐藏打开，新建菜单
	dispidLoadOriginalFile("", "doc", "retGT", "", "");
}

function retGT() {
	ShowAipWnd(9, 50, 50, '', '', '');
	MonitorServEvent('17-1;', 'MonitorServEventback', '', '');
}
